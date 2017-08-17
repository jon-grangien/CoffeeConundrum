import 'phaser'
import {Images} from '../assets'
import GameManager from '../globals/GameManager'
import { PLAYER_INVULNERABILITY_COOLDOWN, PLAYER_HEALTH } from '../globals/constants'

export default class Player extends Phaser.Sprite {
  private TOP_SPEED: number = 350

  private canons: Phaser.Weapon
  private timer: Phaser.Timer
  private invulnerable: boolean = false
  private invulnerableTween: Phaser.Tween

  private moveUpKey: Phaser.Key
  private moveDownKey: Phaser.Key
  private moveLeftKey: Phaser.Key
  private moveRightKey: Phaser.Key
  private shootKeys: Phaser.Key[]

  constructor(game: Phaser.Game) {
    super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())
    this.moveUpKey = game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.moveDownKey = game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.moveLeftKey = game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.moveRightKey = game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.shootKeys = [game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR), game.input.keyboard.addKey(Phaser.Keyboard.J)]

    this.health = PLAYER_HEALTH
    this.timer = game.time.create(false)

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)

    this.canons = game.add.weapon(-1, Images.SpritesheetsCanonbullet.getName())
    this.canons.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    this.canons.bulletSpeed = 1400
    this.canons.fireRate = 50
    this.canons.fireAngle = 0
    this.canons.trackSprite(this, 0, 0, false)

    this.events.onKilled.add(() => {
      GameManager.Instance.buryInGraveyard(this)
    })

    this.timer.start(0)
    game.add.existing(this)
  }

  /**
   * Return the weapon bullets group
   * @returns {Phaser.Group}
   */
  public getBullets(): Phaser.Group {
    return this.canons.bullets
  }

  /**
   * Get invulnerable cooldown state
   * @returns {boolean}
   */
  public getInvulnerability(): boolean {
    return this.invulnerable
  }

  public update(): void {
    let { velocity } = this.body
    const { moveUpKey, moveDownKey, moveLeftKey, moveRightKey, shootKeys, canons } = this

    if (moveUpKey.isDown) {
      this.body.velocity.y = this.accelerate(velocity.y, false)
    } else if (moveDownKey.isDown) {
      this.body.velocity.y = this.accelerate(velocity.y, true)
    } else {
      this.body.velocity.y = this.deAccelerate(velocity.y)
    }

    if (moveLeftKey.isDown) {
      this.body.velocity.x = this.accelerate(velocity.x, false)
    } else if (moveRightKey.isDown) {
      this.body.velocity.x = this.accelerate(velocity.x, true)
    } else {
      this.body.velocity.x = this.deAccelerate(velocity.x)
    }

    if (shootKeys[0].isDown || shootKeys[1].isDown) {
      canons.fire()
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

  /**
   * @override
   * Don't apply damage functionality if invulnerable set
   * @param {number} amount
   * @returns {Phaser.Sprite}
   */
  public damage(amount: number): Phaser.Sprite {
    if (this.invulnerable === true) {
      return null
    }

    // Set invulnerable for some short time
    this.invulnerable = true
    this.invulnerableTween = this.game.add.tween(this).to(
      {alpha: 0}, 75, Phaser.Easing.Linear.None, true, 0, 1000, true
    )

    this.timer.add(PLAYER_INVULNERABILITY_COOLDOWN, () => {
      this.invulnerable = false
      if (this.game && this.game.tweens) {
        this.game.tweens.remove(this.invulnerableTween)
      }
      this.alpha = 1
    }, this)

    GameManager.Instance.removeHeart()
    return super.damage(amount)
  }
}
