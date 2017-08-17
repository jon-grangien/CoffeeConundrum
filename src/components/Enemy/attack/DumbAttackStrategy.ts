import 'phaser'
import IAttackStrategy from './IAttackStrategy'

export default class DumbAttackStrategy implements IAttackStrategy {
  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1, resource)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 1000
    weapon.fireAngle = 180

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()

    if (poll < 0.08) {
      weaponStrong.fire()
    } else {
      weaponWeak.fire()
    }
  }
}
