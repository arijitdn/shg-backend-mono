import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';

import { UserRole } from '@app/db/enums/user-role.enum';
import { UpdatePostsDto } from './dto/update-post.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles(UserRole.NIC_ADMIN)
@Controller('admin/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post('create')
  create(@Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id);
  }

  @Patch('update/:id')
  update(@Param('id') id: string, @Body() updatePostsDto: UpdatePostsDto) {
    return this.postsService.update(id, updatePostsDto);
  }

  @Delete('delete/:id')
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
