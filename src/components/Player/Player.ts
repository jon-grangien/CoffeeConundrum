import 'phaser'
import {Images} from '../../assets'
import GameManager from '../../globals/GameManager'
import GameAdapter from '../../globals/GameAdapter'
import { PLAYER_INVULNERABILITY_COOLDOWN, PLAYER_HEALTH } from '../../globals/constants'
import CooldownCircle from './CooldownCircle'
import Zap from './Zap'
import PlayerWeaponTypes from '../../globals/WeaponTypes'

enum Direction { Up, Down, Left, Right, UpRight, UpLeft, DownLeft, DownRight, None }

export default class Player extends Phaser.Sprite {
  readonly TOP_SPEED: number = 500

  private regularWeapon: Phaser.Weapon
  private scatterer: Phaser.Weapon
  private scatterAngles: number[] = [15, 7.5, 0, 352.5, 345]
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
  private activeWeapon: PlayerWeaponTypes

  private gameAdapter: GameAdapter = new GameAdapter()
  private cooldownCircle: CooldownCircle

  private currentCooldownStartTimeStamp: number
  public dodgeDistance: number = 125
  public diagonalDodgeDistance: number 
  public dodgeCooldownMS: number = 2800
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
    this.activeWeapon = PlayerWeaponTypes.RegularWeapon

    this.diagonalDodgeDistance = this.dodgeDistance * Math.sin(Math.PI / 4)
    this.health = PLAYER_HEALTH
    this.timer = game.time.create(false)

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)

    this.regularWeapon = game.add.weapon(-1, Images.SpritesheetsCanonbullet2.getName())
    this.regularWeapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    this.regularWeapon.bulletSpeed = 1500
    this.regularWeapon.fireRate = 40
    this.regularWeapon.fireAngle = 0
    this.regularWeapon.trackSprite(this, 0, 0, false)

    this.scatterer = game.add.weapon(-1, Images.SpritesheetsCanonbullet2Single.getName())
    this.scatterer.multiFire = true
    this.scatterer.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    this.scatterer.bulletSpeed = 1500
    this.scatterer.fireRate = 120
    this.scatterer.fireAngle = 0
    this.scatterer.trackSprite(this, 0, 0, false)

    this.events.onKilled.add(() => {
      this.gameAdapter.gameOver(this.game)
      GameManager.Instance.buryInGraveyard(this)
      GameManager.Instance.buryInGraveyard(this.cooldownCircle)
      this.timer.add(GameManager.Instance.RESTART_KEY_DELAY, () => {
        GameManager.Instance.setRestartReady(true)
      })
    })

    this.cooldownCircle = new CooldownCircle(game, this, 25)

    this.timer.start(0)
    game.add.existing(this)
  }

  /**
   * Return the weapon bullets group
   * @returns {Phaser.Group}
   */
  public getBullets(): Phaser.Group {
    return this.getActualActiveWeapon().bullets
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
    const { moveUpKey, moveDownKey, moveLeftKey, moveRightKey, shootKeys, regularWeapon } = this

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
      this.handleFire()
    }

    this.currentMovingDirection = Direction.None
  }

  private handleFire(): void {
    switch (this.activeWeapon) {
      case PlayerWeaponTypes.RegularWeapon:
        this.regularWeapon.fire()
        break
      case PlayerWeaponTypes.Scatterer:
        for (const angle of this.scatterAngles) {
          this.scatterer.fireAngle = angle
          this.scatterer.fire()
        }
        break
      default:
        this.regularWeapon.fire()
    }
  }

  /**
   * Accelerate speed up until top speed, or return the top speed
   * @param {number} velocity
   * @param {boolean} positiveDir - If the direction of the velocity is positive or negative
   * @returns {number} The new velocity
   */
  private accelerate(velocity: number, positiveDir: boolean): number {
    const step = 100

    if (this.TOP_SPEED % step !== 0) {
      console.error('Player speed is not a multiple of move step')
    }

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

    const zapIn = new Zap(this.game, this, 48, [0.0, 0.0, 0.0], [0.6, 0.0, 0.0])
    this.game.add.existing(zapIn)

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

    const zapOut = new Zap(this.game, this, 48, [0.0, 0.0, 0.0], [0.6, 0.0, 0.0])
    this.game.add.existing(zapOut)

    if (!this.invulnerable) {
      this.makeInvulnerable(200)
    }
  }

  private resetDodgeCooldown(): void {
    this.dodgeReady = false

    this.currentCooldownStartTimeStamp = this.timer.ms
    this.timer.add(this.dodgeCooldownMS, () => {
      this.dodgeReady = true
    })
  }

  public setActiveWeapon(type: PlayerWeaponTypes, duration: number) {
    this.activeWeapon = type
    console.log(duration)

    const timer = this.game.time.create(true)
    timer.start()
    timer.add(duration, () => {
      console.log('hello?')
      this.activeWeapon = PlayerWeaponTypes.RegularWeapon
    })
  }

  public getActualActiveWeapon(): Phaser.Weapon {
    switch (this.activeWeapon) {
      case PlayerWeaponTypes.RegularWeapon:
        return this.regularWeapon
      case PlayerWeaponTypes.Scatterer:
        return this.scatterer
      default:
        return this.regularWeapon
    }
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

