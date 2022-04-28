const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

class Sprite {
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset,
      width: 100,
      height: 50,
    };
    this.color = color;
    this.isAttacking;
  }

  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height,
      );
    }
  }

  update() {
    this.draw();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    if (this.position.y + this.height + this.velocity.y >= canvas.height) {
      this.toEarth();
    } else this.velocity.y += gravity;
  }

  toEarth() {
    this.position.y = canvas.height - this.height;
    this.velocity.y = 0;
  }

  attack() {
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
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
  offset: {
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
  color: "blue",
  offset: {
    x: -50,
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

function rectangluarCollision({ rec1, rec2 }) {
  return (
    rec1.attackBox.position.x + rec1.attackBox.width >= rec2.position.x &&
    rec1.attackBox.position.x <= rec2.position.x + rec2.width &&
    rec1.attackBox.position.y + rec1.attackBox.height >= rec2.position.y &&
    rec1.attackBox.position.y <= rec2.position.y + rec2.height
  );
}

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

  if (
    rectangluarCollision({ rec1: player, rec2: enemy }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    console.log("go");
  }

  if (
    rectangluarCollision({ rec1: enemy, rec2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    console.log("enemy attack successful");
  }
}

animate();

window.addEventListener("keydown", (event) => {
  switch (event.key) {
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
    case "ArrowDown":
      enemy.isAttacking = true;
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
    case " ":
      player.attack();
      break;

    //enemy event
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
  }
});
