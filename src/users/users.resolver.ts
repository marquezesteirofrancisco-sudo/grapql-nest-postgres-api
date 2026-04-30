import { ParseUUIDPipe, UseGuards } from '@nestjs/common';

import { Resolver, Query, Mutation, Args, Int, ID, ResolveField, Parent } from '@nestjs/graphql';

import { UsersService } from './users.service';

import { Item } from 'src/items/entities/item.entity';
import { User } from './entities/user.entity';

import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { ValidRolesArgs } from './dto/args/roles.arg';

import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guards';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { ValidRoles } from 'src/auth/enums/valid-roles.enum';
import { parse } from 'path';
import { ItemsService } from 'src/items/items.service';
import { PaginationArgs } from 'src/common/dto/args/pagination.args';
import { SearchArgs } from 'src/common/dto/args/search.args';

@Resolver(() => User)
@UseGuards(JwtAuthGuard)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService
  ) {}

  @Query(() => [User], { name: 'users' })
  findAll(
    @Args() validRoles: ValidRolesArgs,
    @CurrentUser( [ValidRoles.admin, ValidRoles.superUser]) user: User
  ) : Promise<User[]> {
  
    return this.usersService.findAll(validRoles.roles);
  }

  @Query(() => User, { name: 'userByEmail' })
  findOneByEmail(
    @Args('email', { type: () => String }) email: string,
    @CurrentUser( [ValidRoles.admin, ValidRoles.superUser]) user: User

  ) : Promise<User> {
    return this.usersService.findOneByEmail(email);
  }

  @Query(() => User, { name: 'userById' })
  findOneById(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser( [ValidRoles.admin, ValidRoles.superUser]) user: User

  ) : Promise<User> {
    return this.usersService.findOneById(id);
  }

/*   @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  } */

  @Mutation(() => User, { name: 'blockUser' })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUser( [ValidRoles.admin]) user: User
  ) : Promise<User>  {
    return this.usersService.block(id, user );
  }

  @ResolveField(() => Int, { name: 'itemCount' })
  async itemCount(
    @CurrentUser([ValidRoles.admin]) userAdmin: User,
    @Parent() user: User
  ) : Promise<number> {
   
    return this.itemsService.itemCountByUser(user);
  }

  @ResolveField(() => [Item], { name: 'items' })
  async getItemsByUser(
    @CurrentUser([ValidRoles.admin]) userAdmin: User,
    @Parent() user: User,
    @Args() paginationsArgs: PaginationArgs,
    @Args() searchArgs: SearchArgs
  
  ) : Promise<Item[]> {
    return this.itemsService.findAll(user, paginationsArgs, searchArgs);
  }
}
