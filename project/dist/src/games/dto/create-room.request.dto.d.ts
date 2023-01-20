export declare class CreateRoomRequestDto {
    roomTitle: string;
    readonly maxCount: number;
    readonly round: number;
    readonly readyTime: number;
    readonly speechTime: number;
    readonly discussionTime: number;
    readonly isSecreteRoom: boolean;
    readonly roomPassword: number;
}
