import { Injectable, UseFilters } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Item } from 'src/items/entities/item.entity';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import { SEED_USERS } from './data/seed-data';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SeedService {

    private isProd: boolean = false;

constructor(private readonly configService: ConfigService,
    @InjectRepository(Item) 
    private readonly itemsRepository: Repository<Item>,

    @InjectRepository(User) 
    private readonly usersRepository: Repository<User>,

    private readonly usersService: UsersService
) 
{
    this.isProd = this.configService.get('STATE') === 'prod';
    
}

async executeSeed(): Promise<boolean> {

        if (this.isProd) {
            throw new Error('No se pueden ejecutar los seeds en producción');
        }

        // Limpiar la base de datos, BORRAR DATOS
        await this.deleteDatabase();

        // Crear Usuarios
        await this.loadUsers();

        // Crear Items
        return true;
    }

    async deleteDatabase() {

        await this.itemsRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();


        await this.usersRepository.createQueryBuilder()
            .delete()
            .where({})
            .execute();
    }

    async loadUsers(): Promise<User> {

        const users : User[] = []

        for (const user of SEED_USERS) {
            users.push( await this.usersService.create(user) );
        }

        return users[0];

    }
}
