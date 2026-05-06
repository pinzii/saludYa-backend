import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
} from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  // 1. Persistir una nueva cita (POST)
  @Post()
  create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.create(createAppointmentDto);
  }

  // 2. Obtener todas las citas (GET)

  @Get()
  findAll() {
    return this.appointmentsService.findAll();
  }

  // 3. Reagendar una cita (PUT)
  // Recibe el ID de la cita y los nuevos datos de fecha/hora
  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateAppointmentDto>,
  ) {
    return this.appointmentsService.update(+id, updateData);
  }

  // 4. Cancelar una cita (DELETE)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
