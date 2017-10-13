import 'phaser'
import IAttackStrategy from './IAttackStrategy'

export default class HoseAttackStrategy implements IAttackStrategy {
  private _angle: number = 250
  private _fireRate: number = 130
  private _tween: Phaser.Tween

  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon {
    weapon.bulletSpeed = 300
    weapon.multiFire = true
    weapon.fireRate = this._fireRate
    weapon.fireAngle = this._angle

    // Vary angle tween loop
    this._tween = game.add.tween(weapon).to( {
      fireAngle: 130
    }, 1200, Phaser.Easing.Linear.None, true, 0, -1, true)

    return weapon
  }

  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer): void {
    weaponStrong.fire()
  }
}
