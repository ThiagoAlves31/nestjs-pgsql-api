import { 
    Controller,
    Post,
    Body,
    ValidationPipe,
    UseGuards,
    Get,
    Param,
    Patch,
    ForbiddenException,
    Delete,
    Query
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { ReturnUserDto } from './dtos/return-user.dto';
import { UsersService } from './users.service';
import { AuthGuard } from '@nestjs/passport'
import { Role } from '../auth/role.decorator';
import { UserRole } from './user-roles.enum';
import { RolesGuard } from 'src/auth/roles.guard';
import { UpdateUserDto } from './dtos/update-users.dto'
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from './user.entity';
import { FindUsersQueryDto } from './dtos/find-users-query.dto';

@Controller('users')
@UseGuards(AuthGuard(), RolesGuard)

export class UsersController {

    constructor(private usersService: UsersService) {}

    //Cria usuario ADMIN - somente pode ser criado por outro usuário admin
    @Post()
    @Role(UserRole.ADMIN)
    async createAdminUser(
        @Body(ValidationPipe) createUserDto: CreateUserDto,
    ): Promise<ReturnUserDto> {
        const user = await this.usersService.createAdminUser(createUserDto);
        return {
            user,
            message: 'Administrador cadastrado com sucesso',
        }
    }

    @Get(':id')
    @Role(UserRole.ADMIN)
    async findUserById(@Param('id') id): Promise<ReturnUserDto> {
        const user = await this.usersService.findUserById(id)

        return {
            user,
            message: 'Usuario encontrado'
        }
    }
    
    @Patch(':id')
    async updateUser(
        @Body(ValidationPipe) updateUserDto: UpdateUserDto,
        @GetUser() user: User,
        @Param('id') id: string
    ) {
        if(user.role != UserRole.ADMIN && user.id.toString() != id) {
            throw new ForbiddenException(
                'Voce nao tem autorizacao para realizar essa atualizacao'
            )
        }else{
            return this.usersService.updateUser(updateUserDto, id)
        }
    }

    @Delete(':id')
    @Role(UserRole.ADMIN)
    async deleteUser(@Param('id') id: string) {
        await this.usersService.deleteUser(id)
        return {
            message: 'Usuario removido com sucesso.'
        }
    }
    
    @Get()
    @Role(UserRole.ADMIN)
    async findUsers(@Query() query: FindUsersQueryDto) {
        const found = await this.usersService.findUsers(query)
        console.log(found)
        return {
            found,
            message: 'Usuarios encontrados'
        }
    }
}
