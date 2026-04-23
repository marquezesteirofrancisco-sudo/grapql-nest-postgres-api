import { ObjectType, Field, Int, ID, Float } from '@nestjs/graphql';
import { Column, Entity, Index, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Entity({ name: 'items' })
@ObjectType()
export class Item {
 
  @PrimaryGeneratedColumn('uuid')
  @Field(() => ID)
  id:string;

  @Column()
  @Field(() => String)
  name: string;

  // @Column()
  // @Field(() => Float)
  // quantity: number;

  @Column({type:'text' , nullable: true })
  @Field(() => String, { nullable: true })
  quantityUnits?: string | null ; // g, ml, pcs, kg

  @Column({type:'text' , nullable: true })
  @Field(() => String, { nullable: true })
  category?: string | null; 

  //stores

  //users
  @ManyToOne( ()=> User, (user) => user.items, {nullable: false, lazy: true} )
  @Index('idx_user_id')
  @Field(() => User)
  user: User;


}
