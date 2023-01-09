export declare class CreateRoomDto {
    roomId: number;
    readonly roomTitle: string;
    readonly maxCount: number;
    participants: any[];
    readonly round: number;
    readonly readyTime: number;
    readonly speechTime: number;
    readonly discussionTime: number;
    readonly isSecreteRoom: boolean;
    readonly roomPassword: number;
    isGameOn: boolean;
}
