import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from './user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUserService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;

  beforeEach(async () => {
    fakeUserService = {
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'molly@yopmail.com',
          password: 'password',
        } as User);
      },
      find: (email: string) => {
        return Promise.resolve([
          { id: 5, email, password: 'password' } as User,
        ]);
      },
      // update: () => {},
      // remove: () => {},
    };
    fakeAuthService = {
      signin: (email: string, password: string) => {
        return Promise.resolve({ id: 1, email, password } as User);
      },
      // signup: (email: string, password: string) => {},
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => {
      return Promise.resolve(null);
    };

    await expect(controller.findUser('1')).rejects.toThrow();
  });
  it('findUser throws an error if user with given id is not found', async () => {
    fakeUserService.findOne = () => {
      return Promise.resolve(null);
    };

    await expect(controller.findUser('1')).rejects.toThrow();
  });

  it('findAllUsers returns a single user with the given id', async () => {
    const user = await controller.find('1');

    expect(user.length).toEqual(1);
  });

  it('signin updates session object and returns user', async () => {
    const session = { userId: -10 };
    const user = await controller.signin(
      {
        email: 'asd1@gmail.com',
        password: 'password',
      } as User,
      session,
    );

    expect(user.id).toEqual(1)
    expect(session.userId).toEqual(1)
  });
});
