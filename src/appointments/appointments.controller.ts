import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { Appointment } from './entities/appointment.entity';

@ApiTags('appointments')
@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @ApiOperation({
    summary: 'Crear nueva cita',
    description: 'Persiste una nueva cita médica en la base de datos PostgreSQL.',
  })
  @ApiResponse({ status: 201, description: 'Cita creada exitosamente.', type: Appointment })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  async create(@Body() createAppointmentDto: CreateAppointmentDto) {
    return await this.appointmentsService.create(createAppointmentDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Obtener todas las citas',
    description: 'Retorna todas las citas almacenadas en la base de datos.',
  })
  @ApiResponse({ status: 200, description: 'Lista de citas.', type: [Appointment] })
  async findAll() {
    return await this.appointmentsService.findAll();
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar cita (reagendar o cancelar)',
    description:
      'Actualiza parcialmente una cita existente. ' +
      'Para cancelar: envía { "estado": "Cancelada" }. ' +
      'Para reagendar: envía { "fecha": "YYYY-MM-DD", "hora": "HH:MM", "estado": "Pendiente" }.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID de la cita a actualizar' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        fecha:  { type: 'string', example: '2026-07-22' },
        hora:   { type: 'string', example: '14:00' },
        estado: { type: 'string', example: 'Cancelada', enum: ['Pendiente', 'Cancelada', 'Confirmada'] },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Cita actualizada.', type: Appointment })
  @ApiResponse({ status: 404, description: 'Cita no encontrada.' })
  async update(
    @Param('id') id: string,
    @Body() updateAppointmentDto: Partial<Appointment>,
  ) {
    return await this.appointmentsService.update(+id, updateAppointmentDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar cita',
    description: 'Elimina una cita de la base de datos de forma permanente.',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID de la cita a eliminar' })
  @ApiResponse({ status: 200, description: 'Cita eliminada.', schema: { example: { deleted: true } } })
  remove(@Param('id') id: string) {
    return this.appointmentsService.remove(+id);
  }
}
