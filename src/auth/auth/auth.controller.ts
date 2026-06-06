import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService) { }

    @Post('login')
    @ApiOperation({
        summary: 'Iniciar sesión',
        description: 'Autentica al usuario con email y contraseña. Retorna un JWT que debe enviarse como Bearer token en las siguientes peticiones.',
    })
    @ApiBody({
        schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
                email:    { type: 'string', example: 'paciente@saludya.com' },
                password: { type: 'string', example: 'Test1234' },
            },
        },
    })
    @ApiResponse({
        status: 200,
        description: 'Login exitoso. Retorna el JWT de acceso.',
        schema: {
            example: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
        },
    })
    @ApiResponse({ status: 401, description: 'Credenciales inválidas.' })
    login(@Body() body: { email: string; password: string }) {
        return this.authService.login(body.email, body.password);
    }

}
