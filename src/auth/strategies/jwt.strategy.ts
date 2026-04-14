import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";
import { JwtPayload } from "../intefaces/jwt-payload.interface";
import { AuthService } from "../auth.service";


@Injectable() 
export  class JwtStrategy extends PassportStrategy(Strategy) {
    
 

    constructor(
        private readonly configService: ConfigService,
        private readonly authService: AuthService, // Inyectamos el AuthService para validar el token
        // Aquí podrías inyectar tu servicio de usuarios si necesitas validar que el usuario aún exista
        // private readonly usersService: UsersService, 
    ) {
        super({
                    secretOrKey: configService.get<string>('JWT_SECRET')!,
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
                });
    }


    async validate(payload: JwtPayload) : Promise<User> {
        console.log('Validando JWT...' , {payload});

        const { id } = payload;

        const user = await this.authService.validateUser(id);

        return user

    }


}