import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  Param,
  Patch,
  Post,
  //   Query,
  //   UsePipes,
  //   ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/CreateUser.dto';
import mongoose from 'mongoose';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { FindUserParam } from './dto/FindUserParam.dto';
import { ReturnUserDto } from './dto/ReturnUser.dto';

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post('/create')
  //   @UsePipes(new ValidationPipe()) must be used if global validation pipe is not used.
  async createUser(
    @Body() createUser: CreateUserDto,
  ): Promise<ReturnUserDto | HttpException> {
    // const generateUser = { ...createUser, exists: true };
    return this.userService.createUser(createUser);
  }

  @Post('/recreate/:id')
  //   @UsePipes(new ValidationPipe()) must be used if global validation pipe is not used.
  recreateUser(
    @Body() createUser: CreateUserDto,
    @Param('id') id: string,
  ): Promise<ReturnUserDto | HttpException> {
    // const generateUser = { ...createUser, exists: true };
    return this.userService.recreateUser(id, createUser);
  }

  @Get('/findall')
  async getAllUsers(): Promise<ReturnUserDto[] | HttpException> {
    //@Query('id') id: string, @Query('email') email: string
    return this.userService.findAll();
    // try {
    //   const users = await this.userService.findAll();
    //   // Map each user data to ReturnUserDto instance using the constructor
    //   const returnUserDtos = users.map((user) => new ReturnUserDto(user));
    //   return returnUserDtos;
    // } catch (error) {
    //   // Handle errors appropriately
    //   return new HttpException('Internal server error', 500);
    // }
  }

  @Get('/findone/:id')
  async getUserById(
    @Param('id') id: string,
  ): Promise<ReturnUserDto | HttpException> {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return new HttpException('Invalid ID', 400);
    const user = await this.userService.findUserById(id);
    if (!user) return new HttpException('User not found.', 404);
    return user;
  }

  @Get('/existingusers')
  getAllExistingUsers(): Promise<ReturnUserDto[] | HttpException> {
    //@Query('id') id: string, @Query('email') email: string
    const finder: FindUserParam = {
      exists: true,
    };
    return this.userService.findUserByParams(finder);
  }

  @Get('/deletedusers')
  getAllDeletedUsers(): Promise<ReturnUserDto[] | HttpException> {
    //@Query('id') id: string, @Query('email') email: string
    const finder: FindUserParam = {
      exists: false,
    };
    return this.userService.findUserByParams(finder);
  }

  @Post('/param')
  async getUserByParam(
    @Body() findUser: FindUserParam,
  ): Promise<ReturnUserDto[] | HttpException> {
    const user = await this.userService.findUserByParams(findUser);
    if (user.length === 0)
      return new HttpException('User/Users not found.', 404);
    return user;
  }

  @Patch('/update/:id')
  async updateUserById(
    @Param('id') id: string,
    @Body() updateUser: UpdateUserDto,
  ): Promise<ReturnUserDto | HttpException> {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return new HttpException('Invalid ID', 400);
    const updatedUser = await this.userService.updateUserById(id, updateUser);
    return updatedUser;
  }

  @Delete('/harddelete/:id')
  async deleteUserHard(@Param('id') id: string) {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return new HttpException('Invalid ID', 400);
    const user = await this.userService.deleteUserHard(id);
    if (!user) return new HttpException('User not found.', 404);
    return { message: 'User deleted successfully.' };
  }

  @Delete('/softdelete/:id')
  async deleteUserSoft(@Param('id') id: string) {
    const validId = mongoose.isValidObjectId(id);
    if (!validId) return new HttpException('Invalid ID', 400);

    const user = await this.userService.findUserById(id);
    if (!user) return new HttpException('User not found.', 404);
    else if (user.exists === false)
      return new HttpException('User already deleted.', 400);
    // console.log(user);
    user.exists = false;
    const deleteUser = await this.userService.updateUserById(id, user);
    if (!deleteUser)
      return new HttpException('Could not delete user. Try again!', 409);
    return { message: 'User deleted successfully.' };
  }
}
