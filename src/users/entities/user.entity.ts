import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  PACIENTE = 'paciente',
  MEDICO   = 'medico',
}

@Entity('users')
export class User {

  @ApiProperty({ example: 1, description: 'ID único del usuario' })
  @PrimaryGeneratedColumn()
  id!: number;

  @ApiProperty({ example: 'Ana María Gómez', description: 'Nombre completo del usuario' })
  @Column({ length: 150 })
  nombre!: string;

  @ApiProperty({ example: 'ana@ejemplo.com', description: 'Correo electrónico (único)' })
  @Column({ unique: true })
  email!: string;

  @ApiProperty({ example: '3001234567', description: 'Teléfono de contacto', required: false })
  @Column({ length: 20, nullable: true })
  telefono!: string;

  @ApiProperty({ example: '1020304050', description: 'Número de documento de identidad', required: false })
  @Column({ length: 20, nullable: true })
  documento!: string;

  @Column()
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.PACIENTE, description: 'Rol del usuario en el sistema' })
  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.PACIENTE,
  })
  rol!: UserRole;

  @ApiProperty({ example: '2026-05-01T14:30:00.000Z', description: 'Fecha de registro' })
  @CreateDateColumn()
  createdAt!: Date;
}
