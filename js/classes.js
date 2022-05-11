class Sprite {
  constructor({
    position,
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset = { x: 0, y: 0 },
  }) {
    this.position = position;
    this.image = new Image();
    this.image.src = imageSrc;
    this.scale = scale;
    this.framesMax = framesMax;
    this.framesCurrent = 0;
    this.framesElapsed = 0;
    this.framesHold = 5;
    this.offset = offset;
  }

  draw() {
    c.drawImage(
      this.image,
      this.framesCurrent * this.renderingWidth,
      0,
      this.renderingWidth,
      this.image.height,
      this.position.x - this.offset.x,
      this.position.y - this.offset.y,
      this.renderingWidth * this.scale,
      this.image.height * this.scale,
    );
    this.renderingWidth = this.image.width / this.framesMax;
  }

  animateFrames() {
    this.framesElapsed++;
    if (this.framesElapsed % this.framesHold == 0) {
      if (this.framesCurrent < this.framesMax - 1) {
        this.framesCurrent++;
      } else {
        this.framesCurrent = 0;
      }
    }
  }

  update() {
    this.draw();
    this.animateFrames();
  }
}

class Fighter extends Sprite {
  constructor({
    position,
    velocity,
    color = "red",
    imageSrc,
    scale = 1,
    framesMax = 1,
    offset,
    sprites,
  }) {
    super({
      position,
      imageSrc,
      scale,
      framesMax,
      offset,
      sprites,
    });
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
    this.health = 100;
    this.sprites = sprites;
    
    for (const idx in this.sprites) {
      this.sprites[idx].image = new Image();
      this.sprites[idx].image.src = this.sprites[idx].imageSrc;
    }
  }

  // draw() {
  //   c.fillStyle = this.color;
  //   c.fillRect(this.position.x, this.position.y, this.width, this.height);

  //   //attack box
  //   if (this.isAttacking) {
  //     c.fillStyle = "green";
  //     c.fillRect(
  //       this.attackBox.position.x,
  //       this.attackBox.position.y,
  //       this.attackBox.width,
  //       this.attackBox.height,
  //     );
  //   }
  // }

  update() {
    this.draw();
    this.animateFrames();
    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    if (this.position.y + this.height + this.velocity.y >= ground) {
      this.toEarth();
    } else this.velocity.y += gravity;
  }

  toEarth() {
    this.position.y = ground - this.height;
    this.velocity.y = 0;
  }

  attack() {
    this.switchSprite("attack1");
    this.isAttacking = true;
    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }

  switchSprite(sprite) {
    if (
      this.image === this.sprites.attack1.image &&
      this.framesCurrent < this.sprites.attack1.framesMax - 1
    ) {
      return;
    }
    if (player.image !== player.sprites[sprite].image) {
      player.image = player.sprites[sprite].image;
      player.framesMax = player.sprites[sprite].framesMax;
      this.framesCurrent = 0;
    }
  }
}
