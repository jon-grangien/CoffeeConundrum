import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import GameManager from '../../../globals/GameManager'

export default class TrackingAttackStrategy implements IAttackStrategy {
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
    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    if (poll < 0.08) {
      if (x && y) {
        weaponStrong.fireAtXY(x, y)
      } else {
        weaponStrong.fire()
      }
    }

    else {
      if (x && y) {
        weaponWeak.fireAtXY(x, y)
      } else {
        weaponWeak.fire()
      }
    }
  }
}
