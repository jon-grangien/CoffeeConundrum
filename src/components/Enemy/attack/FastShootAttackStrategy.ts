import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import GameManager from '../../../globals/GameManager'
import { randomInRange } from '../../../utils/gamehelpers'
import Enemy from '../Enemy'

export default class FastShootAttackStrategy implements IAttackStrategy {
  private allowedToShoot: boolean = false

  setupProperties(enemy: Enemy): void {
    enemy.events.onAddedToGroup.add(() => {

      // Delay first shot
      enemy.getTimer().add(randomInRange(100, 700), () => {
        this.allowedToShoot = true
      })
    })
  }

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 725
    weapon.fireRate = randomInRange(850, 1100)
    weapon.fireAngle = 180

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()
    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    if (x !== undefined && y !== undefined) {
      if (poll < 0.3) {
        weaponStrong.fireAtXY(x, y)
      } else {
        weaponWeak.fireAtXY(x, y)
      }
    } else {
      if (poll < 0.3) {
        weaponStrong.fire()
      } else {
        weaponWeak.fire()
      }
    }
  }
}
