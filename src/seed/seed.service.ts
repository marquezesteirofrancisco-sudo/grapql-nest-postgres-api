import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SeedService {

    private isProd: boolean = false;

constructor(private readonly configService: ConfigService) 
{
    this.isProd = this.configService.get('STATE') === 'prod';
}

async executeSeed(): Promise<boolean> {

        if (this.isProd) {
            throw new Error('No se pueden ejecutar los seeds en producción');
        }

        // Limpiar la base de datos, BORRAR DATOS

        // Crear Usuarios

        // Crear Items

        return true;
    }
}
