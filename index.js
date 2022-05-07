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
const player = new Fighter({
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

decreaseTimeer();

function animate() {
  window.requestAnimationFrame(animate);
  
  background.update();
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
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangluarCollision({ rec1: enemy, rec2: player }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
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
      if (player.position.y + player.height == ground)
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
      if (enemy.position.y + enemy.height == ground)
        enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
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
