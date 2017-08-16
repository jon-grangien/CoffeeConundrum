import 'phaser'
import DumbEnemyStrategy from './DumbEnemyStrategy'
import GameManager from '../../globals/GameManager'
import Enemy from './Enemy'
import { DUMB_ENEMY_HEALTH } from '../../globals/constants'

/**
 * A dumb, standard enemy that shoots towards the player
 */
export default class DumbSprayingEnemyStrategy extends DumbEnemyStrategy {
  private sprayTimerStrong: boolean
  private moveDirectionUp?: boolean
  private pauseShooting: boolean

  constructor(moveDirectionUp?: boolean) {
    super()

    this.pauseShooting = false

    this.moveDirectionUp = (
      moveDirectionUp !== undefined || moveDirectionUp !== null
    ) ? moveDirectionUp : undefined
  }

  /**
   * @override
   * @param {Enemy} enemy
   */
  public customSetup(enemy: Enemy): void {
    enemy.health = DUMB_ENEMY_HEALTH
    this.sprayTimerStrong = true

    enemy.getTimer().loop(4000, () => {
      this.sprayTimerStrong = !this.sprayTimerStrong
    })

    enemy.getTimer().loop(4000, () => {
      this.pauseShooting = true

      enemy.getTimer().add(1000, () => {
        this.pauseShooting = false
      })
    })
  }

  /**
   * @override
   * @param {Phaser.Game} game
   * @param {Phaser.Weapon} weapon
   * @param {string} resource
   * @returns {Phaser.Weapon}
   */
  public setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1, resource)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 100
    weapon.fireAngle = 180

    return weapon
  }

  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    const step = 0.5

    if (this.moveDirectionUp !== undefined)  {
      if (this.moveDirectionUp) {
        velocity.y += step
      } else {
        velocity.y -= step
      }
    }

    else {
      velocity.y += step
    }

    return velocity
  }

  /**
   * @override
   * @param {Phaser.Weapon} weaponWeak
   * @param {Phaser.Weapon} weaponStrong
   * @param {Phaser.Timer} timer
   */
  public attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer) {
    if (this.pauseShooting) {
      return
    }

    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    const weapon: Phaser.Weapon = this.sprayTimerStrong ? weaponStrong : weaponWeak

    if (x && y) {
      weapon.fireAtXY(x, y)
    } else {
      weapon.fire()
    }
  }
}
