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

function handleKeyDown(e) {
  if (e.code === "ArrowLeft") {
    left = true; // 왼쪽 화살표 키가 눌렸을 때 상태를 true로 설정
  } else if (e.code === "ArrowRight") {
    right = true; // 오른쪽 화살표 키가 눌렸을 때 상태를 true로 설정
  }
}

function handleKeyUp(e) {
  if (e.code === "ArrowLeft") {
    left = false; // 왼쪽 화살표 키가 떼졌을 때 상태를 false로 설정
  } else if (e.code === "ArrowRight") {
    right = false; // 오른쪽 화살표 키가 떼졌을 때 상태를 false로 설정
  }
}

document.addEventListener("keydown", handleKeyDown); // 키 다운 이벤트 리스너 등록
document.addEventListener("keyup", handleKeyUp); // 키 업 이벤트 리스너 등록

let character = {
  x: 90, // 캐릭터의 초기 x 좌표
  y: canvas.height - 120, // 캐릭터의 초기 y 좌표
  width: 70, // 캐릭터의 너비
  height: 120, // 캐릭터의 높이
  color: "red", // 캐릭터의 색상
};

class Obstacle {
  constructor(x, y, width, height, speed, color) {
    this.x = x; // 장애물의 초기 x 좌표
    this.y = y; // 장애물의 초기 y 좌표
    this.width = width; // 장애물의 너비
    this.height = height; // 장애물의 높이
    this.color = color; // 장애물의 색상
    this.speed = speed; // 장애물의 이동 속도
  }
  
  move() {
    this.y += this.speed; // 장애물을 아래로 이동
  }
}

const obstacles = []; // 장애물 객체들을 담을 배열
const obstacleTypes = [
  { width: 50, height: 46, speed: 2, color: "red" },
  { width: 51, height: 39, speed: 3, color: "blue" },
  { width: 50, height: 30, speed: 4, color: "green" },
];

function initObstacles() {
  for (let i = 0; i < 3; i++) {
    obstacles.push(getRandomObstacle()); // 임의의 장애물을 배열에 추가
  }
}

function getRandomObstacle() {
  const randomIndex = Math.floor(Math.random() * obstacleTypes.length); // 임의의 장애물 종류 선택
  const type = obstacleTypes[randomIndex];
  const x = Math.random() * (canvas.width - type.width); // 장애물의 x 좌표 설정
  let y = canvas.height - 600; // 장애물의 초기 y 좌표 설정
  return new Obstacle(x, y, type.width, type.height, type.speed, type.color); // 새로운 장애물 객체 반환
}

function moveObstacles() {
  for (const obstacle of obstacles) {
    obstacle.move(); // 모든 장애물을 이동
  }
}

let invincible = false; // 무적 상태 변수

function checkCollisions() {
  for (const obstacle of obstacles) {
    if (
      !invincible &&
      character.x < obstacle.x + obstacle.width &&
      character.x + character.width > obstacle.x &&
      character.y < obstacle.y + obstacle.height &&
      character.y + character.height > obstacle.y
    ) {
      life--; // 충돌 시 생명력 감소
      makeCharacterInvincible(); // 캐릭터를 일시적으로 무적 상태로 설정
    }
  }
}

function makeCharacterInvincible() {
  if (!invincible) {
    invincible = true; // 무적 상태 설정
    setTimeout(() => {
      invincible = false; // 일정 시간 후 무적 상태 해제
    }, 2000); // 2초 동안 무적 상태 유지
  }
}

function dd() {
  if (life === 0 || time === 0) {
    endGame(); // 생명력이 0이거나 시간이 0일 때 게임 종료 처리
  }
}

function endGame() {
  cancelAnimationFrame(animation); // 현재 게임 애니메이션 프레임 초기화
  obstacles.length = 0; // 장애물 배열을 초기화
  ctx.fillStyle = "black"; // 글자 색상 설정
  ctx.font = "48px Arial"; // 글자 크기 및 폰트 설정
  ctx.fillText("Game Over", canvas.width / 2 - 100, canvas.height / 2 - 40); // 게임 오버 메시지 출력
  ctx.font = "24px Arial"; // 글자 크기 및 폰트 설정
  ctx.fillText(`Score: ${score}`, canvas.width / 2 - 40, canvas.height / 2 + 20); // 스코어 출력
  playBtn.style.display = "block"; // 게임 시작 버튼 화면에 표시
}

function drawScore() {
  ctx.fillStyle = "black"; // 글자 색상 설정
  ctx.font = "24px Arial"; // 글자 크기 및 폰트 설정
  ctx.fillText(`Score: ${score}`, 20, 30); // 스코어 출력
}

function drawTime() {
  ctx.fillStyle = "black"; // 글자 색상 설정
  ctx.font = "24px Arial"; // 글자 크기 및 폰트 설정
  ctx.fillText(`Time: ${time}`, 180, 30); // 시간 출력
}

function drawLife() {
  ctx.fillStyle = "black"; // 글자 색상 설정
  ctx.font = "24px Arial"; // 글자 크기 및 폰트 설정
  ctx.fillText(`Life: ${life}`, 300, 30); // 생명력 출력
}

function increaseScore() {
  score++; // 스코어를 1씩 증가
}

function decreaseTime() {
  time -= 1; // 시간을 1씩 감소
}

function animate() {
  animation = requestAnimationFrame(animate); // 애니메이션 프레임 요청
  timer++; // 타이머 증가로 시간 경과 추적
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스를 지움
  moveObstacles(); // 장애물 이동 처리

  if (timer % 240 === 0) {
    obstacles.push(getRandomObstacle()); // 일정 간격마다 새로운 장애물 생성
  }

  obstacles.forEach((obstacle, i, array) => {
    if (obstacle.y + obstacle.height > 600) {
      array.splice(i, 1); // 장애물이 화면 아래로 벗어났을 때 배열에서 제거
      score += 100; // 스코어 100점 추가
    }
    ctx.fillStyle = obstacle.color; // 장애물의 색상 설정
    ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height); // 장애물 그리기
  });

  checkCollisions(); // 충돌 확인
  dd(); // 게임 종료 확인

  if (left && character.x - 5 > 0) {
    character.x -= 5; // 왼쪽 화살표 키가 눌렸고, 캐릭터가 화면 왼쪽 안쪽에 있을 때 왼쪽으로 이동
  }

  if (right && character.x + character.width + 5 < canvas.width) {
    character.x += 5; // 오른쪽 화살표 키가 눌렸고, 캐릭터가 화면 오른쪽 안쪽에 있을 때 오른쪽으로 이동
  }

  drawScore(); // 스코어 그리기
  drawTime(); // 시간 그리기
  drawLife(); // 생명력 그리기
  ctx.fillStyle = character.color; // 캐릭터의 색상 설정
  ctx.fillRect(character.x, character.y, character.width, character.height); // 캐릭터 그리기
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


