import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appointment } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

/**
 * Servicio de gestión de citas médicas de SaludYa.
 *
 * Provee las operaciones CRUD sobre la tabla `appointments` en PostgreSQL
 * a través del repositorio TypeORM inyectado.
 */
@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private appointmentRepository: Repository<Appointment>,
  ) {}

  /**
   * Persiste una nueva cita médica en la base de datos.
   *
   * @param createAppointmentDto - Datos de la cita: especialidad, fecha, hora,
   *   médico, sede y observaciones opcionales.
   * @returns La cita recién creada con su `id` asignado por PostgreSQL.
   */
  async create(
    createAppointmentDto: CreateAppointmentDto,
  ): Promise<Appointment> {
    const newAppointment =
      this.appointmentRepository.create(createAppointmentDto);
    return await this.appointmentRepository.save(newAppointment);
  }

  /**
   * Retorna todas las citas almacenadas en la base de datos.
   *
   * @returns Arreglo con todos los registros de la tabla `appointments`.
   */
  async findAll(): Promise<Appointment[]> {
    return await this.appointmentRepository.find();
  }

  /**
   * Actualiza parcialmente una cita existente.
   *
   * Casos de uso principales:
   * - **Cancelar:** recibe `{ estado: 'Cancelada' }`
   * - **Reagendar:** recibe `{ fecha, hora, estado: 'Pendiente' }`
   *
   * Ignora el campo `fecha` si llega como string vacío para evitar
   * sobrescribir una fecha válida con un valor nulo.
   *
   * @param id - ID de la cita a actualizar.
   * @param updateAppointmentDto - Campos parciales a modificar.
   * @returns La cita actualizada.
   * @throws {NotFoundException} Si no existe una cita con el ID proporcionado.
   */
  async update(id: number, updateAppointmentDto: Partial<Appointment>) {
    if (updateAppointmentDto.fecha === '') {
      delete updateAppointmentDto.fecha;
    }

    const appointment = await this.appointmentRepository.preload({
      id: id,
      ...updateAppointmentDto,
    });

    if (!appointment) throw new NotFoundException(`Cita #${id} no encontrada`);

    return this.appointmentRepository.save(appointment);
  }

  /**
   * Elimina una cita de la base de datos de forma permanente.
   *
   * @param id - ID de la cita a eliminar.
   * @returns Objeto `{ deleted: true }` como confirmación.
   */
  async remove(id: number) {
    await this.appointmentRepository.delete(id);
    return { deleted: true };
  }
}
