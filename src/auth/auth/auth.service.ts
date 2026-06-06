import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';

/**
 * Servicio de autenticación de SaludYa.
 *
 * Valida las credenciales del usuario contra la base de datos,
 * compara la contraseña con su hash bcrypt y emite un JWT firmado
 * con el ID, email y rol del usuario en el payload.
 */
@Injectable()
export class AuthService {

    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) { }

    /**
     * Autentica a un usuario verificando sus credenciales y retorna un JWT.
     *
     * @param email - Correo electrónico del usuario.
     * @param password - Contraseña en texto plano enviada por el cliente.
     * @returns Objeto `{ access_token: string }` con el JWT firmado.
     * @throws {UnauthorizedException} Si el correo no existe o la contraseña no coincide.
     *
     * @example
     * // Payload del JWT generado:
     * // { sub: 5, email: "ana@ejemplo.com", rol: "paciente" }
     */
    async login(email: string, password: string) {

        const user = await this.usersService.findByEmail(email);

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            rol: user.rol
        };

        return {
            access_token: this.jwtService.sign(payload),
        };
    }

}
