import { Body, Controller, Delete, Post, Put, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserInfo } from 'src/utils/user-info.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { UpdateUserDto } from './dto/updata-User.dto';
import { UserEntity } from './entities/user.entity';
import { UserService } from './user.service';

@ApiTags('사용자 정보 API') // Swagger 그룹 태그
@Controller('findInfo')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('email')
  @ApiOperation({
    summary: '사용자 이메일 찾기',
    description: '사용자의 이름과 기타 정보를 입력하여 이메일을 조회합니다.',
  })
  @ApiOkResponse({
    description: '사용자 이메일이 성공적으로 반환됩니다.',
  })
  async findEmail(@Body() createUserDto: CreateUserDto) {
    return this.userService.findEmail(createUserDto);
  }

  @Delete('')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 계정 삭제',
    description: 'JWT 인증을 사용하여 현재 로그인된 사용자의 계정을 삭제합니다.',
  })
  @ApiBody({
    description: '계정 삭제를 위한 추가 정보',
    type: DeleteUserDto,
  })
  @ApiOkResponse({
    description: '사용자 계정이 성공적으로 삭제되었습니다.',
  })
  deleteUserAccount(@UserInfo() user: UserEntity, @Body() deleteUserDto: DeleteUserDto) {
    return this.userService.deleteUserAccount(user, deleteUserDto);
  }

  @Put()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({
    summary: '사용자 프로필 업데이트',
    description: 'JWT 인증을 사용하여 현재 로그인된 사용자의 프로필 정보를 업데이트합니다.',
  })
  @ApiBody({
    description: '업데이트할 사용자 프로필 정보',
    type: UpdateUserDto,
  })
  @ApiOkResponse({
    description: '사용자 프로필이 성공적으로 업데이트되었습니다.',
  })
  async updateUserProfile(@UserInfo() user: UserEntity, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUserProfile(user, updateUserDto);
  }
}
