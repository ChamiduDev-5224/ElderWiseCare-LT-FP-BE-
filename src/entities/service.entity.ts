import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name:'service'})

export class Service {
    @PrimaryGeneratedColumn({type:'int',comment:'service ID'})
    sid:number;

    @Column({type:'text',comment:'Title'})
    tit:string;

    @Column({type:'text',comment:'Description'})
    des:string;
    
    @Column({ default: 1, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
    sts: number;
}