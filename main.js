const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

let score = 0; // 현재 점수
let scoreInterval; // 점수 업데이트에 사용되는 인터벌
let time = 60; // 남은 시간
let timeInterval; // 시간 업데이트에 사용되는 인터벌
let timer = 0; // 시간 측정을 위한 타이머
let animation; // 게임 애니메이션 프레임

let left = false; // 왼쪽 화살표 키 상태 (눌림/안눌림)
let right = false; // 오른쪽 화살표 키 상태 (눌림/안눌림)

// 키 다운 이벤트 처리 함수
function handleKeyDown(e) {
  if (e.code === "ArrowLeft") {
    left = true; // 왼쪽 화살표 키가 눌렸을 때 상태를 true로 설정
  } else if (e.code === "ArrowRight") {
    right = true; // 오른쪽 화살표 키가 눌렸을 때 상태를 true로 설정
  }
}

// 키 업 이벤트 처리 함수
function handleKeyUp(e) {
  if (e.code === "ArrowLeft") {
    left = false; // 왼쪽 화살표 키가 떼졌을 때 상태를 false로 설정
  } else if (e.code === "ArrowRight") {
    right = false; // 오른쪽 화살표 키가 떼졌을 때 상태를 false로 설정
  }
}

document.addEventListener("keydown", handleKeyDown); // 키 다운 이벤트 리스너 등록
document.addEventListener("keyup", handleKeyUp); // 키 업 이벤트 리스너 등록

let imgBasic = new Image(); // 기본 캐릭터 이미지 객체 생성
imgBasic.src = "./img/basic.png"; // 이미지 파일 경로 설정

imgBasic.onload = () => {
  character.draw(); // 이미지가 로드되면 캐릭터를 그림
};

// 캐릭터 객체
let character = {
  x: canvas.width / 2 - 60, // 캐릭터의 초기 x 좌표
  y: canvas.height - 155, // 캐릭터의 초기 y 좌표
  width: 60, // 캐릭터의 너비
  height: 99, // 캐릭터의 높이
  img: imgBasic, // 캐릭터 이미지

  draw() {
    ctx.drawImage(this.img, this.x, this.y, this.width, this.height); // 캐릭터를 캔버스에 그림
  },
};

// 장애물 이미지 객체 배열
const obstacleImages = [];

const imgObstacle1 = new Image();
imgObstacle1.src = "./img/1.png";
obstacleImages.push(imgObstacle1);

const imgObstacle2 = new Image();
imgObstacle2.src = "./img/1.png";
obstacleImages.push(imgObstacle2);

const imgObstacle3 = new Image();
imgObstacle3.src = "./img/1.png";
obstacleImages.push(imgObstacle3);

const imgObstacle4 = new Image();
imgObstacle4.src = "./img/gift.png";
obstacleImages.push(imgObstacle4);

// 장애물 클래스
class Obstacle {
  constructor(x, y, width, height, speed, image, special) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.speed = speed;
    this.special = special;
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height); // 장애물 이미지를 캔버스에 그림
  }

  move() {
    this.y += this.speed; // 장애물을 아래로 이동
  }
}

// 장애물 객체 배열
const obstacles = [];

// 장애물 종류 및 초기화 함수
const obstacleTypes = [
  { width: 100, height: 98, speed: 1, image: obstacleImages[0], special: false },
  { width: 50, height: 49, speed: 4, image: obstacleImages[1], special: false },
  { width: 35, height: 34, speed: 5, image: obstacleImages[2], special: false },
  { width: 30, height: 30, speed: 7, image: obstacleImages[3], special: true },
];

// 초기 장애물 생성
function initObstacles() {
  for (let i = 0; i < obstacleTypes.length; i++) {
    obstacles.push(getRandomObstacle());
  }
}

// 임의의 장애물 생성
function getRandomObstacle() {
  const randomIndex = Math.floor(Math.random() * obstacleTypes.length); // 임의의 장애물 종류 선택
  const type = obstacleTypes[randomIndex];
  const x = Math.random() * (canvas.width - type.width); // 장애물의 x 좌표 설정
  let y = canvas.height - 600; // 장애물의 초기 y 좌표 설정
  return new Obstacle(x, y, type.width, type.height, type.speed, type.image, type.special); // 새로운 장애물 객체 반환
}

// 장애물 이동
function moveObstacles() {
  for (const obstacle of obstacles) {
    obstacle.move();
  }
}

let invincible = false; // 무적 상태 변수

let noScore = false; // 점수가 계속 오르는 변수 방지

let life = 3; // 생명력
// 충돌 확인
function checkCollisions() {
  for (const obstacle of obstacles) {
    if (!invincible && character.x < obstacle.x + obstacle.width && character.x + character.width > obstacle.x && character.y < obstacle.y + obstacle.height && character.y + character.height > obstacle.y) {
      console.log(obstacle);
      if (obstacle.special) {
        if (!noScore) {
          noScore = true;
          score += 500;
          setTimeout(() => {
            noScore = false;
          }, 1000);
        }
      } else {
        makeCharacterInvincible();
        life--;
        score -= 100;
      }
    }
  }
}

// 무적 상태 설정
function makeCharacterInvincible() {
  if (!invincible) {
    invincible = true;
    setTimeout(() => {
      invincible = false; // 일정 시간 후 무적 상태 해제
    }, 2000); // 2초 동안 무적 상태 유지
  }
}

// 게임 종료 확인
function checkEndGame() {
  if (life === 0 || time === 0) {
    endGame(); // 생명력이 0이거나 시간이 0일 때 게임 종료 처리
  }
}

// 게임 종료
function endGame() {
  cancelAnimationFrame(animation); // 현재 게임 애니메이션 프레임 초기화
  obstacles.length = 0; // 장애물 배열을 초기화
  ctx.fillStyle = "black";
  ctx.font = "48px Arial";
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 40);
  ctx.font = "24px Arial";
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 20);
  playBtn.style.display = "block"; // 게임 시작 버튼 화면에 표시
}

// 텍스트 그리기 함수
function drawText(text, x, y, size, color) {
  ctx.fillStyle = color;
  ctx.font = `${size}px Arial`;
  ctx.fillText(text, x, y);
}

// 스코어 그리기
function drawScore() {
  drawText(`Score: ${score}`, 20, 30, 24, "black");
}

// 시간 그리기
function drawTime() {
  drawText(`Time: ${time}`, 180, 30, 24, "black");
}

// 생명력 그리기
function drawLife() {
  drawText(`Life: ${life}`, 300, 30, 24, "black");
}

// 스코어 증가 함수
function increaseScore() {
  score++;
}

// 시간 감소 함수
function decreaseTime() {
  time -= 1;
}

// 애니메이션 함수
function animate() {
  animation = requestAnimationFrame(animate); // 애니메이션 프레임 요청
  timer++; // 타이머 증가로 시간 경과 추적
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
  moveObstacles(); // 장애물 이동 처리

  if (timer % 60 === 0) {
    obstacles.push(getRandomObstacle()); // 일정 간격마다 새로운 장애물 생성
  }

  obstacles.forEach((obstacle, i, array) => {
    if (obstacle.y + obstacle.height > 600) {
      array.splice(i, 1); // 장애물이 화면 아래로 벗어났을 때 배열에서 제거
      score += 20; // 스코어 20점 추가
    }
    obstacle.draw();
  });

  checkCollisions(); // 충돌 확인
  checkEndGame(); // 게임 종료 확인

  if (left && character.x - 5 > 0) {
    character.x -= 5; // 왼쪽 화살표 키가 눌렸고, 캐릭터가 화면 왼쪽 안쪽에 있을 때 왼쪽으로 이동
  }

  if (right && character.x + character.width + 5 < canvas.width) {
    character.x += 5; // 오른쪽 화살표 키가 눌렸고, 캐릭터가 화면 오른쪽 안쪽에 있을 때 오른쪽으로 이동
  }

  drawScore(); // 스코어 그리기
  drawTime(); // 시간 그리기
  drawLife(); // 생명력 그리기
  character.draw();
}

const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", startGame); // 게임 시작 버튼에 클릭 이벤트 리스너 등록

function startGame() {
  clearInterval(scoreInterval);
  clearInterval(timeInterval);

  cancelAnimationFrame(animation); // 현재 게임 애니메이션 프레임 초기화
  animation = requestAnimationFrame(animate); // 애니메이션 시작
  score = 0; // 스코어 초기화
  scoreInterval = setInterval(increaseScore, 1000); // 스코어 증가 인터벌 설정
  time = 60; // 시간 초기화
  timeInterval = setInterval(decreaseTime, 1000); // 시간 감소 인터벌 설정
  playBtn.style.display = "none"; // 게임 시작 버튼 숨김
  life = 3; // 생명력 초기화

  initObstacles(); // 장애물 초기화
}
