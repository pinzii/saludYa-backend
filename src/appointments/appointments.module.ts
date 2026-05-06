import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm'; //
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { Appointment } from './entities/appointment.entity'; //

@Module({
  imports: [
    // Esto conecta la entidad con el módulo para usar el repositorio
    TypeOrmModule.forFeature([Appointment]),
  ],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
})
export class AppointmentsModule {}
