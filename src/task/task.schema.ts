import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/auth/user.schema';

@Schema()
export class Task extends Document {
  @Prop()
  title: string;

  @Prop()
  description: string;

    @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'User' })
    user: User;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
