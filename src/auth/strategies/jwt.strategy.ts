import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from "src/users/entities/user.entity";


@Injectable() 
export  class JwtStrategy extends PassportStrategy(Strategy) {
    
 

    constructor(
        private readonly configService: ConfigService,
        // Aquí podrías inyectar tu servicio de usuarios si necesitas validar que el usuario aún exista
        // private readonly usersService: UsersService, 
    ) {
        super({
                    secretOrKey: configService.get<string>('JWT_SECRET')!,
                    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
                });
    }


    async validate(payload: any) : Promise<User> {
        console.log('Validando JWT...' , {payload});
        // Aquí podrías validar que el usuario aún exista en la base de datos
        // return this.usersService.findOne(payload.sub);

        throw new Error('Método validate no implementado. Deberías implementar la lógica para validar el usuario aquí.');


    }


}