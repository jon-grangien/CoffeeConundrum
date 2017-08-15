import 'phaser'
import IEnemyStrategy from './IEnemyStrategy'

/**
 * A dumb, standard enemy
 */
export default class DumbEnemyStrategy implements IEnemyStrategy {
  public setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1, resource)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 1000
    weapon.fireAngle = 180
    //weapon.trackSprite(this, 0, 0, false);

    return weapon
  }

  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    velocity.y += 100 * Math.random() * Math.sin(elapsedSeconds * 1000)
    return velocity
  }

  attack(weapon1: Phaser.Weapon, weapon2: Phaser.Weapon, timer: Phaser.Timer) {
    weapon1.fire()
  }
}
