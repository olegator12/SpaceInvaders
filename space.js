//board
let titleSize = 32;
let rows = 16;
let columns = 16;

let board;
let boardWidth = titleSize * columns;
let boardHeight = titleSize * rows;
let context;


//ship
let shipImg;
let shipSpeedX = titleSize;

let shipWidht = titleSize*2;
let shipHeight = titleSize;
let shipX = titleSize * columns / 2 - titleSize;
let shipY = titleSize * rows - titleSize * 2;

let ship = {
    x : shipX,
    y : shipY,
    width : shipWidht,
    height : shipHeight
}


//aliens
let alienImg;
let alienArray = [];
let alienWidth = titleSize*2;
let alienHeight = titleSize;
let alienX = titleSize;
let alienY = titleSize;

let alienRows = 2;
let alienColumns = 3;
let alienCount = 0;
let alienSpeedX = 1;

let colorsArray = ["./alien.png", "./alien-cyan.png", "./alien-magenta.png", "./alien-yellow.png"];
let randomColor = colorsArray[0];


//bullets
let bulletArray = [];
let bulletSpeedY = -10;


//score
let score = 0;
let gameOver = false;
let gameOverImg;


window.onload = function() {
    board = document.getElementById("board");
    board.width = boardWidth;
    board.height = boardHeight;
    context = board.getContext("2d");

    shipImg = new Image();
    shipImg.src = "./ship.png";

    shipImg.onload = function(){
        context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);
    }

    alienImg = new Image();
    alienImg.src = randomColor;
    createAliens();

    requestAnimationFrame(update);
    document.addEventListener("keydown", moveShip);
    document.addEventListener("keyup", shoot);
}


function update() {
    requestAnimationFrame(update);

    alienImg.src = randomColor;

    if(gameOver){
        context.clearRect(0, titleSize, board.width, board.height);
        gameOverImg = new Image();
        gameOverImg.src = "./gameover.png";
        context.drawImage(gameOverImg, 8, 172, 500, 167);
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

    context.drawImage(shipImg, ship.x, ship.y, ship.width, ship.height);

    for(let i = 0; i < alienArray.length; i++){
        let alien = alienArray[i];

        if (alien.alive) {
            context.drawImage(alienImg, alien.x, alien.y, alien.width, alien.height);
            alien.x += alienSpeedX;

            if(alien.x + alien.width >= board.width || alien.x <= 0){
                alienSpeedX *= -1;
                alien.x += alienSpeedX*2;

                for(let j = 0; j < alienArray.length; j++){
                    alienArray[j].y += alien.height;
                }
            }
            if(alien.y >= ship.y){
                gameOver = true;
            }
        }
    }


    for(let i = 0; i < bulletArray.length; i++){
        let bullet = bulletArray[i];
        bullet.y += bulletSpeedY;
        context.fillStyle = "white";
        context.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        //Коллизия пуль
        for(let j = 0; j < alienArray.length; j++){
            let alien = alienArray[j];
            if(!bullet.used && alien.alive && detectCollision(bullet, alien)){
                bullet.used = true;
                alien.alive = false;
                alienCount--;
                score += 100;
            }
        }
    }

    //Следующий уровень
    if(alienCount == 0){
        alienColumns = Math.min(alienColumns + 1, columns / 2 - 2);
        alienRows = Math.min(alienRows + 1, rows - 4);
        alienSpeedX = Math.abs(alienSpeedX) + 0.2;
        alienArray = [];
        bulletArray = [];
        let randomIndex = Math.floor(Math.random() * colorsArray.length);
        randomColor = colorsArray[randomIndex];
        createAliens();
    }
    
    //Удаление пуль
    while(bulletArray.length > 0 && (bulletArray[0].used || bulletArray[0].y < 0)){
        bulletArray.shift();
    }

    
    //Счет
    context.fillStyle = "white";
    context.font = "16px courier";
    context.fillText(score, 5, 20);
}


function moveShip(e) {
    if(gameOver){
        return;
    }
    if (e.code == "ArrowLeft" && ship.x - shipSpeedX >= 0){
        ship.x -= shipSpeedX;
    }
    else if (e.code == "ArrowRight" && ship.x + shipSpeedX + ship.width <= board.width){
        ship.x += shipSpeedX;
    }
}


function createAliens() {
   
    for(let c = 0; c < alienColumns; c++){
        for(let r = 0; r < alienRows; r++){
            let alien = {
                img : alienImg,
                x : alienX + c*alienWidth,
                y : alienY + r*alienHeight,
                width : alienWidth,
                height : alienHeight,
                alive : true
            }
            alienArray.push(alien);
        }
    }
    alienCount = alienArray.length;
    
}


function shoot(e) {
    if(gameOver){
        return;
    }
    if(e.code == "Space"){
        let bullet = {
            x : ship.x + ship.width * 15 / 32,
            y : ship.y,
            width : titleSize / 8,
            height : titleSize / 2,
            used : false
        }
        bulletArray.push(bullet);
    }
}


function detectCollision(a, b){
    return b.x + b.width > a.x &&
           a.x + a.width > b.x &&
           b.y + b.height > a.y &&
           a.y + a.height > b.y;
}
