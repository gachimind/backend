import { Controller, Get } from '@nestjs/common';
import { QuizService } from 'src/quiz/quiz.service';

@Controller('quiz')
export class QuizController {
    constructor(private quizService: QuizService) {}

    @Get()
    quizController() {
        return this.quizService.getDataViaPuppeteer();
    }
}
