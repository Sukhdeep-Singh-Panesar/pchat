import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: {
    create: jest.Mock;
    findAll: jest.Mock;
  };

  beforeEach(async () => {
    usersService = {
      create: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [{ provide: UsersService, useValue: usersService }],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('passes the request fields to the service and returns the created user', async () => {
    const body = { username: 'alice', email: 'alice@example.com' };
    const user = { id: 'user-1', ...body };
    usersService.create.mockResolvedValue(user);

    await expect(controller.create(body)).resolves.toEqual(user);
    expect(usersService.create).toHaveBeenCalledWith(body.username, body.email);
    expect(usersService.create).toHaveBeenCalledTimes(1);
  });

  it('returns the users supplied by the service', async () => {
    const users = [
      { id: 'user-1', username: 'alice', email: 'alice@example.com' },
    ];
    usersService.findAll.mockResolvedValue(users);

    await expect(controller.findAll()).resolves.toEqual(users);
    expect(usersService.findAll).toHaveBeenCalledWith();
    expect(usersService.findAll).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list when the service has no users', async () => {
    usersService.findAll.mockResolvedValue([]);

    await expect(controller.findAll()).resolves.toEqual([]);
  });

  it('propagates a failed service read', async () => {
    const error = new Error('Unable to list users');
    usersService.findAll.mockRejectedValue(error);

    await expect(controller.findAll()).rejects.toBe(error);
  });
});
