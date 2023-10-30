const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = 1000;
canvas.height = 600;

// 게임 변수
let score = 0; // 현재 점수
let scoreInterval; // 점수 업데이트에 사용되는 인터벌
let time = 0; // 시작 시간
let timeInterval; // 시간 업데이트에 사용되는 인터벌
let timer = 0; // 시간 측정을 위한 타이머
let animation; // 게임 애니메이션 프레임

// 화살표 키 상태 변수
let left = false; // 왼쪽 화살표 키 상태 (눌림/안눌림)
let right = false; // 오른쪽 화살표 키 상태 (눌림/안눌림)

// 캐릭터 이미지 객체 및 프레임 정보
let imgBasic = new Image(); // 기본 캐릭터 이미지 객체 생성
imgBasic.src = "./img/character.png"; // 이미지 파일 경로 설정

let characterFrames = [
  { x: 0, y: 0, width: 39, height: 66 },
  { x: 43, y: 0, width: 39, height: 66 },
  { x: 86, y: 0, width: 39, height: 66 },
  { x: 128, y: 0, width: 39, height: 66 },
  { x: 0, y: 71, width: 39, height: 66 },
  { x: 43, y: 71, width: 39, height: 66 },
  { x: 86, y: 71, width: 39, height: 66 },
  { x: 128, y: 71, width: 39, height: 66 },
  { x: 172, y: 71, width: 39, height: 66 },
  { x: 215, y: 71, width: 39, height: 66 },
  { x: 258, y: 71, width: 39, height: 66 },
  { x: 301, y: 71, width: 39, height: 66 },
  { x: 0, y: 144, width: 39, height: 66 },
];

let currentFrame = 0; // 현재 프레임 인덱스

function updateCharacterFrame() {
  if (invincible) {
    character.frameInfo = characterFrames[12];
    return; // 무적이 상태일때 애니메이션을 중지
  }
  if (left) {
    // 왼쪽 화살표 키가 눌렸을 때 4부터 7까지 반복
    currentFrame = ((currentFrame + 1) % 4) + 4;
  } else if (right) {
    // 오른쪽 화살표 키가 눌렸을 때 8부터 11까지 반복
    currentFrame = ((currentFrame + 1) % 4) + 8;
  } else {
    // 어떤 화살표 키도 눌리지 않았을 때 0부터 3까지 반복
    currentFrame = (currentFrame + 1) % 4;
  }
  character.frameInfo = characterFrames[currentFrame];
}

imgBasic.onload = () => {
  character.draw(); // 이미지가 로드되면 캐릭터를 그림
};

// 캐릭터 객체
let character = {
  x: canvas.width / 2 - 39, // 캐릭터의 초기 x 좌표
  y: canvas.height - 205, // 캐릭터의 초기 y 좌표
  width: 39, // 캐릭터의 너비
  height: 66, // 캐릭터의 높이
  img: imgBasic, // 캐릭터 이미지
  frameInfo: characterFrames[0], // 현재 프레임 정보

  draw() {
    ctx.drawImage(this.img, this.frameInfo.x, this.frameInfo.y, this.frameInfo.width, this.frameInfo.height, this.x, this.y, this.width, this.height);
  },
};

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

// 장애물 이미지 객체 배열
const obstacleImages = [];

// 각 장애물 이미지 객체 생성 및 배열에 추가
const imgObstacle1 = new Image();
imgObstacle1.src = "../img/1.png";
obstacleImages.push(imgObstacle1);

const imgObstacle2 = new Image();
imgObstacle2.src = "../img/2.png";
obstacleImages.push(imgObstacle2);

const imgObstacle3 = new Image();
imgObstacle3.src = "../img/3.png";
obstacleImages.push(imgObstacle3);

const imgObstacle4 = new Image();
imgObstacle4.src = "../img/4.png";
obstacleImages.push(imgObstacle4);

const imgObstacle5 = new Image();
imgObstacle5.src = "../img/meso.png";
obstacleImages.push(imgObstacle5);

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
  { width: 52, height: 20, speed: 4, image: obstacleImages[0], special: false },
  { width: 26, height: 42, speed: 4.5, image: obstacleImages[1], special: false },
  { width: 22, height: 56, speed: 5, image: obstacleImages[2], special: false },
  { width: 80, height: 40, speed: 2, image: obstacleImages[3], special: false },
  { width: 30, height: 29, speed: 7, image: obstacleImages[4], special: true },
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

let life = 3; // 생명력

// 충돌 확인
function checkCollisions() {
  for (const obstacle of obstacles) {
    // 무적이 아니고, 캐릭터와 장애물이 충돌했는지 확인
    if (!invincible && character.x < obstacle.x + obstacle.width && character.x + character.width > obstacle.x && character.y < obstacle.y + obstacle.height && character.y + character.height > obstacle.y) {
      console.log(obstacle);
      // 만약 장애물이 특수한 경우이면 점수 +200
      if (obstacle.special) {
        score += 200;
      } else {
        // 특수한 경우가 아니면 생명력 -1 점수 -100 무적 상태로 만듦
        makeCharacterInvincible();
        life--;
        score -= 100;
      }
      // 충돌한 장애물을 장애물 배열에서 제거
      obstacles.splice(obstacles.indexOf(obstacle), 1);
    }
  }
}

// 무적 상태 설정
function makeCharacterInvincible() {
  if (!invincible) {
    invincible = true;
    setTimeout(() => {
      invincible = false; // 일정 시간 후 무적 상태 해제
      character.frameInfo = characterFrames[0];
      left = false; // 왼쪽 이동 비활성화
      right = false; // 오른쪽 이동 비활성화
    }, 2000); // 2초 동안 무적 상태 유지
  }
}

// 게임 난이도 업데이트
function gameUpdate() {
  if (life === 0) {
    endGame();
  } else if (time >= 330) {
    if (timer % 10 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 1;
      });
    }
  } else if (time >= 300) {
    if (timer % 20 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 1;
      });
    }
  } else if (time >= 270) {
    if (timer % 20 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.8;
      });
    }
  } else if (time >= 240) {
    if (timer % 30 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.8;
      });
    }
  } else if (time >= 210) {
    if (timer % 30 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.6;
      });
    }
  } else if (time >= 180) {
    if (timer % 40 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.6;
      });
    }
  } else if (time >= 150) {
    if (timer % 40 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.4;
      });
    }
  } else if (time > 120) {
    if (timer % 50 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.4;
      });
    }
  } else if (time > 90) {
    if (timer % 50 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.2;
      });
    }
  } else if (time > 60) {
    if (timer % 60 === 0) {
      obstacles.push(getRandomObstacle());
      obstacles.forEach((obstacle) => {
        obstacle.speed += 0.2;
      });
    }
  } else if (time > 30) {
    if (timer % 60 === 0) {
      obstacles.push(getRandomObstacle());
    }
  }
}

const gameOver = document.querySelector(".gameOver");

// 로컬 스토리지에서 "highScore" 값을 가져오거나, 값이 없을 경우 0으로 초기화
let highScore = localStorage.getItem("highScore") || 0;
const highScoreItem = document.getElementById("highScore");
highScoreItem.innerHTML = highScore;

// 게임 종료
function endGame() {
  score += time * 20; // 게임 종료시 점수에 시간을 곱해서 더해줌
  cancelAnimationFrame(animation); // 현재 게임 애니메이션 프레임 초기화
  obstacles.length = 0; // 장애물 배열 초기화
  playBtn.style.display = "block"; // 게임 시작 버튼 화면에 표시
  gameOver.style.display = "block"; // 게임 종료 화면에 표시

  // 게임 오버 시 현재 스코어와 하이스코어 비교
  if (score > highScore) {
    // 현재 스코어가 하이스코어를 넘어서면 업데이트
    highScore = score;
    // 로컬 스토리지에 하이스코어 저장
    localStorage.setItem("highScore", highScore.toString());
  }

  highScoreItem.innerHTML = highScore;
}

// 스코어 증가 함수
function increaseScore() {
  score++;
}

// 시간 증가 함수
function increaseTime() {
  time++;
}

const lifeId = document.querySelector("#life");
const scoreId = document.querySelector("#score");
const score1Id = document.querySelector("#score1");
const timeId = document.querySelector("#time");

// 애니메이션 함수
function animate() {
  animation = requestAnimationFrame(animate); // 애니메이션 프레임 요청
  timer++; // 타이머 증가로 시간 경과 추적
  ctx.clearRect(0, 0, canvas.width, canvas.height); // 캔버스 초기화
  moveObstacles(); // 장애물 이동 처리

  if (timer % 70 === 0) {
    obstacles.push(getRandomObstacle()); // 70프레임마다 새로운 장애물 생성
  }
  obstacles.forEach((obstacle, i, array) => {
    if (obstacle.y + obstacle.height > 455) {
      array.splice(i, 1); // 장애물이 화면 아래로 벗어났을 때 배열에서 제거
      score += 20; // 스코어 20점 추가
    }
    obstacle.draw();
  });

  checkCollisions(); // 충돌 확인
  gameUpdate(); // 게임 난이도 업데이트

  if (left && character.x - 5 > 0) {
    if (!invincible) {
      character.x -= 5; // 왼쪽 화살표 키가 눌렸고, 캐릭터가 화면 왼쪽 안쪽에 있을 때 왼쪽으로 이동
    }
  }

  if (right && character.x + character.width + 5 < canvas.width) {
    if (!invincible) {
      character.x += 5; // 오른쪽 화살표 키가 눌렸고, 캐릭터가 화면 오른쪽 안쪽에 있을 때 오른쪽으로 이동
    }
  }

  lifeId.innerHTML = life;
  scoreId.innerHTML = score;
  score1Id.innerHTML = score;
  timeId.innerHTML = time;

  if (timer % 10 === 0) {
    updateCharacterFrame();
  }
  character.draw();
}

const playBtn = document.getElementById("playBtn");
playBtn.addEventListener("click", startGame); // 게임 시작 버튼에 클릭 `이벤트 리스너 등록

function startGame() {
  clearInterval(scoreInterval);
  clearInterval(timeInterval);

  cancelAnimationFrame(animation); // 현재 게임 애니메이션 프레임 초기화
  animation = requestAnimationFrame(animate); // 애니메이션 시작
  score = 0; // 스코어 초기화
  scoreInterval = setInterval(increaseScore, 1000); // 스코어 증가 인터벌 설정
  time = 0; // 시간 초기화
  timeInterval = setInterval(increaseTime, 1000); // 시간 감소 인터벌 설정
  playBtn.style.display = "none"; // 게임 시작 버튼 숨김
  gameOver.style.display = "none";
  life = 3; // 생명력 초기화

  initObstacles(); // 장애물 초기화
}

// 오디오 요소 생성
// const audio = new Audio("bgm.mp3"); // 오디오 파일 경로 지정

// // 재생 버튼 클릭 이벤트 처리
// const audioPlayBtn = document.getElementById("audio-play");

// audioPlayBtn.addEventListener("click", function () {
//   if (audio.paused) {
//     audio.play();
//     audioPlayBtn.textContent = "Audio-Pause";
//   } else {
//     audio.pause();
//     audioPlayBtn.textContent = "Audio-Play";
//   }
// });
