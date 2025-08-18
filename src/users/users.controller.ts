import { Body, ClassSerializerInterceptor, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
import { Serialize, SerializeIntercepetor } from 'src/interceptors/serialize.interceptor';
import { UserDto } from './dtos/user.dto';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {

    constructor(private userSerivce : UsersService){}

    @Post('signup')
    createUser(@Body() body : CreateUserDto){
        this.userSerivce.create(body.email, body.password);
    }

    // @UseInterceptors(ClassSerializerInterceptor)
    // @UseInterceptors(new SerializeIntercepetor(UserDto))
    // @Serialize(UserDto)
    @Get('/:id')
    async findUser(@Param('id') id :string){
        const user =  await this.userSerivce.findOne(parseInt(id))
        if(!user){
            throw new NotFoundException("User Not Found")
        }
        return user;
    }

    @Get()
    find(@Query('email') email :string){
        return this.userSerivce.find(email)
    }

    @Delete('/:id')
    removeUser(@Param('id') id:string){
        return this.userSerivce.remove(parseInt(id))
    }

    @Patch("/:id")
    updateUser(@Param('id') id:string,@Body() body : UpdateUserDto){
        return this.userSerivce.update(parseInt(id),body)
    }

}
