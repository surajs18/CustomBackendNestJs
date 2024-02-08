import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ required: true })
  userName: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: false, unique: true })
  phone?: number;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true, default: true })
  exists: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
