import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from '../../files/schemas/file.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({required: true})
  password: string;

  @Prop({default: 1024**3*10})
  diskSpace: Number;

  @Prop({default: 0})
  usedSpace: Number;

  @Prop()
  avatar: string

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }] })
  files: File[]
}

export const UserSchema = SchemaFactory.createForClass(User);