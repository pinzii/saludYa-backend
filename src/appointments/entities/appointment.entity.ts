import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('appointments')
export class Appointment {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  especialidad!: string;

  @Column()
  fecha!: string;

  @Column()
  hora!: string;

  @Column()
  medico!: string;

  @Column()
  sede!: string;

  @Column({ nullable: true })
  observaciones!: string;

  @Column({ default: 'Pendiente' })
  estado!: string;
}
