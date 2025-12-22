import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('jobzones')
export class JobZone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'onet_soc_code', type: 'varchar', length: 20, unique: true })
  onetSocCode: string;

  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ name: 'job_zone', type: 'int' })
  jobZone: number;

  @Column({ name: 'date', type: 'varchar', length: 20 })
  date: string;

  @Column({ name: 'domain_source', type: 'varchar', length: 100 })
  domainSource: string;
}
