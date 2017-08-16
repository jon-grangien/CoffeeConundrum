import 'phaser'
import {Images} from '../../assets'
import IEnemyStrategy from './IEnemyStrategy'
import GameManager from '../../GameManager'

export default class Enemy extends Phaser.Sprite {
  public health: number

  private weaponWeak: Phaser.Weapon
  private weaponStrong: Phaser.Weapon
  private timer: Phaser.Timer
  private strategy: IEnemyStrategy

  constructor(game: Phaser.Game, strategy: IEnemyStrategy) {
    super(game, game.world.centerX + 200, game.world.centerY, Images.SpritesheetsSmilingship.getName())
    this.strategy = strategy
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)

    this.health = this.strategy.setHealth()
    this.timer = game.time.create(false)

    this.weaponWeak = this.strategy.setupWeapon(this.game, this.weaponWeak, Images.SpritesheetsEnemybulletweak.getName())
    this.weaponStrong = this.strategy.setupWeapon(this.game, this.weaponStrong, Images.SpritesheetsEnemybulletstrong.getName())
    this.weaponWeak.trackSprite(this, 0, 0, false);
    this.weaponStrong.trackSprite(this, 0, 0, false);

    this.events.onKilled.add(() => {
      GameManager.Instance.buryInGraveyard(this)
    })
  }

  public create(): void {
    this.timer.start(0)
    console.log(this.game.world.getLocalBounds())
  }

  public update(): void {
    this.strategy.attack(this.weaponWeak, this.weaponStrong, this.timer)
    this.body.velocity = this.strategy.move(this.game.time.totalElapsedSeconds(), this.body.velocity)
  }

  /**
   * Spawn object into game
   * Not needed to call if object added to a group
   */
  public spawn(): void {
    this.game.add.existing(this)
  }

  /**
   * Expose weak bullets group
   * @returns {Phaser.Group}
   */
  public getWeakBullets(): Phaser.Group {
    return this.weaponWeak.bullets
  }

  /**
   * Expose strong bullets group
   * @returns {Phaser.Group}
   */
  public getStrongBullets(): Phaser.Group {
    return this.weaponStrong.bullets
  }
}
