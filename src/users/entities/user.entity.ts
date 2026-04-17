import { ObjectType, Field, Int, ID } from '@nestjs/graphql';
import { Exclude } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity({name: 'users'})
@ObjectType()
export class User {

  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id :string;

  @Column()
  @Field(()=> String)
  fullName : string;

  @Column({unique: true})
  @Field(()=> String)
  email : string;

  @Column({select: true}) // no se selecciona por defecto, para que no se muestre en las consultas
  //@Field(()=> String)  
  password : string;

  @Column({type: 'text', array: true, default: ['user']})
  @Field(() => [String])
  roles : string[];

  @Column({type: 'boolean', default: true})
  @Field(() => Boolean) 
  isActive : boolean;

  //TODO: relaciones 
  @ManyToOne( () => User,  (user) => user.lastUpdateBy, { nullable: true , lazy: true} )
  @JoinColumn({ name: 'lastUpdateBy' })
  @Field( () => User, { nullable: true } )
  lastUpdateBy?: User;

}
