import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(
      'mongodb+srv://suraj:Suraj@cluster0.l16ymfb.mongodb.net/',
      {
        dbName: 'sampleData',
      },
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
