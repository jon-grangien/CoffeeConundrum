import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import {randomInRange} from '../../../utils/gamehelpers'

export default class ScatterShootAttackStrategy implements IAttackStrategy {
  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.multiFire = true
    weapon.fireRate = randomInRange(600, 1000)

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
    return null
  }
}
