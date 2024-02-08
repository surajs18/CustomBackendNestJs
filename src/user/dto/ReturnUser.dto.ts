import { Exclude, Expose } from 'class-transformer';

export class ReturnUserDto {
  constructor(dto?: Partial<ReturnUserDto>) {
    if (dto) {
      // Copy over exposed properties
      this.userName = dto.userName;
      this.email = dto.email;
      this.phone = dto.phone;
      this._id = dto._id;
      this.exists = dto.exists;
    }
  }
  @Expose()
  userName: string;

  @Expose()
  email: string;

  @Expose()
  phone?: number;

  @Exclude()
  password: string;

  @Expose()
  _id?: any;

  @Expose()
  exists?: boolean;
}
