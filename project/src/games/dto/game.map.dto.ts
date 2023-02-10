import { Keyword } from 'src/keyword/entities/keyword.entities';

export class GameMap {
    public currentTurn: { turnId: number | null; turn: number };
    public currentPlayers: number;
    public remainingTurns: number[];
    public gameResultIdMap: { [x: number]: number };
    public keywords: Keyword[];
}
