import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;

  let fakeUsersService: Partial<UsersService>;

  beforeEach(async () => {
    const users: User[] = [];
    fakeUsersService = {
      find: (email: string) => {
        const filtered = users.filter((user) => user.email === email);
        return Promise.resolve(filtered);
      },
      create: (email: string, password: string) => {
        // Promise.resolve({ id: 1, email, password } as User),
        const user = {
          id: Math.floor(Math.random() * 99999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates new user with hash password and email', async () => {
    const user = await service.signup('abc@yopmail.com', 'password');

    expect(user.password).not.toEqual('password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('throws an error if user signs up with the email in use', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'abc@yopmail.com', password: 'password' } as User,
    //   ]);

    await service.signup('abc@yopmail.com', 'password')

    await expect(
      service.signup('abc@yopmail.com', 'password'),
    ).rejects.toThrow();
  });

  it('throws an error if user does not exits', async () => {
    await expect(
      service.signin('abc@yopmail.com', 'password'),
    ).rejects.toThrow();
  });

  it('throws an error if invalid password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     { id: 1, email: 'abc@yopmail.com', password: 'password' } as User,
    //   ]);    

    await service.signup('abc@yopmail.com', 'password1')

    await expect(service.signin('abc@yopmail.com', 'password')).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns a user when correct password is provided', async () => {
    // fakeUsersService.find = () =>
    //   Promise.resolve([
    //     {
    //       id: 1,
    //       email: 'abc@yopmail.com',
    //       password:
    //         'ffecd3ee098c11a3.2df99e783aba808fd1f9f65fdcf45e315dcbcc0398a05520fd47c322434ec51e',
    //     } as User,
    //   ]);

    await service.signup('abc@yopmail.com', 'password');

    const user = await service.signin('abc@yopmail.com', 'password');
    expect(user).toBeDefined();
  });
});
