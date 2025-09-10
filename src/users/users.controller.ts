import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Session,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import {
  Serialize,
  SerializeIntercepetor,
} from '../../src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { CurrentUser } from './decorators/current-user.decorator';
import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { AuthGuard } from '../../src/guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private userSerivce: UsersService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async createUser(@Body() body: CreateUserDto, @Session() session: any) {
    //return this.userSerivce.create(body.email, body.password);
    const user = await this.authService.signup(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  @Post('signin')
  async signin(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.signin(body.email, body.password);
    session.userId = user.id;
    return user;
  }

  // @Get('user/me')
  // getProfile(@Session() session: any) {
  //   return this.userSerivce.findOne(session.userId);
  // }


  @Get('user/me')
  @UseGuards(AuthGuard)
  getProfile(@CurrentUser() user: User) {
    return user
  }

  @Post('logout')
  logout(@Session() session: any) {
    session.userId = null;
  }

  // @UseInterceptors(ClassSerializerInterceptor)
  // @UseInterceptors(new SerializeIntercepetor(UserDto))
  // @Serialize(UserDto)
  @Get('/:id')
  async findUser(@Param('id') id: string) {
    const user = await this.userSerivce.findOne(parseInt(id));
    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    return user;
  }

  @Get()
  find(@Query('email') email: string) {
    return this.userSerivce.find(email);
  }

  @Delete('/:id')
  removeUser(@Param('id') id: string) {
    return this.userSerivce.remove(parseInt(id));
  }

  @Patch('/:id')
  updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.userSerivce.update(parseInt(id), body);
  }

  //   @Post('/colors/:color')
  //   setColor(@Param('color') color: string, @Session() session: any) {
  //     session.color = color;
  //   }

  //   @Get('/colors')
  //   getColor(@Session() session : any){
  //     return session.color
  //   }
}
