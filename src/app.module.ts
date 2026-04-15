import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { ItemsModule } from './items/items.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { validateHeaderName } from 'http';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { JwtService } from '@nestjs/jwt';


@Module({
  imports: [

        ConfigModule.forRoot({isGlobal: true,}),

        // TODO: Configracion Basica sin JWT
        // GraphQLModule.forRoot<ApolloDriverConfig>({
        //     driver: ApolloDriver,
        //     // debug: false,
        //     playground: false,
        //     autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
        //     plugins: [
        //       ApolloServerPluginLandingPageLocalDefault(), // Activamos la nueva interfaz
        //     ]}
        // ),



        GraphQLModule.forRootAsync({
          driver: ApolloDriver,
          imports: [AuthModule],
          inject:  [JwtService],
        
          useFactory: async (jwtService: JwtService) => ({

            playground: false,
            autoSchemaFile: join( process.cwd(), 'src/schema.gql'),
            plugins: [
              ApolloServerPluginLandingPageLocalDefault(), // Activamos la nueva interfaz
            ],
            context: ({ req }) => {
              const token = req.headers.authorization?.replace('Bearer ', '');
              if (!token) 
                throw new Error('Token no proporcionado');
 

              const playground = jwtService.decode(token);
              if (!playground)
                  throw new Error('Token inválido');

 
            }
          }),  

        }),


        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST,
          port: +(process.env.DB_PORT ?? 5432),
          username: process.env.DB_USERNAME,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
          synchronize: true,
          autoLoadEntities: true,
        }),


        ItemsModule,

        UsersModule,

        AuthModule,


        




  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
