import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getAllUsers(): Promise<import("./user.entity").User[]>;
    getUserById({ id }: {
        id: any;
    }): Promise<import("./user.entity").User>;
    createUser(userData: CreateUserDto): Promise<import("./user.entity").User>;
}
