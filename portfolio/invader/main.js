const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const overlay = document.getElementById("overlay");
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const waveEl = document.getElementById("wave");
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");

const state = {
  running: false,
  paused: false,
  gameOver: false,
  score: 0,
  lives: 3,
  wave: 1,
  waveClearTimer: 0,
  invaderSpeed: 40,
  invaderDir: 1,
  enemyShootTimer: 1,
};

const bounds = { width: 480, height: 640 };
const keys = new Set();

const player = {
  x: 0,
  y: 0,
  width: 40,
  height: 14,
  speed: 220,
  cooldown: 0,
  invul: 0,
};

let invaders = [];
let bullets = [];
let enemyBullets = [];
let stars = [];
let lastTime = 0;
let rafId = null;

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

function resizeCanvas() {
  const maxHeight = window.innerHeight * 0.6;
  const maxWidthFromHeight = maxHeight / 1.25;
  const maxWidth = Math.min(520, window.innerWidth * 0.9, maxWidthFromHeight);
  const targetHeight = Math.round(maxWidth * 1.25);

  canvas.style.width = `${maxWidth}px`;
  canvas.style.height = `${targetHeight}px`;

  const dpr = window.devicePixelRatio || 1;
  canvas.width = Math.floor(maxWidth * dpr);
  canvas.height = Math.floor(targetHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  bounds.width = maxWidth;
  bounds.height = targetHeight;

  player.y = bounds.height - 50;
  player.x = clamp(player.x, 10, bounds.width - player.width - 10);

  buildStars();
}

function buildStars() {
  const count = Math.floor(bounds.width * bounds.height / 7000);
  stars = Array.from({ length: count }, () => ({
    x: Math.random() * bounds.width,
    y: Math.random() * bounds.height,
    r: rand(0.6, 1.6),
    speed: rand(10, 30),
  }));
}

function resetState() {
  state.score = 0;
  state.lives = 3;
  state.wave = 1;
  state.invaderSpeed = 40;
  state.invaderDir = 1;
  state.enemyShootTimer = 1;
  state.waveClearTimer = 0;
  bullets = [];
  enemyBullets = [];
  player.cooldown = 0;
  player.invul = 0;
  player.x = bounds.width / 2 - player.width / 2;
  spawnWave();
  updateHud();
}

function spawnWave() {
  const cols = 10;
  const rowsTarget = Math.min(4 + state.wave, 7);
  const invaderWidth = 26;
  const invaderHeight = 18;
  const gapX = 14;
  const gapY = 12;
  const totalWidth = cols * invaderWidth + (cols - 1) * gapX;
  const startX = (bounds.width - totalWidth) / 2;
  const startY = Math.max(20, Math.min(60, bounds.height * 0.18));
  const dangerLine = player.y - 12;
  const availableHeight = Math.max(0, dangerLine - startY);
  const rowsMax = Math.max(1, Math.floor((availableHeight + gapY) / (invaderHeight + gapY)));
  const rows = Math.min(rowsTarget, rowsMax);

  invaders = [];
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      invaders.push({
        x: startX + col * (invaderWidth + gapX),
        y: startY + row * (invaderHeight + gapY),
        w: invaderWidth,
        h: invaderHeight,
        row,
        col,
        alive: true,
      });
    }
  }
}

function updateHud() {
  scoreEl.textContent = state.score;
  livesEl.textContent = state.lives;
  waveEl.textContent = state.wave;
}

function showOverlay(message) {
  overlay.textContent = message;
  overlay.style.opacity = message ? "1" : "0";
}

function startGame() {
  state.running = true;
  state.paused = false;
  state.gameOver = false;
  resetState();
  showOverlay("");
  if (rafId !== null) {
    cancelAnimationFrame(rafId);
    rafId = null;
  }
  lastTime = performance.now();
  rafId = requestAnimationFrame(loop);
}

function togglePause() {
  if (!state.running) {
    return;
  }
  state.paused = !state.paused;
  showOverlay(state.paused ? "Paused" : "");
}

function handleKeys(event, pressed) {
  if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space", "Enter", "KeyP"].includes(event.code)) {
    event.preventDefault();
  }
  if (pressed) {
    keys.add(event.code);
  } else {
    keys.delete(event.code);
  }

  if (event.code === "Enter" && pressed) {
    startGame();
  }

  if (event.code === "KeyP" && pressed) {
    togglePause();
  }
}

function firePlayerBullet() {
  if (player.cooldown > 0) {
    return;
  }
  bullets.push({
    x: player.x + player.width / 2 - 2,
    y: player.y - 6,
    w: 4,
    h: 10,
  });
  player.cooldown = 0.25;
}

function fireEnemyBullet() {
  const shootersByCol = new Map();
  invaders.forEach((invader) => {
    if (!invader.alive) {
      return;
    }
    const existing = shootersByCol.get(invader.col);
    if (!existing || invader.row > existing.row) {
      shootersByCol.set(invader.col, invader);
    }
  });

  const shooters = Array.from(shootersByCol.values());
  if (shooters.length === 0) {
    return;
  }
  const shooter = shooters[Math.floor(Math.random() * shooters.length)];
  enemyBullets.push({
    x: shooter.x + shooter.w / 2 - 2,
    y: shooter.y + shooter.h + 2,
    w: 4,
    h: 10,
  });
}

function updateStars(dt) {
  stars.forEach((star) => {
    star.y += star.speed * dt;
    if (star.y > bounds.height) {
      star.y = -5;
      star.x = Math.random() * bounds.width;
    }
  });
}

function updateInvaders(dt) {
  let hasAlive = false;
  const dx = state.invaderDir * state.invaderSpeed * dt;
  let minX = Infinity;
  let maxX = -Infinity;

  invaders.forEach((invader) => {
    if (!invader.alive) {
      return;
    }
    hasAlive = true;
    minX = Math.min(minX, invader.x + dx);
    maxX = Math.max(maxX, invader.x + invader.w + dx);
  });

  if (!hasAlive) {
    return;
  }

  const padding = 12;
  let shouldDrop = false;
  if (minX <= padding || maxX >= bounds.width - padding) {
    state.invaderDir *= -1;
    shouldDrop = true;
  }

  invaders.forEach((invader) => {
    if (!invader.alive) {
      return;
    }
    if (shouldDrop) {
      invader.y += 18;
    } else {
      invader.x += dx;
    }
  });
}

function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

function updateBullets(dt) {
  bullets.forEach((bullet) => {
    bullet.y -= 420 * dt;
  });
  bullets = bullets.filter((bullet) => bullet.y + bullet.h > -10);

  enemyBullets.forEach((bullet) => {
    bullet.y += 240 * dt;
  });
  enemyBullets = enemyBullets.filter((bullet) => bullet.y < bounds.height + 20);
}

function checkCollisions() {
  bullets.forEach((bullet) => {
    if (bullet.hit) {
      return;
    }
    invaders.forEach((invader) => {
      if (!invader.alive || bullet.hit) {
        return;
      }
      if (rectsOverlap(bullet, invader)) {
        invader.alive = false;
        bullet.hit = true;
        state.score += 100;
      }
    });
  });

  bullets = bullets.filter((bullet) => !bullet.hit);

  if (player.invul <= 0) {
    enemyBullets.forEach((bullet) => {
      if (bullet.hit) {
        return;
      }
      if (rectsOverlap(bullet, player)) {
        bullet.hit = true;
        player.invul = 1.1;
        state.lives -= 1;
        updateHud();
        if (state.lives <= 0) {
          endGame();
        }
      }
    });
  }

  enemyBullets = enemyBullets.filter((bullet) => !bullet.hit);
}

function updatePlayer(dt) {
  if (player.invul > 0) {
    player.invul -= dt;
  }

  if (keys.has("ArrowLeft") || keys.has("KeyA")) {
    player.x -= player.speed * dt;
  }
  if (keys.has("ArrowRight") || keys.has("KeyD")) {
    player.x += player.speed * dt;
  }
  player.x = clamp(player.x, 8, bounds.width - player.width - 8);

  if (keys.has("Space")) {
    firePlayerBullet();
  }

  if (player.cooldown > 0) {
    player.cooldown -= dt;
  }
}

function maybeEnemyShoot(dt) {
  state.enemyShootTimer -= dt;
  if (state.enemyShootTimer <= 0) {
    fireEnemyBullet();
    const speedFactor = 1 + state.wave * 0.08;
    state.enemyShootTimer = rand(0.5, 1.1) / speedFactor;
  }
}

function checkWaveClear() {
  if (invaders.every((invader) => !invader.alive)) {
    state.wave += 1;
    state.invaderSpeed += 6;
    state.invaderDir = 1;
    state.waveClearTimer = 0.8;
    bullets = [];
    enemyBullets = [];
    spawnWave();
    updateHud();
  }
}

function checkInvaderReach() {
  const dangerLine = player.y - 8;
  return invaders.some((invader) => invader.alive && invader.y + invader.h >= dangerLine);
}

function update(dt) {
  updateStars(dt);
  if (state.waveClearTimer > 0) {
    state.waveClearTimer = Math.max(0, state.waveClearTimer - dt);
  }

  if (state.paused) {
    return;
  }

  updatePlayer(dt);
  updateInvaders(dt);
  updateBullets(dt);
  checkCollisions();
  maybeEnemyShoot(dt);
  checkWaveClear();

  if (checkInvaderReach()) {
    endGame();
  }
}

function drawPlayer() {
  if (player.invul > 0 && Math.floor(player.invul * 10) % 2 === 0) {
    return;
  }
  ctx.fillStyle = "#7ef2c3";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillRect(player.x + player.width / 2 - 6, player.y - 6, 12, 6);
}

function drawInvader(invader) {
  ctx.fillStyle = "#54e1ff";
  ctx.fillRect(invader.x, invader.y, invader.w, invader.h);
  ctx.clearRect(invader.x + 4, invader.y + 6, 4, 4);
  ctx.clearRect(invader.x + invader.w - 8, invader.y + 6, 4, 4);
}

function drawBullets() {
  ctx.fillStyle = "#f7ff9d";
  bullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });

  ctx.fillStyle = "#ff6b6b";
  enemyBullets.forEach((bullet) => {
    ctx.fillRect(bullet.x, bullet.y, bullet.w, bullet.h);
  });
}

function drawStars() {
  ctx.fillStyle = "rgba(255,255,255,0.6)";
  stars.forEach((star) => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawWaveText() {
  if (state.waveClearTimer > 0) {
    ctx.fillStyle = "rgba(101, 243, 177, 0.9)";
    ctx.font = "600 18px BIZ UDPGothic, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("WAVE " + state.wave, bounds.width / 2, 40);
  }
}

function draw() {
  ctx.clearRect(0, 0, bounds.width, bounds.height);
  drawStars();

  invaders.forEach((invader) => {
    if (invader.alive) {
      drawInvader(invader);
    }
  });

  drawPlayer();
  drawBullets();
  drawWaveText();
}

function endGame() {
  state.running = false;
  state.gameOver = true;
  showOverlay("Game Over - Press Enter");
}

function loop(timestamp) {
  if (!state.running) {
    rafId = null;
    return;
  }
  const dt = Math.min((timestamp - lastTime) / 1000, 0.033);
  lastTime = timestamp;
  update(dt);
  draw();
  rafId = requestAnimationFrame(loop);
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("keydown", (event) => handleKeys(event, true));
window.addEventListener("keyup", (event) => handleKeys(event, false));

canvas.addEventListener("pointerdown", (event) => {
  if (!state.running) {
    startGame();
  }
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  player.x = clamp(x - player.width / 2, 8, bounds.width - player.width - 8);
  firePlayerBullet();
  canvas.setPointerCapture(event.pointerId);
});

canvas.addEventListener("pointermove", (event) => {
  if (event.pressure === 0) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  player.x = clamp(x - player.width / 2, 8, bounds.width - player.width - 8);
});

canvas.addEventListener("pointerup", (event) => {
  canvas.releasePointerCapture(event.pointerId);
});

startBtn.addEventListener("click", startGame);
pauseBtn.addEventListener("click", togglePause);

resizeCanvas();
updateHud();
showOverlay("Press Enter to Start");
