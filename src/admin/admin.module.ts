import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';
import { DbModule } from '@app/common/db';

@Module({
  imports: [DbModule],
  controllers: [PostsController, EmployeesController],
  providers: [PostsService, EmployeesService],
})
export class AdminModule {}
