import { ConfigService } from '@nestjs/config';
import * as mongoose from 'mongoose';

export const databaseProviders = [
  { 
    inject: [ConfigService],
    provide: 'DATABASE_CONNECTION',
    useFactory: (configService: ConfigService): Promise<typeof mongoose> =>
      mongoose.connect(`mongodb+srv://MisterTwister:${configService.get<string>('DB_PASSWORD')}@${configService.get<string>('DB_NAME')}.u8xfw.mongodb.net/?retryWrites=true&w=majority`),
  },
];