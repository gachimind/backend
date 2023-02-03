import { Room } from '../entities/room.entity';

export class UpdateRoomDto {
    public room: Room;
    public state = 'updated' || 'deleted';
}
