import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { SHGEntity } from './entities/shg.entity';
import { VOEntity } from './entities/vo.entity';
import { CLFEntity } from './entities/clf.entity';
import { TRLMAdminEntity } from './entities/trlm-admin.entity';
import { ProductEntity } from './entities';
import { NotificationEntity } from './entities';
import { OrderEntity } from './entities/order.entity';
import { PostEntity } from './entities/posts.entity';

@Injectable()
export class DbService {
  constructor(
    @InjectRepository(UserEntity)
    public readonly userRepo: Repository<UserEntity>,

    @InjectRepository(SHGEntity)
    public readonly shgRepo: Repository<SHGEntity>,

    @InjectRepository(VOEntity)
    public readonly voRepo: Repository<VOEntity>,

    @InjectRepository(CLFEntity)
    public readonly clfRepo: Repository<CLFEntity>,

    @InjectRepository(TRLMAdminEntity)
    public readonly trlmRepo: Repository<TRLMAdminEntity>,

    @InjectRepository(ProductEntity)
    public readonly productRepo: Repository<ProductEntity>,

    @InjectRepository(NotificationEntity)
    public readonly notificationRepo: Repository<NotificationEntity>,
    
    @InjectRepository(OrderEntity)
    public readonly orderRepo: Repository<OrderEntity>,

    @InjectRepository(PostEntity)
    public readonly postRepo: Repository<PostEntity>,
  ) {}

  
}
