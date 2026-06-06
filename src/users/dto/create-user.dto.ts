import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {

    @ApiProperty({ example: 'Ana María Gómez', description: 'Nombre completo del usuario' })
    @IsNotEmpty()
    nombre!: string;

    @ApiProperty({ example: 'ana@ejemplo.com', description: 'Correo electrónico' })
    @IsEmail()
    email!: string;

    @ApiProperty({ example: '1020304050', description: 'Número de documento (opcional)', required: false })
    @IsOptional()
    documento!: string;

    @ApiProperty({ example: 'Test1234', description: 'Contraseña (mínimo 4 caracteres)' })
    @MinLength(4)
    password!: string;

    @ApiProperty({ enum: UserRole, example: UserRole.PACIENTE, description: 'Rol del usuario' })
    @IsEnum(UserRole)
    rol!: UserRole;
}
