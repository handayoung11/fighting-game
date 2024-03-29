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
    this.flipped = false;
  }

  draw() {
    if (this.flipped) {
      c.translate(this.position.x + this.offset.x + this.offset.body, 0);
      c.scale(-1, 1);
    } else {
      c.translate(this.position.x - this.offset.x, 0);
    }
    c.drawImage(
      this.image,
      this.framesCurrent * this.renderingWidth,
      0,
      this.renderingWidth,
      this.image.height,
      0,
      this.position.y - this.offset.y,
      this.renderingWidth * this.scale,
      this.image.height * this.scale,
    );
    this.renderingWidth = this.image.width / this.framesMax;
    c.setTransform(1,0,0,1,0,0);
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
    this.deathIsCompleted = true;

    for (const idx in this.sprites) {
      this.sprites[idx].image = new Image();
      this.sprites[idx].image.src = this.sprites[idx].imageSrc;
    }
  }

  update() {
    this.draw();
    this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
    if (this.flipped) {
      this.attackBox.position.x = this.position.x - this.attackBox.width - this.attackBox.offset.x + this.offset.body;
    } else {
      this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    }
    // draw attack box
    // c.fillStyle = "rgba(255, 255, 255, 0.149019607843137)";
    // c.fillRect(
    //   this.attackBox.position.x,
    //   this.attackBox.position.y,
    //   this.attackBox.width,
    //   this.attackBox.height,
    // );
    if (this.alive || this.deathIsCompleted) this.animateFrames();
    const nextX = this.position.x + this.velocity.x;
    if (nextX >= 0 && nextX <= 970) {
      //벽설정
      this.position.x = nextX;
    }
    this.position.y += this.velocity.y;

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
        this.deathIsCompleted = false;
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

    // if (this.image === this.sprites.run.image) {
    //   this.flipped = true;
    // }
  }

  takeHit() {
    this.health -= this.damage;
    this.isAttacking = false;

    if (this.health <= 0) {
      this.alive = false;
      this.switchSprite("death");
      //죽는 경우 움직임 정지
      if (this === player) {
        keys.a.pressed = false;
        keys.d.pressed = false;
      }
      if (this === enemy) {
        keys.ArrowLeft.pressed = false;
        keys.ArrowRight.pressed = false;
      }
      this.velocity.x = 0;
    } else {
      this.switchSprite("takeHit");
    }
  }
}
