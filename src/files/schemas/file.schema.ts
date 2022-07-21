import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type FileDocument = File & Document;

@Schema()
export class File {
	@Prop({ required: true })
	name: string;

	@Prop({required: true})
	type: string;

	@Prop({default: ''})
	accsessLink: string

	@Prop({default: 0})
	size: Number

	@Prop({default: ''})
	path: string

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
	user: User

	@Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]})
	parent: File

	@Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]})
	childs: File[]
}

export const FileSchema = SchemaFactory.createForClass(File);