import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { create } from "domain";

export const CurrentUser = createParamDecorator(
    (roles=[], context : ExecutionContext) => {

        const cts = GqlExecutionContext.create(context);

        const user = cts.getContext().req.user;

        if (!user) 
            throw new InternalServerErrorException('Not user inside request - make sure that the auth guard is being used');

        return user;

    }
)





     
