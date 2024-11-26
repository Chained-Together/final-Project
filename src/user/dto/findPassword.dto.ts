import { IsNotEmpty, IsString } from "class-validator";

export class FindPasswordDto{
    @IsString()
    @IsNotEmpty()
    email : string

    @IsString()
    @IsNotEmpty()
    phoneNumber : string
}
