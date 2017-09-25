import 'phaser'
import IAttackStrategy from './IAttackStrategy'

export default class HoseAttackStrategy implements IAttackStrategy {
  private _angle: number = 250
  private _fireRate: number = 80
  private _tween: Phaser.Tween

  setupProperties(): void {}

  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon {
    weapon = game.add.weapon(-1)
    weapon.bulletKillType = Phaser.Weapon.KILL_WORLD_BOUNDS
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
