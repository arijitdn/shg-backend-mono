import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { registerAs } from '@nestjs/config';
import { UserEntity } from '../../../db/entities/user.entity';
import { SHGEntity } from '../../../db/entities/shg.entity';
import { VOEntity } from '../../../db/entities/vo.entity';
import { CLFEntity } from '../../../db/entities/clf.entity';
import { TRLMAdminEntity } from '../../../db/entities/trlm-admin.entity';
import { ProductEntity } from '../../../db/entities';

export const databaseConfig = registerAs(
  'database',
  () =>
    ({
      type: 'postgres',
      url:
        process.env.DATABASE_URL ||
        'postgres://postgres:postgres@localhost:5432/shg-db',
      entities: [
        UserEntity,
        SHGEntity,
        VOEntity,
        CLFEntity,
        TRLMAdminEntity,
        ProductEntity,
      ],
      synchronize: true,
      autoLoadEntities: true,
    }) as TypeOrmModuleOptions,
);
