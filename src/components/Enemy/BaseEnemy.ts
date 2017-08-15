import 'phaser'
import {Images} from '../../assets'
import IEnemyStrategy from './IEnemyStrategy'

export default class Enemy extends Phaser.Sprite {
  private weaponWeak: Phaser.Weapon
  private weaponStrong: Phaser.Weapon
  private timer: Phaser.Timer
  private strategy: IEnemyStrategy

  constructor(game: Phaser.Game, strategy: IEnemyStrategy) {
    super(game, game.world.centerX + 200, game.world.centerY, Images.SpritesheetsSmilingShip.getName())
    this.strategy = strategy
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)

    this.timer = game.time.create(false)

    this.weaponWeak = this.strategy.setupWeapon(this.game, this.weaponWeak, 'enemybulletweak')
    this.weaponStrong = this.strategy.setupWeapon(this.game, this.weaponStrong, 'enemybulletstrong')
    this.weaponWeak.trackSprite(this, 0, 0, false);
    this.weaponStrong.trackSprite(this, 0, 0, false);

    game.add.existing(this)
  }

  public create(): void {
    this.timer.start(0)
  }

  public update(): void {
    this.strategy.attack(this.weaponWeak, this.weaponStrong, this.timer)
    this.body.velocity = this.strategy.move(this.game.time.totalElapsedSeconds(), this.body.velocity)
  }
}

