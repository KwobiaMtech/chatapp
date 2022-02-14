import { AbstractEntity } from 'src/entities/abastract-entity';
import {
  Entity,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';
import { UserEntity } from './user.entity';

@Entity()
export class AuthUserEntity extends AbstractEntity {
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Profiles
  @OneToOne(() => UserEntity, (user) => user.authUser, {
    cascade: true,
    nullable: true,
  })
  @JoinColumn({ name: 'userId' })
  user?: UserEntity;

  @Column('string', { nullable: true })
  userId?: string;

  @Column('bool', { nullable: true, default: false })
  email_verified?: boolean;

  @Column('text')
  token?: string;
}
