import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { FindPasswordDto } from './dto/findPassword.dto';

@Controller('findInfo')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('email')
  async findEmail(@Body() createUserDto: CreateUserDto) {
    return this.userService.findEmail(createUserDto);
  }

  @Post('')
  findPassword(@Body() findPasswordDto: FindPasswordDto) {
    return this.userService.findPassword(findPasswordDto);
  }
}
