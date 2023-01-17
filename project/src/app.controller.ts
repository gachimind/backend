import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
    @Get()
    greetings() {
        return `welcome to gachimind project nest server!`;
    }
}
