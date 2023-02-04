# 가치마인드

## DB 생성/삭제
- 프로젝트 db가 rds에 없다면, `npm run db:create`을 통해 생성해주세요.
- 테이블이 자동으로 함께 생성됩니다.
- 만약, DB가 있다면, app.module 파일에서 typeormModule 설정을 세팅하는 부분에서 synchronize option을 true로 하시고 앱을 실행하시면, 자동으로 table들이 동기화 됩니다. 다만, 이 방법은 기존에 있던 데이터를 모두 날리기때문에 원치 않으신다면, false로 바꾸고 앱을 켜세요.

## DB가 있는 상태에서 table만 생성/삭제
- DB가 존재하고, 기존의 데이터는 날리기 싫고, 신규 테이블만 생성하고 싶다면, `npm run db:table:sync` 명령어를 사용하시면 신규 테이블이 생성됩니다.
- 모든 테이블을 드롭하고 싶다면, `npm run db:table:drop`을 사용하시면 됩니다.


## package.json & package-lock.json
- 두 개 패키지 매니저 파일은 필요한 부분만 남겨 정리하였습니다.
- 현재 PR이 머지되고, dev에서 pull을 받으신 후 `npm ci` 명령을 해주시면, 기존에 깔려 있는 node_module을 싹 밀고, 현재 정의되어 있는 package-lock.json대로 새로 설치해줍니다.
- 새로 패키지를 설치하거나, 삭제를 한다면, PR 메세지에 꼭 남겨주세요.


## 항상 작업을 시작하기 전 지켜주셨으면 하는 루틴이 있습니다.
1. 작업할 내용을 github에서 issue로 생성
2. project board에 올려서 어떤 작업을 할지 공유
3. dev branch를 pull & **생성한 issue 번호로 feature 브랜치 생성**
4. feature 브랜치에서 작업, 자주 commit
5. push 하기 전, `npm run format`과 `npm run lint`를 꼭 실행하고, lint 에러가 있다면 해결 후 push 하기
6. 이슈 해결시 PR 생성
7. PR 리뷰 후 dev로 merge하고, feature 브랜치 삭제
