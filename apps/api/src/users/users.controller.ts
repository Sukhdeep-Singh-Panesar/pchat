import { Body, Controller, Get, Post  } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

@Post()
create(@Body() body: { username: string; email: string }) {
    return this.usersService.create(body.username, body.email);
}

@Get()
async findAll() {
return this.usersService.findAll();
}
}
