import { Body, Controller, Delete, Get, Headers, Param, Post, Req, UseGuards } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskDto } from './dto/create-task.dto';
import { JwtGuard } from 'src/config/jwt.guard';
import { CurrentUser } from 'src/config/@current-user.decorator';

@Controller('tasks')
@UseGuards(JwtGuard)
export class TaskController {
  constructor(private taskService: TaskService) { }


  @Post('create')
  create(@Body() dto: TaskDto, @Req() req: any) {
    const userId = req.userId
    return this.taskService.create(userId, dto);
  }

  // @Post('create')
  // create(@Body() dto: TaskDto, @CurrentUser('userId') userId: string) {
  //   return this.taskService.create(userId, dto);
  // }

  @Get()
  getAllTasks(@CurrentUser('userId') userId: string) {
    return this.taskService.findAll(userId);
  }

  @Get(':id')
  getTask(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.taskService.findOne(userId, id);
  }

  @Delete(':id')
  deleteTask(@Param('id') id: string, @CurrentUser('userId') userId: string) {
    return this.taskService.delete(userId, id);
  }
}
