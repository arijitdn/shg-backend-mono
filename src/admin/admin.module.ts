import { Module } from '@nestjs/common';
import { PostsController } from './posts/posts.controller';
import { PostsService } from './posts/posts.service';
import { DbModule } from '@app/common/db';

@Module({
  imports: [DbModule],
  controllers: [PostsController],
  providers: [PostsService],
})
export class AdminModule {}
