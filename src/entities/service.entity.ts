import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gig } from './gig.entity';

@Entity({ name: 'service' })
export class Service {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'Service ID' })
  sid: number;

  @Column({ type: 'text', comment: 'Description' })
  des: string;

  @ManyToOne(() => Gig, (gig) => gig.services, { nullable: false }) // Adjusted property name
  @JoinColumn({ name: 'gid' })
  gig: Gig; // Changed to Gig object for relationship

  @Column({ default: 1, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
  sts: number;
}
