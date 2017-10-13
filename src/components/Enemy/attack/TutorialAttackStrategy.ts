import 'phaser'
import IAttackStrategy from './IAttackStrategy'
import Enemy from '../Enemy'
import {checkOnOrOutOfBounds, randomInRange, uuid} from '../../../utils/gamehelpers'

export default class TutorialAttackStrategy implements IAttackStrategy {
  private textWeakObj: Phaser.Text
  private textStrongObj: Phaser.Text
  private enemy: Enemy
  private game: Phaser.Game
  private bulletTextMap: Map<string, [Phaser.Text, Phaser.Bullet]>

  setupProperties(enemy: Enemy): void {
    const { game } = enemy
    this.enemy = enemy
    this.game = game
    this.bulletTextMap = new Map<string, [Phaser.Text, Phaser.Bullet]>()

    const textWeak = 'Shoot these!'
    const textStrong = 'Indestructible!'

    //this.textWeakObj = new Phaser.Text(game, 0, 0, textWeak, { font: '14px Anonymous Pro', fontStyle: 'bold', fill: '#afa', align: 'center' })
    //this.textStrongObj = new Phaser.Text(game, 0, 0, textStrong, { font: '14px Anonymous Pro', fontStyle: 'bold', fill: '#faa', align: 'center' })
    //this.textWeakObj.anchor.setTo(0.5, 0.5)
    //this.textStrongObj.anchor.setTo(0.5, 0.5)
    //game.add.existing(this.textWeakObj)
    //game.add.existing(this.textStrongObj)
  }

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.fireRate = randomInRange(500, 800)
    weapon.fireAngle = isWeakType ? 175 : 185

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    const poll = Math.random()

    if (poll < 0.05) {
      weaponStrong.fire()
    } else {
      weaponWeak.fire()
    }

    const weakBullets: Phaser.Group = weaponWeak.bullets
    const strongBullets: Phaser.Group = weaponStrong.bullets
    const bulletTypes: Phaser.Group[] = [weakBullets, strongBullets]

    bulletTypes.map((bulletType, i) => {
      bulletType.forEach(bullet => {
        if (bullet.name === '' || (bullet.name !== '' && this.bulletTextMap.get(bullet.name)[0] === undefined)) {
          bullet.name = uuid()
          const text = i % 2 === 0 ? 'Shoot these!' : 'Indesctructible!'
          const color = i % 2 === 0 ? '#ffd589' : '#cd72ff'
          const textObj = new Phaser.Text(this.game, bullet.position.x, bullet.position.y, text, { font: '14px Anonymous Pro', fontStyle: 'bold', fill: color, align: 'center' })
          textObj.data = bullet.name
          textObj.anchor.setTo(0.5, 0.5)

          textObj.update = () => {
            const actualBullet = this.bulletTextMap.get(textObj.data)[1]
            if (!this.enemy || !this.enemy.alive || !actualBullet.alive || checkOnOrOutOfBounds(textObj, this.game) || textObj.position.y < 1) {
              textObj.destroy()
            }
          }
          this.game.add.existing(textObj)
          this.bulletTextMap.set(bullet.name, [textObj, bullet])

        // Alive, has child
        } else if (bullet.alive && bullet.exists && bullet.name !== '' && this.bulletTextMap.get(bullet.name) !== undefined) {
          this.bulletTextMap.get(bullet.name)[0].position.x = bullet.position.x
          this.bulletTextMap.get(bullet.name)[0].position.y = bullet.position.y - 15
        }
      }, this)
    })
  }
}
