import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { SingUpInput } from './dto/inputs/singup.input';
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



  // @Mutation( /* no defino el tipo de dato */, {name: 'login' })
  // async login(/* no defino el tipo de dato */) : Promise</*algun tipo de dato*/> {   

  //   //return this.authService.login(/* no defino el tipo de dato */);
  // }

  
  // @Query( /* no defino el tipo de dato */, {name: 'revalidate' })
  // async revalidateToken(/* no defino el tipo de dato */) : Promise</*algun tipo de dato*/> {

  //   //return this.authService.revalidateToken(/* no defino el tipo de dato */);
  // } 
}
