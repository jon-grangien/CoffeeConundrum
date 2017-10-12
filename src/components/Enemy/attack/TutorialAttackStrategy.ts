import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import Enemy from '../Enemy'
import { randomInRange } from '../../../utils/gamehelpers'

export default class TutorialAttackStrategy implements IAttackStrategy {
  private textWeakObj: Phaser.Text
  private textStrongObj: Phaser.Text

  setupProperties(enemy: Enemy): void {
    const { game } = enemy
    const textWeak = 'Shoot these!'
    const textStrong = 'Indestructible!'

    this.textWeakObj = new Phaser.Text(game, 0, 0, textWeak, { font: '14px Anonymous Pro', fontStyle: 'bold', fill: '#afa', align: 'center' })
    this.textStrongObj = new Phaser.Text(game, 0, 0, textStrong, { font: '14px Anonymous Pro', fontStyle: 'bold', fill: '#faa', align: 'center' })
    this.textWeakObj.anchor.setTo(0.5, 0.5)
    this.textStrongObj.anchor.setTo(0.5, 0.5)
    game.add.existing(this.textWeakObj)
    game.add.existing(this.textStrongObj)

    enemy.events.onKilled.add(() => {
      this.textWeakObj.destroy()
      this.textStrongObj.destroy()
    })
  }

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = randomInRange(800, 1300)
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

    const firstWeak: any = weaponWeak.bullets.getFirstAlive()
    const firstStrong: any = weaponStrong.bullets.getFirstAlive()
    const offset: number = 15

    if (firstWeak) {
      this.textWeakObj.position.x = firstWeak.position.x
      this.textWeakObj.position.y = firstWeak.position.y - offset
    }

    if (firstStrong) {
      this.textStrongObj.position.x = firstStrong.position.x
      this.textStrongObj.position.y = firstStrong.position.y - offset
    }
  }
}
