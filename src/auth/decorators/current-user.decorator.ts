import { createParamDecorator, ExecutionContext, ForbiddenException, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { create } from "domain";
import { ValidRoles } from "../enums/valid-roles.enum";

export const CurrentUser = createParamDecorator(
    (roles : ValidRoles[] = [], context : ExecutionContext) => {

        const cts = GqlExecutionContext.create(context);

        const user = cts.getContext().req.user;

        if (!user) 
            throw new InternalServerErrorException('Not user inside request - make sure that the auth guard is being used');

        if (roles.length === 0) return user;

        

        // TODO: eliminar validacion de roles, ya que se va a manejar con el guard de roles

        for (const role of user.roles) {
            if (roles.includes(role as ValidRoles)) 
                return user;
        }
    
        throw new ForbiddenException(`User ${user.fullName} need a valid role : [${roles}]`);

    }
)





     
