import { ArgsType, Field } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@ArgsType()
export class serchArgs {
    @Field(() => String, { nullable: true })    
    @IsOptional()
    @IsString()
    search?: string;
 
}