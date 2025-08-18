import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup(email: string, password: string) {
    const user = await this.usersService.find(email);
    if(user?.length > 0){
         throw new BadRequestException('User Already Exists')
    }
  }

  signin() {}
}
