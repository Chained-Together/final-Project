import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/utils/user-info.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/updata-User.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@Controller('findInfo')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('email')
  async findEmail(@Body() createUserDto: CreateUserDto) {
    return this.userService.findEmail(createUserDto);
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  deleteUserAccount(@UserInfo() user: UserEntity, @Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteUserAccount(user, deleteUserDto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  async updateUserProfile(@UserInfo() user: UserEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserProfile(user, updateUserDto);
  }
}
