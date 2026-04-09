import { Injectable } from '@nestjs/common';
import { User } from 'src/users/entities/user.entity';
import { SingUpInput } from './dto/inputs/singup.input';
import { AuthResponse } from './types/auth-response.type';
import { UsersService } from 'src/users/users.service';

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

}   
