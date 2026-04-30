import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SingUpInput } from 'src/auth/dto/inputs/singup.input';
import { createQueryBuilder, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Int } from '@nestjs/graphql';
import * as bcrypt from 'bcrypt';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Injectable()
export class UsersService {

  private readonly logger: Logger = new Logger('UsersService');
  
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User> /* TODO: Inyectar el repositorio de usuarios */
  ) {}

  async create(signupInput: SingUpInput) : Promise<User> {
    
    try
    {
      // crear el nuevo usuario
      const newUser = this.usersRepository.create(
        { ...signupInput, 
          password: bcrypt.hashSync(signupInput.password, 10) 
        });

      // grabar el nuevo usuario en la base de datos
      await this.usersRepository.save(newUser);

      // retornar el nuevo usuario
      return newUser;

    }
    catch(error)
    {
      this.handleDBExceptions(error);
    }
     
  }

  async findAll(roles: ValidRoles[] , paginationArgs: PaginationArgs, searchArgs: SearchArgs) : Promise<User[]>{

    const {limit, offset} = paginationArgs; 
    const { search } = searchArgs;

    const queryBuilder = this.usersRepository.createQueryBuilder('user')
        .take(limit)
        .skip(offset);

    if (search) {
      queryBuilder.andWhere('LOWER(user.fullName) LIKE :search', { search: `%${search}%` });
    }

    // 2. Gestión de Roles
    if (roles.length > 0) {
      // Usamos el operador && de Postgres para intersección de arrays
      queryBuilder.andWhere('user.roles && ARRAY[:...roles]', { roles });
    }

    return await queryBuilder.getMany();
 
  }

  async findOneByEmail(email: string) : Promise<User> {
     
    try
    {
      return await this.usersRepository.findOneByOrFail({ email });
    }
    catch(error)    {
      this.handleDBExceptions({
        code: 'error-001',
        detail: `User with email ${email} not found`
      });
    }
  }

  async findOneById(id: string) : Promise<User> {
     
    try
    {
      return await this.usersRepository.findOneByOrFail({ id });
      
    }
    catch(error)    {
      this.handleDBExceptions({
        code: 'error-001',
        detail: `User with email ${id} not found`
      });
    }

  }


/*   update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  } */

  async block(id: string, adminUser: User) : Promise<User> {

    const userToBlock = await this.findOneById(id);

    userToBlock.isActive = false;
    userToBlock.lastUpdateBy = adminUser;

    return await this.usersRepository.save(userToBlock);

  }

  private handleDBExceptions(error: any): never {

    // error.code 23505 es un error de violación de restricción de unicidad en PostgreSQL
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }

    if (error.code === 'error-001') {
      throw new BadRequestException(error.detail);
    }
    
    // TODO: manejar otros errores de la base de datos
    this.logger.error(error);

    // lanzar una excepción genérica para el cliente
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
