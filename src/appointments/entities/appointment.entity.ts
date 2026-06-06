import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('appointments')
export class Appointment {

  @ApiProperty({ example: 1, description: 'ID único de la cita' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Odontología', description: 'Especialidad médica' })
  @Column()
  especialidad!: string;

  @ApiProperty({ example: '2026-07-15', description: 'Fecha de la cita (YYYY-MM-DD)' })
  @Column()
  fecha!: string;

  @ApiProperty({ example: '10:00 AM', description: 'Hora de la cita' })
  @Column()
  hora!: string;

  @ApiProperty({ example: 'Dr. Juan Pérez', description: 'Nombre del médico asignado' })
  @Column()
  medico!: string;

  @ApiProperty({ example: 'Sede Centro', description: 'Sede de atención' })
  @Column()
  sede!: string;

  @ApiProperty({ example: 'Primera consulta de rutina', description: 'Observaciones adicionales', required: false })
  @Column({ nullable: true })
  observaciones!: string;

  @ApiProperty({
    example: 'Pendiente',
    description: 'Estado de la cita',
    enum: ['Pendiente', 'Completada', 'Cancelada', 'Confirmada'],
    default: 'Pendiente',
  })
  @Column({ default: 'Pendiente' })
  estado!: string;
}
