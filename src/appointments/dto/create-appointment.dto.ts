// src/appointments/dto/create-appointment.dto.ts

export class CreateAppointmentDto {
  especialidad!: string;
  fecha!: string;
  hora!: string;
  medico!: string;
  sede!: string;
  observaciones?: string;
  userId?: number;
}
