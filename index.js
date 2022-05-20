const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;
const ground = canvas.height - 96;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: "./img/background.png",
});
const shop = new Sprite({
  position: {
    x: 600,
    y: 128,
  },
  imageSrc: "./img/shop.png",
  scale: 2.75,
  framesMax: 6,
});

const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: "./img/samuraiMack/Idle.png",
      framesMax: 8,
    },
    run: {
      imageSrc: "./img/samuraiMack/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/samuraiMack/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/samuraiMack/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/samuraiMack/Attack1.png",
      framesMax: 6,
    },
    takeHit: {
      imageSrc: "./img/samuraiMack/Take hit - white silhouette.png",
      framesMax: 4,
    },
    death: {
      imageSrc: "./img/samuraiMack/Death.png",
      framesMax: 6,
    },
  },
  attackBox: {
    offset: {
      x: 60,
      y: 30,
    },
    width: 197.4,
    height: 50,
  },
  bodyOffset: {
    x: 10,
    y: 0,
  },
});
player.switchSprite("idle");

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  scale: 2.5,
  offset: {
    x: 215,
    y: 170,
  },
  sprites: {
    idle: {
      imageSrc: "./img/kenji/Idle.png",
      framesMax: 4,
    },
    run: {
      imageSrc: "./img/kenji/Run.png",
      framesMax: 8,
    },
    jump: {
      imageSrc: "./img/kenji/Jump.png",
      framesMax: 2,
    },
    fall: {
      imageSrc: "./img/kenji/Fall.png",
      framesMax: 2,
    },
    attack1: {
      imageSrc: "./img/kenji/Attack1.png",
      framesMax: 4,
    },
    takeHit: {
      imageSrc: "./img/kenji/Take hit.png",
      framesMax: 3,
    },
    death: {
      imageSrc: "./img/kenji/Death.png",
      framesMax: 7,
    },
  },
  attackBox: {
    offset: {
      x: -172,
      y: 50,
    },
    width: 150,
    height: 50,
  },
  bodyOffset: {
    x: 10,
    y: 0,
  },
});
enemy.switchSprite("idle");

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

decreaseTimeer();

function animate() {
  window.requestAnimationFrame(animate);

  background.update();
  shop.update();
  player.update();
  enemy.update();

  //player movement
  if (keys.a.pressed && (player.lastKey === "a" || player.velocity.x === 0)) {
    player.velocity.x = -5;
    player.lastKey = "a";
    player.switchSprite("run");
  } else if (
    keys.d.pressed &&
    (player.lastKey === "d" || player.velocity.x === 0)
  ) {
    player.velocity.x = 5;
    player.lastKey = "d";
    player.switchSprite("run");
  } else {
    player.velocity.x = 0;
    player.switchSprite("idle");
  }

  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //enemy movement
  if (
    keys.ArrowLeft.pressed &&
    (enemy.lastKey === "ArrowLeft" || enemy.velocity.x === 0)
  ) {
    enemy.velocity.x = -5;
    enemy.lastKey = "ArrowLeft";
    enemy.switchSprite("run");
  } else if (
    keys.ArrowRight.pressed &&
    (enemy.lastKey === "ArrowRight" || enemy.velocity.x === 0)
  ) {
    enemy.velocity.x = 5;
    enemy.lastKey = "ArrowRight";
    enemy.switchSprite("run");
  } else {
    enemy.velocity.x = 0;
    enemy.switchSprite("idle");
  }

  if (enemy.velocity.y < 0) {
    enemy.switchSprite("jump");
  } else if (enemy.velocity.y > 0) {
    enemy.switchSprite("fall");
  }

  if (
    player.framesCurrent === 5 &&
    rectangluarCollision({ rec1: player, rec2: enemy }) &&
    player.isAttacking
  ) {
    enemy.takeHit();
    player.isAttacking = false;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }
  if (player.isAttacking && player.framesCurrent === 5) {
    player.isAttacking = false;
  }

  if (
    enemy.framesCurrent === 2 &&
    rectangluarCollision({ rec1: enemy, rec2: player }) &&
    enemy.isAttacking
  ) {
    player.takeHit();
    enemy.isAttacking = false;
    player.health += 87;
    if (player.health < 0) player.health = 0;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }
  if (enemy.isAttacking && enemy.framesCurrent === 2) {
    enemy.isAttacking = false;
  }

  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
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
      if (player.position.y + player.height == ground) player.velocity.y = -20;
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
      if (enemy.position.y + enemy.height == ground) enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
    case " ":
      player.attack();
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
});
