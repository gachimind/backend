import { Keyword } from 'src/keyword/entities/keyword.entities';

export class TurnMap {
    public turnId: number;
    public speechScore: number[];
    public turnQuizRank: number;
    public numberOfEvaluators: number;
    public keyword: Keyword;
    // turnAnswerPlayers: {}
}
