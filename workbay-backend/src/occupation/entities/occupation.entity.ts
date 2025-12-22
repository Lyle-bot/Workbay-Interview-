import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('occupations')
export class Occupation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'onet_soc_code', type: 'varchar', length: 20 })
  onetSocCode: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;
}
