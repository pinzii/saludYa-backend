import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; //
import { Repository } from 'typeorm'; //
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>, // Inyectamos el repositorio de Postgres
  ) {}

  // 1. Crear cita en la base de datos
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const newAppointment =
      this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(newAppointment); // Guarda permanentemente
  }

  // 2. Obtener todas las citas desde Postgres
  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find(); // Retorna los registros de la DB
  }

  // 3. Actualizar una cita existente
  async update(
    id: number,
    updateData: Partial<CreateAppointmentDto>,
  ): Promise<Appointment | null> {
    await this.appointmentRepository.update(id, updateData);
    return await this.appointmentRepository.findOneBy({ id });
  }

  // 4. Eliminar una cita
  async remove(id: number) {
    await this.appointmentRepository.delete(id);
    return { deleted: true };
  }
}
