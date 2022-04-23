const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
  }

  draw() {
    c.fillStyle = "red";
    c.fillRect(this.position.x, this.position.y, 50, this.height);
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.toEarth();
    } else this.velocity.y += gravity;
  }

  toEarth() {
    this.position.y = canvas.height - this.height;
    this.velocity.y = 0;
  }
}

const player = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const enemy = new Sprite({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
});

const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  player.update();
  enemy.update();

  //player movement
  if (keys.a.pressed && (player.lastKey === "a" || player.velocity.x === 0)) {
    player.velocity.x = -5;
    player.lastKey = "a";
  } else if (
    keys.d.pressed &&
    (player.lastKey === "d" || player.velocity.x === 0)
  ) {
    player.velocity.x = 5;
    player.lastKey = "d";
  } else {
    player.velocity.x = 0;
  }

  //enemy movement
  if (
    keys.ArrowLeft.pressed &&
    (enemy.lastKey === "ArrowLeft" || enemy.velocity.x === 0)
  ) {
    enemy.velocity.x = -5;
    enemy.lastKey = "ArrowLeft";
  } else if (
    keys.ArrowRight.pressed &&
    (enemy.lastKey === "ArrowRight" || enemy.velocity.x === 0)
  ) {
    enemy.velocity.x = 5;
    enemy.lastKey = "ArrowRight";
  } else {
    enemy.velocity.x = 0;
  }
}

animate();

window.addEventListener("keydown", (event) => {
  console.log("keydown" + event.key);
    
  switch (event.key) {
    //player event
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "w":
      player.velocity.y = -20;
      break;

    //enemy event
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
  }
});

window.addEventListener("keyup", (event) => {
  switch (event.key) {
    //player event
    case "a":
      keys.a.pressed = false;
      break;
    case "d":
      keys.d.pressed = false;
      break;
    case "w":
      break;

    //enemy event
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
  console.log("keyup" + event.key);
});
