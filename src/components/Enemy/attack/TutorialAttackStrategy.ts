import 'phaser'
import {Images} from '../../../assets'
import IAttackStrategy from './IAttackStrategy'
import Enemy from '../Enemy'

export default class TutorialAttackStrategy implements IAttackStrategy {
  private textWeakObj: Phaser.Text
  private textStrongObj: Phaser.Text

  setupProperties(enemy: Enemy): void {
    const { game } = enemy
    const textWeak = 'Shoot these!'
    const textStrong = 'Can\'t shoot these.'

    this.textWeakObj = new Phaser.Text(game, 0, 0, textWeak, { font: '14px Anonymous Pro', fill: '#afa', align: 'center' })
    this.textStrongObj = new Phaser.Text(game, 0, 0, textStrong, { font: '14px Anonymous Pro', fill: '#faa', align: 'center' })
    game.add.existing(this.textWeakObj)
    game.add.existing(this.textStrongObj)
    console.log('hello')
  }

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
    weapon.bulletSpeed = 300
    weapon.fireRate = 1000
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

    const firstWeak = weaponWeak.bullets.getFirstAlive()
    const firstStrong = weaponStrong.bullets.getFirstAlive()

    if (firstWeak) {
      this.textWeakObj.position.x = firstWeak.position.x
      this.textWeakObj.position.y = firstWeak.position.y - 5
    }

    if (firstStrong) {
      this.textStrongObj.position.x = firstStrong.position.x
      this.textStrongObj.position.y = firstStrong.position.y - 5
    }
  }
}
