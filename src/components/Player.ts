import 'phaser'
import {Images} from '../assets';

export default class Player extends Phaser.Sprite {
  private TOP_SPEED: number = 500

  private moveUpKey: Phaser.Key
  private moveDownKey: Phaser.Key
  private moveLeftKey: Phaser.Key
  private moveRightKey: Phaser.Key

  constructor(game: Phaser.Game) {
    super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())
    game.add.existing(this)

    this.moveUpKey = game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.moveDownKey = game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.D);

    game.physics.enable(this, Phaser.Physics.ARCADE);
  }

  update(): void {
    if (this.moveUpKey.isDown) {
      this.body.velocity.y = this.accelerate(this.body.velocity.y, false)
    } else if (this.moveDownKey.isDown) {
      this.body.velocity.y = this.accelerate(this.body.velocity.y, true)
    } else {
      this.body.velocity.y = this.deAccelerate(this.body.velocity.y)
    }

    if (this.moveLeftKey.isDown) {
      this.body.velocity.x = this.accelerate(this.body.velocity.x, false)
    } else if (this.moveRightKey.isDown) {
      this.body.velocity.x = this.accelerate(this.body.velocity.x, true)
    } else {
      this.body.velocity.x = this.deAccelerate(this.body.velocity.x)
    }

  }

  /**
   * Accelerate speed up until top speed, or return the top speed
   * @param {number} velocity
   * @param {boolean} positiveDir - If the direction of the velocity is positive or negative
   * @returns {number} The new velocity
   */
  private accelerate(velocity: number, positiveDir: boolean): number {
    const step = 50

    if ((positiveDir && velocity === this.TOP_SPEED) || (!positiveDir && velocity === -this.TOP_SPEED)) {
      return velocity
    }

    if (positiveDir) {
      velocity += step
      return velocity >= this.TOP_SPEED ? this.TOP_SPEED : velocity
    } else {
      velocity -= step
      return velocity <= -this.TOP_SPEED ? -this.TOP_SPEED : velocity
    }
  }

  /**
   * De-accelerate the velocity in a direction
   * @param {number} velocity
   * @returns {number} The new velocity
   */
  private deAccelerate(velocity: number): number {
    const lowestLimit = 2

    if (velocity > 0) {
      velocity -= velocity / 5
      velocity = (velocity <= lowestLimit) ? 0 : velocity
    } else if (velocity < 0) {
      velocity += Math.abs(velocity / 5)
      velocity = (velocity >= -lowestLimit) ? 0 : velocity
    } else {
      return 0;
    }

    return velocity
  }
}

