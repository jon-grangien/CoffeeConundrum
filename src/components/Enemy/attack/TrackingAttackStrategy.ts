import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import GameManager from '../../../globals/GameManager'
import {randomInRange} from '../../../utils/gamehelpers'

export default class TrackingAttackStrategy implements IAttackStrategy {
  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.fireRate = randomInRange(900, 1200)
    weapon.fireAngle = 180

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()
    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    if (poll < 0.08) {
      if (x !== undefined && y !== undefined) {
        weaponStrong.fireAtXY(x, y)
      } else {
        weaponStrong.fire()
      }
    }

    else {
      if (x !== undefined && y !== undefined) {
        weaponWeak.fireAtXY(x, y)
      } else {
        weaponWeak.fire()
      }
    }
  }
}
