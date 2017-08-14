import 'phaser'
import {Images} from '../assets'

export default class Enemy extends Phaser.Sprite {
  private weaponWeak: Phaser.Weapon
  private weaponStrong: Phaser.Weapon
  private timer: Phaser.Timer

  constructor(game: Phaser.Game) {
    super(game, game.world.centerX + 200, game.world.centerY, Images.SpritesheetsSmilingShip.getName())
    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)

    this.timer = game.time.create(false)

    this.weaponWeak = game.add.weapon(-1, 'enemybulletweak')
    this.weaponWeak.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    this.weaponWeak.bulletSpeed = 300
    this.weaponWeak.fireRate = 500
    this.weaponWeak.fireAngle = 180
    this.weaponWeak.trackSprite(this, 0, 0, false);

    this.setupWeapon(this.weaponWeak, 'enemybulletweak')
    this.setupWeapon(this.weaponStrong, 'enemybulletstrong')

    game.add.existing(this)
  }

  private setupWeapon(weapon: Phaser.Weapon, resource: string): void {
    weapon = this.game.add.weapon(-1, resource)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 1000
    weapon.fireAngle = 180
    weapon.trackSprite(this, 0, 0, false);
  }

  public create(): void {
    this.timer.start(0)
  }

  public update(): void {
    this.weaponWeak.fire()
    this.body.velocity.y += 10 * Math.sin(this.game.time.totalElapsedSeconds() * 1000)
  }
}

