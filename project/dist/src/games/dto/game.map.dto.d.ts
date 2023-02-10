import { Keyword } from 'src/keyword/entities/keyword.entities';
export declare class GameMap {
    currentTurn: {
        turnId: number | null;
        turn: number;
    };
    currentPlayers: number;
    remainingTurns: number[];
    gameResultIdMap: {
        [x: number]: number;
    };
    keywords: Keyword[];
}
