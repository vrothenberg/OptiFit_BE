import { Controller, Get, Post, Put, Delete, Body, Param, ParseIntPipe, UsePipes, ValidationPipe } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // POST /user
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  // GET /user
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  // GET /user/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(id);
  }

  // PUT /user/:id
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  // DELETE /user/:id
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  // GET /user/profile/:userId
  @Get('profile/:userId')
  getProfile(@Param('userId', ParseIntPipe) userId: number) {
    return this.userService.getUserProfile(userId);
  }

  // PUT /user/profile/:userId
  @Put('profile/:userId')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  updateProfile(
    @Param('userId', ParseIntPipe) userId: number,
    @Body() updateUserProfileDto: UpdateUserProfileDto,
  ) {
    return this.userService.updateUserProfile(userId, updateUserProfileDto);
  }
}
