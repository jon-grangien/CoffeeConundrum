import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import Enemy from '../Enemy'
import GameManager from '../../../globals/GameManager'

export default class SprayingAttackStrategy implements IAttackStrategy {
  private sprayTimerStrong: boolean
  private pauseShooting: boolean = false

  setupProperties(enemy: Enemy): void {
    enemy.events.onAddedToGroup.add(() => {
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
    })
  }

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.fireRate = 250
    weapon.fireAngle = 180

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    if (this.pauseShooting) {
      return
    }

    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    const weapon: Phaser.Weapon = this.sprayTimerStrong ? weaponStrong : weaponWeak

    if (x !== undefined && y !== undefined) {
      weapon.fireAtXY(x, y)
    } else {
      weapon.fire()
    }
  }
}
