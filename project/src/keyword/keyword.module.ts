import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Keyword } from './entities/keyword.entities';
import { KeywordService } from './keyword.service';
import { KeywordController } from './keyword.controller';
@Module({
    imports: [TypeOrmModule.forFeature([Keyword])],
    controllers: [KeywordController],
    providers: [KeywordService],
    exports: [TypeOrmModule, KeywordService],
})
export class KeywordModule {}
