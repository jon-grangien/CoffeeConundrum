import 'phaser'
import {Images} from '../../assets'
import GameManager from '../../globals/GameManager'
import GameAdapter from '../../globals/GameAdapter'
import { PLAYER_INVULNERABILITY_COOLDOWN, PLAYER_HEALTH } from '../../globals/constants'
import CooldownCircle from './CooldownCircle'

enum Direction { Up, Down, Left, Right, UpRight, UpLeft, DownLeft, DownRight, None }

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
  private dodgeKeys: Phaser.Key[]
  private currentMovingDirection: Direction

  private gameAdapter: GameAdapter = new GameAdapter()
  private cooldownCircle: CooldownCircle

  private currentCooldownStartTimeStamp: number
  public dodgeDistance: number = 125
  public diagonalDodgeDistance: number = 0.8 * 125
  public dodgeCooldownMS: number = 3500
  public dodgeReady: boolean = true

  constructor(game: Phaser.Game) {
    super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())

    const { keyboard } = game.input
    this.moveUpKey = keyboard.addKey(Phaser.Keyboard.W)
    this.moveDownKey = keyboard.addKey(Phaser.Keyboard.S)
    this.moveLeftKey = keyboard.addKey(Phaser.Keyboard.A)
    this.moveRightKey = keyboard.addKey(Phaser.Keyboard.D)
    this.shootKeys = [keyboard.addKey(Phaser.Keyboard.SPACEBAR), keyboard.addKey(Phaser.Keyboard.J)]
    this.dodgeKeys = [keyboard.addKey(Phaser.Keyboard.ALT), keyboard.addKey(Phaser.Keyboard.K)]

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
      this.gameAdapter.gameOver(this.game)
      GameManager.Instance.buryInGraveyard(this)
    })

    this.cooldownCircle = new CooldownCircle(game, this, 25)
    //this.cooldownCircle.body.trackSprite(this, null, null, false)

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
    this.cooldownCircle.updatePos(this.body.position)
    this.cooldownCircle.setPercentage(this.getDodgeCooldownTimePercent())
    this.setDodgeDirection()

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

    if (this.dodgeKeys[0].isDown || this.dodgeKeys[1].isDown) {
      this.tryDodge()
    }

    if (shootKeys[0].isDown || shootKeys[1].isDown) {
      canons.fire()
    }

    this.currentMovingDirection = Direction.None
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

  private setDodgeDirection(): void {
    const { moveUpKey, moveDownKey, moveLeftKey, moveRightKey } = this

    if (moveUpKey.isDown) {
      if (moveLeftKey.isDown)
        this.currentMovingDirection = Direction.UpLeft
      else if (moveRightKey.isDown)
        this.currentMovingDirection = Direction.UpRight
      else
        this.currentMovingDirection = Direction.Up
    }

    if (moveDownKey.isDown) {
      if (moveLeftKey.isDown)
        this.currentMovingDirection = Direction.DownLeft
      else if (moveRightKey.isDown)
        this.currentMovingDirection = Direction.DownRight
      else
        this.currentMovingDirection = Direction.Down
    }

    if (moveLeftKey.isDown) {
      if (moveUpKey.isDown)
        this.currentMovingDirection = Direction.UpLeft
      else if (moveDownKey.isDown)
        this.currentMovingDirection = Direction.DownLeft
      else
        this.currentMovingDirection = Direction.Left
    }

    if (moveRightKey.isDown) {
      if (moveUpKey.isDown)
        this.currentMovingDirection = Direction.UpRight
      else if (moveDownKey.isDown)
        this.currentMovingDirection = Direction.DownRight
      else
        this.currentMovingDirection = Direction.Right
    }
  }

  private tryDodge(): void {
    if (!this.dodgeReady) {
      return
    }

    switch (this.currentMovingDirection) {
      case Direction.Up:
        this.body.position.y -= this.dodgeDistance
        break
      case Direction.Down:
        this.body.position.y += this.dodgeDistance
        break
      case Direction.Left:
        this.body.position.x -= this.dodgeDistance
        break
      case Direction.Right:
        this.body.position.x += this.dodgeDistance
        break
      case Direction.UpLeft:
        this.body.position.x -= this.diagonalDodgeDistance
        this.body.position.y -= this.diagonalDodgeDistance
        break
      case Direction.UpRight:
        this.body.position.x += this.diagonalDodgeDistance
        this.body.position.y -= this.diagonalDodgeDistance
        break
      case Direction.DownLeft:
        this.body.position.x -= this.diagonalDodgeDistance
        this.body.position.y += this.diagonalDodgeDistance
        break
      case Direction.DownRight:
        this.body.position.x += this.diagonalDodgeDistance
        this.body.position.y += this.diagonalDodgeDistance
        break
      case Direction.None:
      default:
        this.body.position.x += this.dodgeDistance
        break
    }

    this.resetDodgeCooldown()
    this.makeInvulnerable(300)
  }

  private resetDodgeCooldown(): void {
    this.dodgeReady = false

    this.currentCooldownStartTimeStamp = this.timer.ms
    this.timer.add(this.dodgeCooldownMS, () => {
      this.dodgeReady = true
    })
  }

  /**
   * Get percent of dodge cooldown, 100% being ready
   * @returns {number}
   */
  public getDodgeCooldownTimePercent(): number {
    if (this.dodgeReady) {
      return 100
    }

    const cooldownTimeAsc = this.timer.ms - this.currentCooldownStartTimeStamp
    return Math.round(cooldownTimeAsc / this.dodgeCooldownMS * 100)
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

    this.makeInvulnerable()
    GameManager.Instance.removeHeart()
    return super.damage(amount)
  }

  /**
   * Set invulnerable for some short time
   */
  public makeInvulnerable(cooldown?: number): void {
    this.invulnerable = true

    // Flicker feedback
    this.invulnerableTween = this.game.add.tween(this).to(
      {alpha: 0}, 75, Phaser.Easing.Linear.None, true, 0, 1000, true
    )

    // Remove invulnerability after custom time or standard time
    this.timer.add(cooldown ? cooldown : PLAYER_INVULNERABILITY_COOLDOWN, () => {
      this.invulnerable = false
      if (this.game && this.game.tweens) {
        this.game.tweens.remove(this.invulnerableTween)
      }
      this.alpha = 1
    }, this)
  }
}

