import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from '../../files/schemas/file.schema'

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email: String;

  @Prop({required: true})
  password: String;

  @Prop({default: 1024**3*10})
  diskSpace: Number;

  @Prop({default: 0})
  usedSpace: Number;

  @Prop()
  avatar: String

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }] })
  files: File[]
}

export const UserSchema = SchemaFactory.createForClass(User);