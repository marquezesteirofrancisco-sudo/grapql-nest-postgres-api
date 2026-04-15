import { registerEnumType } from "@nestjs/graphql";
import { register } from "module";

//TODO: implementar enum como un GraphQL Enum Type
export enum ValidRoles{

    admin = 'admin',
    user = 'user',
    superUser = 'superuser',
}

registerEnumType(ValidRoles, {
    name: 'ValidRoles',
    description: 'Roles de usuario validos...'
})