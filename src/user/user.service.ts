import { HttpException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { UpdateUserDto } from './dto/UpdateUser.dto';
import { FindUserParam } from './dto/FindUserParam.dto';
import * as bcrypt from 'bcrypt';
import { ReturnUserDto } from './dto/ReturnUser.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async encrypt(data: any) {
    if (data.password !== '' && data.password) {
      const password: string = data.password;
      const saltOrRounds: number = 10;
      const hash = await bcrypt.hash(password, saltOrRounds);
      const hashedData = { ...data, password: hash };
      return hashedData;
    }
    return data;
  }

  async createUser(createUserDto: CreateUserDto) {
    try {
      let createUserData = createUserDto;
      if ('password' in CreateUserDto)
        createUserData = await this.encrypt(createUserDto);
      const newUser = new this.userModel(createUserData);
      const response = await newUser.save();
      return new ReturnUserDto(response.toObject());
    } catch (err) {
      const findUser = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (findUser.exists) {
        const key = Object.keys(err.keyValue);
        const value = Object.values(err.keyValue);
        return new HttpException(
          `${key.toString().toLocaleUpperCase()} ${value} already exists`,
          409,
        );
      }
      const recreateUser = await this.recreateUser(
        findUser._id.toString(),
        createUserDto,
      );
      if (!recreateUser)
        return new HttpException('User could not be create. Try Again!', 400);
      return recreateUser;
    }
  }

  async recreateUser(id: string, createUserDto: CreateUserDto) {
    const response = await this.userModel.findByIdAndUpdate(
      id,
      {
        ...createUserDto,
        exists: true,
      },
      { new: true },
    );
    return new ReturnUserDto(response.toObject());
  }

  findAll() {
    return this.findUserByParams();
  }

  async findUserById(id: string) {
    const user = await this.userModel.findOne({ _id: id });
    if (!user) return user;
    const response = new ReturnUserDto(user.toObject());
    return response;
  }

  async findUserByParams(findUser?: FindUserParam) {
    // console.log(findUser);
    const userList = await this.userModel.find(findUser);
    const response = userList.map((user) => new ReturnUserDto(user.toObject()));
    return response;
  }

  async updateUserById(id: any, updateUser: UpdateUserDto) {
    try {
      let updateUserData: any = updateUser;
      if ('password' in UpdateUserDto)
        updateUserData = await this.encrypt(updateUser);
      //   console.log('update user', updateUserData);
      const user = await this.userModel.findByIdAndUpdate(id, updateUserData, {
        new: true,
      });
      //   console.log('response', response);
      if (!user) return new HttpException('User does not exist.', 404);
      const response = new ReturnUserDto(user.toObject());
      return response;
    } catch (err) {
      return new HttpException(
        `${Object.keys(err.keyValue)} ${Object.values(err.keyValue)} already exists`,
        409,
      );
    }
  }

  deleteUserHard(id: any) {
    return this.userModel.findByIdAndDelete(id);
  }
}
