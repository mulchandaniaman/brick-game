// SELECT CANVAS ELEMENT
const cvs = document.getElementById("breakout");
const ctx = cvs.getContext("2d");

// ADD BORDER TO CANVAS
cvs.style.border = "1px solid #000000";

// MAKE LINE THICK WHEN DRAWING TO CANVAS
ctx.lineWidth = 3;

// GAME VARIABLES AND CONSTANTS
const PADDLE_WIDTH = 250;
const PADDLE_HEIGHT = 52.74;
const PADDLE_MARGIN_BOTTOM = 50;
const BALL_RADIUS = 8;
let LIFE = 3; // PLAYER HAS 3 LIVES
let SCORE = 0;
const SCORE_UNIT = 10;
let LEVEL = 1;
const MAX_LEVEL = 5;
let GAME_OVER = false;
let leftArrow = false;
let rightArrow = false;

// CREATE THE PADDLE
const paddle = {
  x: cvs.width / 2 - PADDLE_WIDTH / 2,
  y: cvs.height - PADDLE_MARGIN_BOTTOM - PADDLE_HEIGHT,
  width: PADDLE_WIDTH,
  height: PADDLE_HEIGHT,
  dx: 5,
};

// DRAW PADDLE
function drawPaddle() {
  // ctx.fillStyle = "white";
  // ctx.fillRect(paddle.x, paddle.y, paddle.width, paddle.height);
  ctx.drawImage(PADDLE_IMG, paddle.x, paddle.y, paddle.width, paddle.height);
  // ctx.strokeStyle = "white";
  // ctx.strokeRect(paddle.x, paddle.y, paddle.width, paddle.height);
}

// CONTROL THE PADDLE
document.addEventListener("keydown", function (event) {
  if (event.keyCode == 37) {
    leftArrow = true;
  } else if (event.keyCode == 39) {
    rightArrow = true;
  }
});
document.addEventListener("keyup", function (event) {
  if (event.keyCode == 37) {
    leftArrow = false;
  } else if (event.keyCode == 39) {
    rightArrow = false;
  }
});

// MOVE PADDLE
function movePaddle() {
  if (rightArrow && paddle.x + paddle.width < cvs.width) {
    paddle.x += paddle.dx;
  } else if (leftArrow && paddle.x > 0) {
    paddle.x -= paddle.dx;
  }
}

// CREATE THE BALL
const ball = {
  x: cvs.width / 2,
  y: paddle.y - BALL_RADIUS,
  radius: BALL_RADIUS,
  speed: 4,
  dx: 3 * (Math.random() * 2 - 1),
  dy: -3,
};

// DRAW THE BALL
function drawBall() {
  ctx.beginPath();
  ctx.drawImage(LEVEL_FOUR, ball.x, ball.y, 35, 35);
  // ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  // ctx.fillStyle = "white";
  // ctx.fill();
  // ctx.strokeStyle = "white";
  // ctx.stroke();
  // ctx.closePath();
  // ctx.beginPath();
  // var backImg = new Image();
  // backImg.src = "/naruto_img/level_one.png";
  // context.drawImage(backImg, 0, 0);
  // context.fillRect(0, 0, canvas.width, canvas.height);
}

// MOVE THE BALL
function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
}

// BALL AND WALL COLLISION DETECTION
function ballWallCollision() {
  if (ball.x + ball.radius > cvs.width || ball.x - ball.radius < 0) {
    ball.dx = -ball.dx;
    WALL_HIT.play();
  }

  if (ball.y - ball.radius < 0) {
    ball.dy = -ball.dy;
    WALL_HIT.play();
  }

  if (ball.y + ball.radius > cvs.height) {
    LIFE--; // LOSE LIFE
    // LIFE_LOST.play();
    resetBall();
  }
}

// RESET THE BALL
function resetBall() {
  ball.x = cvs.width / 2;
  ball.y = paddle.y - BALL_RADIUS;
  ball.dx = 3 * (Math.random() * 2 - 1);
  ball.dy = -3;
}

// BALL AND PADDLE COLLISION
function ballPaddleCollision() {
  if (
    ball.x < paddle.x + paddle.width &&
    ball.x > paddle.x &&
    paddle.y < paddle.y + paddle.height &&
    ball.y > paddle.y
  ) {
    // PLAY SOUND
    PADDLE_HIT.play();

    // CHECK WHERE THE BALL HIT THE PADDLE
    let collidePoint = ball.x - (paddle.x + paddle.width / 2);

    // NORMALIZE THE VALUES
    collidePoint = collidePoint / (paddle.width / 2);

    // CALCULATE THE ANGLE OF THE BALL
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }
}

// CREATE THE BRICKS
const brick = {
  row: 1,
  column: 13,
  width: 73.33,
  height: 26.6,
  offSetLeft: 20,
  offSetTop: 20,
  marginTop: 40,
  fillColor: "#902020",
  strokeColor: "black",
};

let bricks = [];

function createBricks() {
  for (let r = 0; r < brick.row; r++) {
    bricks[r] = [];
    for (let c = 0; c < brick.column; c++) {
      bricks[r][c] = {
        x: c * (brick.offSetLeft + brick.width) + brick.offSetLeft,
        y:
          r * (brick.offSetTop + brick.height) +
          brick.offSetTop +
          brick.marginTop,
        status: true,
      };
    }
  }
}

createBricks();

// draw the bricks
function drawBricks() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        ctx.beginPath();
        ctx.drawImage(BRICK, b.x, b.y, brick.width, brick.height);
        ctx.closePath();

      }
    }
  }
}

// ball brick collision
function ballBrickCollision() {
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      let b = bricks[r][c];
      // if the brick isn't broken
      if (b.status) {
        if (
          ball.x + ball.radius > b.x &&
          ball.x - ball.radius < b.x + brick.width &&
          ball.y + ball.radius > b.y &&
          ball.y - ball.radius < b.y + brick.height
        ) {
          BRICK_HIT.play();
          ball.dy = -ball.dy;
          b.status = false; // the brick is broken
          SCORE += SCORE_UNIT;
        }
      }
    }
  }
}

// show game stats
function showGameStats(text, textX, textY, img, imgX, imgY) {
  // draw text
  ctx.fillStyle = "#FFF";
  ctx.font = "25px Press Start 2P One";
  ctx.fillText(text, textX, textY);

  // draw image
  ctx.drawImage(img, imgX, imgY, (width = 25), (height = 25));
}

// DRAW FUNCTION
function draw() {
  drawPaddle();

  drawBall();

  drawBricks();

  // SHOW SCORE
  showGameStats(SCORE, 35, 25, SCORE_IMG, 5, 5);
  // SHOW LIVES
  showGameStats(LIFE, cvs.width - 25, 25, LIFE_IMG, cvs.width - 55, 5);
  // SHOW LEVEL
  showGameStats(LEVEL, cvs.width / 2, 25, LEVEL_IMG, cvs.width / 2 - 30, 5);
}

// game over
function gameOver() {
  if (LIFE <= 0) {
    showYouLose();
    GAME_OVER = true;
  }
}

// level up
function levelUp() {
  let isLevelDone = true;

  // check if all the bricks are broken
  for (let r = 0; r < brick.row; r++) {
    for (let c = 0; c < brick.column; c++) {
      isLevelDone = isLevelDone && !bricks[r][c].status;
    }
  }

  if (isLevelDone) {
    WIN.play();

    if (LEVEL >= MAX_LEVEL) {
      showYouWin();
      GAME_OVER = true;
      return;
    }
    brick.row++;
    createBricks();
    ball.speed += 0.5;
    resetBall();
    LEVEL++;
  }
}

// UPDATE GAME FUNCTION
function update() {
  movePaddle();

  moveBall();

  ballWallCollision();

  ballPaddleCollision();

  ballBrickCollision();

  gameOver();

  levelUp();
}

// GAME LOOP
function loop() {
  // CLEAR THE CANVAS
  ctx.drawImage(BG_IMG, 0, 0);

  draw();

  update();

  if (!GAME_OVER) {
    requestAnimationFrame(loop);
  }
}
loop();

// !SELECT SOUND ELEMENT
// const soundElement = document.getElementById("sound");

// soundElement.addEventListener("click", audioManager);

// function audioManager() {
//   // CHANGE IMAGE SOUND_ON/OFF
//   let imgSrc = soundElement.getAttribute("src");
//   let SOUND_IMG =
//     imgSrc == "img/SOUND_ON.png" ? "img/SOUND_OFF.png" : "img/SOUND_ON.png";

//   soundElement.setAttribute("src", SOUND_IMG);

//   // MUTE AND UNMUTE SOUNDS
//   WALL_HIT.muted = WALL_HIT.muted ? false : true;
//   PADDLE_HIT.muted = PADDLE_HIT.muted ? false : true;
//   BRICK_HIT.muted = BRICK_HIT.muted ? false : true;
//   WIN.muted = WIN.muted ? false : true;
//   LIFE_LOST.muted = LIFE_LOST.muted ? false : true;
// }

// SHOW GAME OVER MESSAGE
/* SELECT ELEMENTS */
const gameover = document.getElementById("gameover");
const youwin = document.getElementById("youwin");
const youlose = document.getElementById("youlose");
const restart = document.getElementById("restart");

// CLICK ON PLAY AGAIN BUTTON
restart.addEventListener("click", function () {
  location.reload(); // reload the page
});

// SHOW YOU WIN
function showYouWin() {
  gameover.style.display = "block";
  youwon.style.display = "block";
}

// SHOW YOU LOSE
function showYouLose() {
  gameover.style.display = "block";
  youlose.style.display = "block";
}
