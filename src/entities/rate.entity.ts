import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "./user.entity";

@Entity({name:'rate'})
export class Rate {
@PrimaryGeneratedColumn({type:'int',comment:'Rate Id'})
rid:number;
@Column({comment:"Rate Value"})
rtv:number;
@Column({type:'text',comment:'Comment'})
cmt:string;
@Column({type:'datetime',comment:'Date Time'})
dtt:string;

@ManyToOne(() => User, user => user.rates, { nullable: false })
  @JoinColumn({ name: 'Rate Giver ID' }) 
  rtg: User;

  @ManyToOne(() => User, user => user.ratestkr, { nullable: false })
  @JoinColumn({ name: 'Rate Taker ID' }) 
  rti: User;
}
