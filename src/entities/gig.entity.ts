import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';
import { Service } from './service.entity';

@Entity({ name: 'gig' })
export class Gig {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'Gig ID' })
  gid: number;

  @Column({ comment: 'Title' })
  tit: string;

  @Column({ comment: 'Description' })
  des: string;

  @ManyToOne(() => User, (user) => user.gigs, { nullable: false }) // Adjust relationship name
  @JoinColumn({ name: 'uid' })
  user: User;

  @Column({ type: 'text', comment: 'Image Url' })
  imu: string;

  @Column({ default: 1, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
  sts: number;

  @OneToMany(() => Service, (service) => service.gig)
  services: Service[];
}
