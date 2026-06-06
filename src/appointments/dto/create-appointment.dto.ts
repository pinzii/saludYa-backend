import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentDto {

  @ApiProperty({ example: 'Odontología', description: 'Especialidad médica seleccionada' })
  especialidad!: string;

  @ApiProperty({ example: '2026-07-15', description: 'Fecha de la cita (YYYY-MM-DD)' })
  fecha!: string;

  @ApiProperty({ example: '10:00 AM', description: 'Hora de la cita' })
  hora!: string;

  @ApiProperty({ example: 'Dr. Juan Pérez', description: 'Nombre del médico asignado' })
  medico!: string;

  @ApiProperty({ example: 'Sede Centro', description: 'Sede de atención' })
  sede!: string;

  @ApiProperty({ example: 'Primera consulta', description: 'Observaciones opcionales del paciente', required: false })
  observaciones?: string;

  @ApiProperty({ example: 1, description: 'ID del usuario (reservado para relación futura)', required: false })
  userId?: number;
}
