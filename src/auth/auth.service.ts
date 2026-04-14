import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginInput } from './dto/inputs';
import { SingUpInput } from './dto/inputs/singup.input';
import { AuthResponse } from './types/auth-response.type';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/users.service';


@Injectable()
export class AuthService {

    constructor(
        private readonly usersService: UsersService, /* TODO: Inyectar el servicio de usuarios */
        private readonly jwtService: JwtService, /* TODO: Inyectar el servicio de JWT para generar los tokens */
    ) {}


    private getJwtToken(userId: string) {
        return  this.jwtService.sign({id:userId});
    }

    async signup( signupInput: SingUpInput ) : Promise<AuthResponse> {

        // TODO: crear usuario  
        const user = await this.usersService.create(signupInput);

        // TODO: generar el JWT
        const token = this.getJwtToken(user.id);

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

        // TODO: generar el JWT
        const token = this.getJwtToken(user.id);

        return {
            token,
            user
        }
    }  

    async validateUser(id: string) : Promise<User> {

        const user = await this.usersService.findOneById(id);

        if (!user.isActive) {
            throw new UnauthorizedException('user is inactive, talk with an admin');
        }


        return user
    }
}

