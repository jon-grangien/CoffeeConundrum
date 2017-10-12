import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import {randomInRange} from '../../../utils/gamehelpers'

export default class ScatterShootAttackStrategy implements IAttackStrategy {
  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.multiFire = true
    weapon.fireRate = randomInRange(900, 1200)

    return weapon
  }

  shoot = (weapon: Phaser.Weapon): void => {
    for (let i = 240; i >= 120; i -= 20) {
      weapon.fireAngle = i
      weapon.fire()
    }
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()

    if (poll < 0.005) {
      this.shoot(weaponStrong)
    } else {
      this.shoot(weaponWeak)
    }
  }
}
