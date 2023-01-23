import { Controller, Get } from '@nestjs/common';
import { QuizService } from './quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get()
    QuizController() {
        const pageNum = 2500;
        for (let index = 1; index < pageNum; index++) {
            const pageNumber: number = pageNum[index];
            return this.quizService.getData(pageNumber);
        }
    }
}
