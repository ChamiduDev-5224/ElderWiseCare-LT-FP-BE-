import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'product',comment:'Product Table' })

export class Product{
    @PrimaryGeneratedColumn({ type: 'int', comment: 'Product ID' })
    pid: number;

    @Column({ type: 'text', comment: 'Product Name' })
    pdn: string;
    @Column({ type: 'text', comment: 'Product Description' })
    des: string;

    @Column({ type: 'text', comment: 'Product Company',nullable:true })
    cpn: string;

    @Column({ type: 'double', comment: 'Product Price' })
    prc: number;

    @Column({ comment: 'Product Qty' })
    qty: number;

    @Column({ type: 'text', comment: 'Image Url' })
    imu: string;

    @Column({ default: 1, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
    sts: number;
}