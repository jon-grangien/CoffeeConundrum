import 'phaser'
import {Images} from '../../assets'
import IMoveStrategy from './move/IMoveStrategy'
import IAttackStrategy from './attack/IAttackStrategy'
import GameManager from '../../globals/GameManager'
import { DUMB_ENEMY_HEALTH } from '../../globals/constants'
import EnemyWeakBullet from './bullets/EnemyWeakBullet'
import EnemyStrongBullet from './bullets/EnemyStrongBullet'

const glsl = require('glslify')
const weakWeapFrag = require('raw-loader!glslify!./glsl/weaponweak.frag')

export default class Enemy extends Phaser.Sprite {
  public health: number

  private weaponWeak: Phaser.Weapon
  private weaponStrong: Phaser.Weapon
  private timer: Phaser.Timer
  private moveStrategy: IMoveStrategy
  private attackStrategy: IAttackStrategy

  private buryAfterDeadBullets: boolean = false

  constructor(game: Phaser.Game, yPos: number, moveStrategy: IMoveStrategy, attackStrategy: IAttackStrategy) {
    super(game, game.width - 150, yPos, Images.SpritesheetsSmilingship.getName())
    this.moveStrategy = moveStrategy
    this.attackStrategy = attackStrategy

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = true
    this.anchor.setTo(0.5, 0.5)
    this.health = DUMB_ENEMY_HEALTH

    this.timer = game.time.create(false)

    this.weaponWeak = this.attackStrategy.setupWeapon(this.game, this.weaponWeak, Images.SpritesheetsEnemybulletweak.getName())
    this.weaponWeak.trackSprite(this, 0, 0, false)
    this.weaponWeak.bulletClass = EnemyWeakBullet

    this.weaponStrong = this.attackStrategy.setupWeapon(this.game, this.weaponStrong, Images.SpritesheetsEnemybulletstrong.getName())
    this.weaponStrong.trackSprite(this, 0, 0, false)
    this.weaponStrong.bulletClass = EnemyStrongBullet

    this.events.onKilled.add(() => {
      this.buryAfterDeadBullets = true
    })

    this.moveStrategy.setMovement(this)
    this.attackStrategy.setupProperties(this)

    this.timer.start(0)
  }

  public update(): void {
    if (this.buryAfterDeadBullets) {
      if (this.weaponWeak.bullets.countLiving() === 0 && this.weaponStrong.bullets.countLiving() === 0) {
        GameManager.Instance.buryInGraveyard(this) // mark for destroy
      }
    }

    if (this.alive) {
      this.attackStrategy.attack(this.weaponWeak, this.weaponStrong, this.timer)
    }
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

  public getTimer(): Phaser.Timer {
    return this.timer
  }
}
