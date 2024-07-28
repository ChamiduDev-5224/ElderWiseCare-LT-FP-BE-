import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'invoice' })
export class Invoice {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'Invoice ID' })
  iid: number;

  @Column({ type: 'double', comment: 'Amount' })
  amt: number;

  @Column({ type: 'datetime', comment: 'Date Time' })
  dtm: string;

  @ManyToOne(() => User, (user) => user.invoiceUser, { nullable: false })
  @JoinColumn({ name: 'uid' })
  uid: User;
}
