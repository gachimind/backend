import { CanActivate, ExecutionContext } from '@nestjs/common';
import { PlayersService } from '../games/players.service';
export declare class AuthGuard implements CanActivate {
    private readonly playersService;
    constructor(playersService: PlayersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
