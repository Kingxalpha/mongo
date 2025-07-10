import { Injectable } from '@nestjs/common';
import { TaskDto } from './dto/create-task.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Task } from './task.schema';
import { Model } from 'mongoose';

@Injectable()
export class TaskService {
    constructor(@InjectModel(Task.name) private taskModel: Model<Task>) {}

    create(userId: string, dto: TaskDto) {
        console.log('🧾 Creating task for userId:', userId);
        console.log('✅ Task DTO:', dto);
        const task = new this.taskModel({ ...dto, user: userId });
        return task.save();
    }

    findAll(userId: string) {
        return this.taskModel.find({ userId });
    }

    findOne(userId: string, id: string) {
        return this.taskModel.findOne({ _id: id, userId });
    }

    delete(userId: string, id: string) {
        return this.taskModel.deleteOne({ _id: id, userId });
    }
}
