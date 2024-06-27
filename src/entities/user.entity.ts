import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Rate } from './rate.entity';

@Entity({ name: 'user' })
export class User {
  @PrimaryGeneratedColumn({ type: 'int', comment: 'UserId' })
  uid: number;
  @Column({
    nullable: true,
    comment: 'Prefix(1=Mr/2=Ms/3=Mrs/Dr=4/Prof=5)',
    type: 'int',
  })
  prf: number;
  @Column({ unique: true, comment: 'User Name' })
  unm: string;
  @Column({ nullable: true, comment: 'First Name' })
  fnm: string;
  @Column({ nullable: true, comment: 'Last Name' })
  lnm: string;

  @Column({ nullable: true, comment: 'Password' })
  pwd: string;

  @Column({ unique: true, comment: 'Email' })
  email: string;

  @Column({
    nullable: true,
    comment: 'User Type(1=customer/2=caregiver)',
    type: 'int',
  })
  utp: number;

  @Column({
    nullable: true,
    comment: 'Gender(1=Male/2=Female/3=Other)',
    type: 'int',
  })
  gen: number;

  @Column({ nullable: true, comment: 'Telephone No', type: 'int' })
  tep: number;

  @Column({ nullable: true, comment: 'ZIP Code' })
  zcd: number;
  @Column({ nullable: true, comment: 'City' })
  cty: string;
  @Column({ nullable: true, comment: 'Province' })
  prn: string;
  @Column({ nullable: true, comment: 'Street' })
  str: string;
  @Column({ nullable: true, comment: 'District' })
  dis: string;
  @Column({ type: 'decimal', nullable: true, comment: 'Latitude' })
  lat: number;
  @Column({ type: 'decimal', nullable: true, comment: 'longitude' })
  lgt: string;
  @Column({ nullable: true, comment: 'Image Url' })
  imu: string;
  @Column({ default: 0, comment: 'Is Google' })
  isg: boolean;
  @Column({ default: 3, comment: 'Status(1=Active/2=Deactive/3=Pending)' })
  sts: number;
  @Column({ nullable: true, comment: 'Update DateTime' })
  upd: string;
  @Column({ nullable: true, comment: 'Created Date Time' })
  crd: string;

  @OneToMany(() => Rate, (rate) => rate.rtg)
  rates: Rate[];
  @OneToMany(() => Rate, (rate) => rate.rti)
  ratestkr: Rate[];
}
