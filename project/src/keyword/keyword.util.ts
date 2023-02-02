export const randomNumber = (testNumber, selectNumber) => {
    //총 문제수, 뽑을 숫자
    let randomArray = [];
    for (let i = 0; i < selectNumber; i++) {
        let randomNum = Math.floor(Math.random() * testNumber);
        if (randomArray.indexOf(randomNum) === -1) {
            randomArray.push(randomNum);
        } else {
            i--;
        }
    }
    return randomArray;
};
