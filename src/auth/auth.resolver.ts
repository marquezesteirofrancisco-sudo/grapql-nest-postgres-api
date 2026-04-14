import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SingUpInput , LoginInput } from './dto/inputs/index';
import { AuthResponse } from './types/auth-response.type';
import { AuthGuard } from '@nestjs/passport';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guards';
import { CurrentUser } from './decorators/current-user.decorator';
import { User } from 'src/users/entities/user.entity';
import { ValidRoles } from './enums/valid-roles.enum';

@Resolver( () => AuthResponse )
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}


  @Mutation( () => AuthResponse, {name: 'signup' })
  async signup(
    @Args('signupInput') signupInput: SingUpInput  /* no defino el tipo de dato */
  ) : Promise<AuthResponse> {   

    return this.authService.signup(signupInput);
  }



  @Mutation( () => AuthResponse, {name: 'login' })
  async login(
    @Args('loginInput') loginInput: LoginInput  /* no defino el tipo de dato */
  ) : Promise<AuthResponse> {   

    return this.authService.login(loginInput);
  }

  
  @Query(() => AuthResponse, {name: 'revalidate' })
  @UseGuards(JwtAuthGuard)
  revalidateToken(
    @CurrentUser( /**[ValidRoles.admin]**/) user: User /* no defino el tipo de dato */
    ) : AuthResponse {

      return this.authService.revalidateToken(user);


  } 
}
