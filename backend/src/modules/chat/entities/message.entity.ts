import { AbstractEntity } from 'src/entities/abastract-entity';
import { UserEntity } from 'src/modules/auth/entities/user.entity';
import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class MessageEntity extends AbstractEntity {
  @Column()
  text: string;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => UserEntity, (user) => user.messages)
  @JoinColumn()
  receiver: UserEntity;
}
