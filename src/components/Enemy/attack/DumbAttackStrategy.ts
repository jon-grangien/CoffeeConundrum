import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import {randomInRange} from '../../../utils/gamehelpers'

export default class DumbAttackStrategy implements IAttackStrategy {
  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.fireRate = randomInRange(900, 1200)
    weapon.fireAngle = 180

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()

    if (poll < 0.05) {
      weaponStrong.fire()
    } else {
      weaponWeak.fire()
    }
  }
}
