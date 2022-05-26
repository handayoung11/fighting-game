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
    scale = 1,
    offset,
    sprites,
    bodyOffset = { x, y },
    attackBox = { offset: {}, width, height },
    damage,
  }) {
    super({
      position,
      scale,
      offset,
      sprites,
    });
    this.damage = damage;
    this.bodyOffset = bodyOffset;
    this.velocity = velocity;
    this.height = 150;
    this.width = 50;
    this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset: attackBox.offset,
      width: attackBox.width,
      height: attackBox.height,
    };
    this.color = color;
    this.isAttacking;
    this.health = 100;
    this.sprites = sprites;
    this.alive = true;

    for (const idx in this.sprites) {
      this.sprites[idx].image = new Image();
      this.sprites[idx].image.src = this.sprites[idx].imageSrc;
    }
  }

  update() {
    this.draw();
    // draw attack box
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height,
    // );
    if (this.alive) this.animateFrames();
    const nextX = this.position.x + this.velocity.x;
    if (nextX >= 0 && nextX <= 970) {
      //벽설정
      this.position.x = nextX;
    }
    this.position.y += this.velocity.y;
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

    if (this.position.y + this.height + this.velocity.y >= ground) {
      this.toEarth();
    } else this.velocity.y += gravity;
  }

  toEarth() {
    this.position.y = ground - this.height;
    this.velocity.y = 0;
  }

  attack() {
    if (
      this.image !== this.sprites.attack1.image &&
      this.image != this.sprites.takeHit.image
    ) {
      this.switchSprite("attack1");
      this.isAttacking = true;
    }
  }

  switchSprite(sprite) {
    if (this.image === this.sprites.death.image) {
      if (this.framesCurrent === this.sprites.death.framesMax - 1) {
        this.alive = false;
      }
      return;
    }
    //override when fighter gets hit
    if (
      this.image === this.sprites.takeHit.image &&
      (this.framesCurrent < this.sprites.takeHit.framesMax - 1 ||
        this.framesElapsed % this.framesHold != 4)
    ) {
      return;
    }
    // overriding all other animations with attack animation
    if (
      this.image === this.sprites.attack1.image &&
      (this.framesCurrent < this.sprites.attack1.framesMax - 1 ||
        this.framesElapsed % this.framesHold != 4) &&
      this.sprites.takeHit !== this.sprites[sprite]
    ) {
      return;
    }

    if (this.image !== this.sprites[sprite].image) {
      this.image = this.sprites[sprite].image;
      this.framesMax = this.sprites[sprite].framesMax;
      this.framesCurrent = 0;
    }
  }

  takeHit() {
    this.health -= this.damage;
    this.isAttacking = false;

    if (this.health <= 0) {
      this.switchSprite("death");
    } else {
      this.switchSprite("takeHit");
    }
  }
}
