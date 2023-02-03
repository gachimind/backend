import { IsString, IsNumber, IsOptional, IsDate } from 'class-validator';

export class BugDto {
    @IsString()
    readonly title: string;

    @IsString()
    readonly content: string;
}
