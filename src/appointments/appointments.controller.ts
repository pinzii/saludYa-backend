import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // 1. Persistir una nueva cita (POST)
  @Post()
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createAppointmentDto);
  }

  // 2. Obtener todas las citas (GET)

  @Get()
  async findAll() {
    return await this.appointmentsService.findAll();
  }

  // 3. Reagendar una cita (PUT)
  // Recibe el ID de la cita y los nuevos datos de fecha/hora
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: Partial<Appointment>,
  ) {
    return await this.appointmentsService.update(+id, updateAppointmentDto);
  }

  // 4. Cancelar una cita (DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
