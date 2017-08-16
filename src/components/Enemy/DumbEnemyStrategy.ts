import 'phaser'
import IEnemyStrategy from './IEnemyStrategy'
import Enemy from './Enemy'
import { DUMB_ENEMY_HEALTH } from '../../globals/constants'

/**
 * A dumb, standard enemy
 */
export default class DumbEnemyStrategy implements IEnemyStrategy {
  public customSetup(enemy: Enemy): void {
    enemy.health = DUMB_ENEMY_HEALTH
  }

  public setStartPosY(game: Phaser.Game): number {
    // Return random height between max height - 5 and lowest height (0) + 5
    return Math.floor(Math.random() * game.height - 5) + 5
  }

  public setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1, resource)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 1000
    weapon.fireAngle = 180

    return weapon
  }

  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    velocity.y += 100 * Math.random() * Math.sin(elapsedSeconds * 1000)
    return velocity
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer) {
    const poll = Math.random()

    if (poll < 0.08) {
      weaponStrong.fire()
    } else {
      weaponWeak.fire()
    }
  }
}
