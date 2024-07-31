import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity({ name: 'chatdetail' })
export class ChatDetails {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'Chat Detail ID' })
  cid: number;

  @Column({ type: 'text', comment: 'Description' })
  des: string;

  @Column({ type: 'datetime', comment: 'Date Time' })
  dtm: Date;

  @ManyToOne(() => User, user => user.userid, { nullable: false })
  @JoinColumn({ name: 'uid' }) 
  uid: User;

  @ManyToOne(() => User, user => user.chttkrid, { nullable: false })
  @JoinColumn({ name: 'uti' }) 
  uti: User;
}
