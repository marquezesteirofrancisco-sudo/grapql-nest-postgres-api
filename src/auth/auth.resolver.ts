import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SingUpInput , LoginInput } from './dto/inputs/index';
import { AuthResponse } from './types/auth-response.type';

@Resolver()
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

  
  // @Query( /* no defino el tipo de dato */, {name: 'revalidate' })
  // async revalidateToken(/* no defino el tipo de dato */) : Promise</*algun tipo de dato*/> {

  //   //return this.authService.revalidateToken(/* no defino el tipo de dato */);
  // } 
}
