import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

    async create(username: string, email: string) {
        return this.prisma.user.create({
            data: {
                username,
                email,
            },
        });
    }

    async findAll() {
        return this.prisma.user.findMany();
    }
}
