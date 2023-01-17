import {
    Column,
    Entity,
    BaseEntity,
  } from 'typeorm';
  
  // hashTag에 대한 사용 데이터를 수집하는 DB로 수집하는 조건은
  // 1. 목표 생성시 작성하는 hashTag
  // 2. 목표 검색시 작성하는 hashTag
  @Entity()
  export class HashTagData extends BaseEntity {
    @Column({ 
      nullable: false,
      unique: true
    })
    hashTag: string;
  
    @Column({ nullable: false })
    count: number;
  }