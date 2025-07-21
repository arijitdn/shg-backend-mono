import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity } from '@app/db/entities/posts.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostsDto } from './dto/update-post.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostEntity)
    private readonly postRepository: Repository<PostEntity>,
  ) {}

  async create(createPostDto: CreatePostDto) {
    const post = this.postRepository.create(createPostDto);
    return this.postRepository.save(post);
  }

  async findAll() {
    return this.postRepository.find();
  }

  async findOne(id: string) {
    return this.postRepository.findOneBy({ id });
  }

  async update(id: string, updatePostDto: UpdatePostsDto) {
    await this.postRepository.update(id, updatePostDto);
    return this.postRepository.findOneBy({ id });
  }

  async remove(id: string) {
    return this.postRepository.delete(id);
  }
}
