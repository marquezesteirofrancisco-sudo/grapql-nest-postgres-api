import { Injectable } from '@nestjs/common';
import { CreateItemInput } from './dto/inputs/create-item.input';
import { UpdateItemInput } from './dto/inputs/update-item.input';
import { Item } from './entities/item.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
 

@Injectable()
export class ItemsService {


  constructor(
    @InjectRepository(Item)
    private readonly itemsRepository: Repository<Item>  
  ) {  }

  async create(createItemInput: CreateItemInput, user: User) : Promise<Item> {

    const newItem = this.itemsRepository.create({ ...createItemInput, user });
    return await this.itemsRepository.save(newItem);
  }

  async findAll( user: User) : Promise<Item[]> {

    // TODO: Implement pagination and filtering, por usuario, etc
   
    return await this.itemsRepository.find(user ? { where: { user: { id: user.id } } } : {});
  }

  async findOne(id: string, user: User) : Promise<Item> {

    const item = await this.itemsRepository.findOne({ where: { id, user: { id: user.id } } });
    //const item = await this.itemsRe pository.findOneBy({ id })

    if (!item) { throw new Error(`Item with id ${id} not found`); }

    return item;
  }

  async update(id: string, updateItemInput: UpdateItemInput, user: User) : Promise<Item> {

    // si no lo encuentra, lanza error, si lo encuentra pero no pertenece al usuario, lanza error 
    await this.findOne(id, user); // Ensure the item exists and belongs to the user

    const item = await this.itemsRepository.preload(updateItemInput);

    if (!item) { throw new Error(`Item with id ${id} not found`); }

    return await this.itemsRepository.save(item);
  }

  async remove(id: string, user: User ) :  Promise<Item> {
    //TODO: soft delete, integridad referencial, etc
    const item = await this.findOne(id, user);

    await this.itemsRepository.remove(item);

    return {...item, id};
  }
}
