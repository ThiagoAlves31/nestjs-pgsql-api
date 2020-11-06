import { 
    Injectable,
    UnprocessableEntityException,
    NotFoundException,
    InternalServerErrorException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';
import { UserRepository } from './users.repository';
import { UserRole } from './user-roles.enum'
import { UpdateUserDto } from './dtos/update-users.dto'
import { FindUsersQueryDto } from './dtos/find-users-query.dto';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserRepository)
        private userRepository: UserRepository
    ){}
    
    async createAdminUser(createUserDto: CreateUserDto): Promise<User> {
        if (createUserDto.password != createUserDto.passwordConfirmation) {
            throw new UnprocessableEntityException('As senhas não conferem');
        } else {
            return this.userRepository.createUser(createUserDto, UserRole.ADMIN);
        }
    }

    async findUserById(userId: string): Promise<User> {
        const user = this.userRepository.findOne(userId, {
            select: ['email', 'name', 'role', 'id']
        })
        
        if(!user) throw new NotFoundException('Usuario nao encontrado')
        return user
    }

    async updateUser(updateUserDto: UpdateUserDto, id: string) {
        const result = await this.userRepository.update({ id }, updateUserDto);
        if (result.affected > 0) {
          const user = await this.findUserById(id);
          return user;
        }
        throw new NotFoundException('Usuário não encontrado');
    }

    async deleteUser(userId: string) {
        const result = await this.userRepository.delete({ id: userId })
        if(result.affected === 0) {
            throw new NotFoundException(
                'Não foi encontrado nenhum usuario com esse id.'
            )
        }
    }

    async findUsers(
        queryDto: FindUsersQueryDto
    ): Promise<{users: User[]; total: number}> {
        const users = await this.userRepository.findUsers(queryDto)
        return users
    }
}
