import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'gig' })
export class Gig {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'Gig ID' })
  gid: number;

  @Column({ comment: 'Title' })
  tit: string;
  @Column({ comment: 'Description' })
  des: string;

  @ManyToOne(() => User, (user) => user.gigUser, { nullable: false })
  @JoinColumn({ name: 'user_id' })
  uid: User;

  @Column({ default: 1, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
  sts: number;
}
