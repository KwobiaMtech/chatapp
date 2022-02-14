import { AbstractEntity } from 'src/entities/abastract-entity';
import {
  Entity,
  Column,
  BeforeInsert,
  BeforeUpdate,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { AuthUserEntity } from './auth.entity';

import * as bcrypt from 'bcrypt';
import { MessageEntity } from 'src/modules/chat/entities/message.entity';
import { ConnectedUserEntity } from 'src/modules/chat/entities/connected-user.entity';

@Entity()
export class UserEntity extends AbstractEntity {
  @Column('text', { nullable: true })
  first_name?: string;

  @Column('text', { nullable: true })
  last_name?: string;

  @Column('text', { unique: true })
  username: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { unique: true, nullable: true, select: false })
  phone?: string;

  @Column('text', { nullable: true })
  picture?: string;

  @Column('text', { nullable: true, select: false })
  password?: string;

  @OneToOne(() => AuthUserEntity, (o) => o.user)
  authUser: AuthUserEntity;

  @OneToMany(() => ConnectedUserEntity, (connection) => connection.user)
  connections: ConnectedUserEntity[];

  @OneToMany(() => MessageEntity, (message) => message.user)
  messages: MessageEntity[];

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  async comparePassword(attempt: string) {
    return await bcrypt.compare(attempt, this.password);
  }

  @BeforeInsert()
  @BeforeUpdate()
  emailToLowerCase() {
    this.email = this.email.toLowerCase();
    this.username = this.username.toLowerCase();
  }
}
