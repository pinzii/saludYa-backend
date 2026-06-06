import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './repositories/users.repository';
import * as bcrypt from 'bcrypt';

/**
 * Servicio de gestión de usuarios de SaludYa.
 *
 * Contiene la lógica de negocio para el registro, consulta y actualización
 * de usuarios. Delega la persistencia al `UsersRepository`.
 */
@Injectable()
export class UsersService {

    constructor(
        private readonly usersRepository: UsersRepository,
    ) { }

    /**
     * Registra un nuevo usuario en el sistema.
     *
     * Verifica que el correo no esté duplicado y aplica hash bcrypt
     * (salt factor 10) a la contraseña antes de persistir el usuario.
     *
     * @param dto - Datos del nuevo usuario: nombre, email, password y rol.
     * @returns El usuario creado (sin el campo password en la respuesta).
     * @throws {BadRequestException} Si el correo ya está registrado en la base de datos.
     */
    async create(dto: CreateUserDto) {
        const exists = await this.usersRepository.findByEmail(dto.email);

        if (exists) {
            throw new BadRequestException('El correo ya está registrado');
        }

        const hashedPassword = await bcrypt.hash(dto.password, 10);

        const userToSave = {
            ...dto,
            password: hashedPassword
        };

        return this.usersRepository.create(userToSave);
    }

    /**
     * Retorna la lista completa de usuarios registrados.
     *
     * @returns Arreglo con todos los usuarios de la base de datos.
     */
    findAll() {
        return this.usersRepository.findAll();
    }

    /**
     * Busca un usuario por su ID.
     *
     * @param id - ID numérico del usuario.
     * @returns El objeto del usuario si existe, o `undefined` si no se encuentra.
     */
    findOne(id: number) {
        return this.usersRepository.findOne(id);
    }

    /**
     * Busca un usuario por su correo electrónico.
     *
     * Usado internamente por `AuthService` para validar credenciales en el login.
     *
     * @param email - Correo electrónico a buscar.
     * @returns El usuario encontrado (incluyendo el hash de la contraseña), o `null`.
     */
    async findByEmail(email: string) {
        return this.usersRepository.findByEmail(email);
    }

    /**
     * Actualiza parcialmente los datos de un usuario.
     *
     * @param id - ID del usuario a actualizar.
     * @param data - Campos a modificar (nombre, email, documento, teléfono).
     * @returns El usuario con los datos actualizados.
     */
    async update(id: number, data: any) {
        return this.usersRepository.update(id, data);
    }

}
