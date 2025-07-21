import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { EmployeesController } from './employees/employees.controller';
import { EmployeesService } from './employees/employees.service';
import { PostEntity } from '@app/common/db/entities/posts.entity';
import { TRLMAdminEntity } from '@app/common/db/entities/trlm-admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, TRLMAdminEntity]),
  ],
  controllers: [PostsController, EmployeesController],
  providers: [PostsService, EmployeesService],
})
export class AdminModule {}