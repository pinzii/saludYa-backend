import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@ApiTags('users')
@Controller('users')
export class UsersController {

  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registrar nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema. La contraseña se almacena con hash bcrypt.',
  })
  @ApiResponse({ status: 201, description: 'Usuario creado exitosamente.', type: User })
  @ApiResponse({ status: 400, description: 'El correo ya está registrado.' })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar todos los usuarios', description: 'Retorna todos los usuarios registrados (sin campo password).' })
  @ApiResponse({ status: 200, description: 'Lista de usuarios.', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener usuario por ID', description: 'Retorna los datos del perfil de un usuario específico.' })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del usuario' })
  @ApiResponse({ status: 200, description: 'Datos del usuario.', type: User })
  @ApiResponse({ status: 404, description: 'Usuario no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Actualizar datos del usuario',
    description: 'Actualiza parcialmente el perfil de un usuario (nombre, email, documento, teléfono).',
  })
  @ApiParam({ name: 'id', type: Number, example: 1, description: 'ID del usuario' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        nombre:    { type: 'string', example: 'Ana María Gómez López' },
        email:     { type: 'string', example: 'nueva@ejemplo.com' },
        documento: { type: 'string', example: '0987654321' },
        telefono:  { type: 'string', example: '3109876543' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Usuario actualizado.', type: User })
  update(
    @Param('id') id: string,
    @Body() data: Partial<User>,
  ) {
    return this.usersService.update(+id, data);
  }

}
