import * as mongoose from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User } from 'src/users/schemas/user.schema';

export type FileDocument = File & Document;

@Schema()
export class File {
	@Prop({ required: true })
	name: String;

	@Prop({required: true})
	type: String;

	@Prop({required: true})
	accsessLink: String

	@Prop({default: 0})
	size: Number

	@Prop({default: ''})
	path: String

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
	user: User

	@Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]})
	parent: File

	@Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'File' }]})
	childs: File
}

export const FileSchema = SchemaFactory.createForClass(File);