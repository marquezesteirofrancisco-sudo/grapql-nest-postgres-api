import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { SingUpInput } from 'src/auth/dto/inputs/singup.input';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Int } from '@nestjs/graphql';

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
      const newUser = this.usersRepository.create(signupInput);

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

  findAll() : Promise<User[]>{
    return Promise.resolve([]);
  }

  findOne(id: string) : Promise<User> {
    throw new Error('Method not implemented.');
  }

/*   update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  } */

  block(id: string) : Promise<User> {
    throw new Error('Method not implemented.');
  }

  private handleDBExceptions(error: any): never {

    // error.code 23505 es un error de violación de restricción de unicidad en PostgreSQL
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    
    // TODO: manejar otros errores de la base de datos
    this.logger.error(error);

    // lanzar una excepción genérica para el cliente
    throw new InternalServerErrorException('Unexpected error, check server logs');

  }
}
