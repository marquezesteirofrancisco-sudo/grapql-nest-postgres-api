import { BadRequestException, Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SingUpInput } from './dto/inputs/singup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';
import { LoginInput } from './dto/inputs';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService /* TODO: Inyectar el servicio de usuarios */
    ) {}

    async signup( signupInput: SingUpInput ) : Promise<AuthResponse> {

        // TODO: crear usuario  
        const user = await this.usersService.create(signupInput);


        // TODO: generar el JWT
        const token = 'por definir';

        console.log({signupInput});

        return {
                token,
                user
            } 
        
    }

    async login( loginInput: LoginInput ) : Promise<AuthResponse> {

        const { email, password } = loginInput;

        const user = await this.usersService.findOneByEmail(email);

        // si no coinciden las contraseñas, lanzar una excepción
        if (!bcrypt.compareSync(loginInput.password, user.password)) {
            throw new BadRequestException('Invalid credentials');
        }

        //TODO: generar el JWT
        const token = "ABC123";

        return {
            token,
            user
        }
    }  
}

