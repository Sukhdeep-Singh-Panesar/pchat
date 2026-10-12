import { jest } from '@jest/globals';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: {
    user: {
      create: jest.Mock<
        (input: {
          data: { username: string; email: string };
        }) => Promise<unknown>
      >;
      findMany: jest.Mock<() => Promise<unknown>>;
    };
  };

  beforeEach(async () => {
    prisma = {
      user: {
        create: jest.fn(),
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, { provide: PrismaService, useValue: prisma }],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('creates a user with the supplied username and email', async () => {
    const user = {
      id: 'user-1',
      username: 'alice',
      email: 'alice@example.com',
    };
    prisma.user.create.mockResolvedValue(user);

    await expect(service.create(user.username, user.email)).resolves.toEqual(
      user,
    );
    expect(prisma.user.create).toHaveBeenCalledWith({
      data: { username: user.username, email: user.email },
    });
    expect(prisma.user.create).toHaveBeenCalledTimes(1);
  });

  it('returns users from the database', async () => {
    const users = [
      { id: 'user-1', username: 'alice', email: 'alice@example.com' },
    ];
    prisma.user.findMany.mockResolvedValue(users);

    await expect(service.findAll()).resolves.toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith();
    expect(prisma.user.findMany).toHaveBeenCalledTimes(1);
  });

  it('returns an empty list when there are no users', async () => {
    prisma.user.findMany.mockResolvedValue([]);

    await expect(service.findAll()).resolves.toEqual([]);
  });

  it('propagates a failed database write', async () => {
    const error = new Error('Database write failed');
    prisma.user.create.mockRejectedValue(error);

    await expect(service.create('alice', 'alice@example.com')).rejects.toBe(
      error,
    );
  });
});
