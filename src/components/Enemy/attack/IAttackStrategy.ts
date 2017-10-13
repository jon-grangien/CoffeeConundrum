import 'phaser'
import Enemy from '../Enemy'

interface IAttackStrategy {

  setupProperties(enemy: Enemy): void

  /**
   * Set up weapon properties
   * @param {Phaser.Game} game - The game instance
   * @param {Phaser.Weapon} weapon - The weapon to set up
   * @param {boolean} isWeakType = If this weapon is of the weak type. If not, it is strong
   */
  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, isWeakType: boolean): Phaser.Weapon

  /**
   * Fire the weapons in a certain pattern
   * @param {Phaser.Weapon} weaponWeak - The first weapon
   * @param {Phaser.Weapon} weaponStrong - The second weapon
   * @param {Phaser.Timer} timer - Timer to execute events on
   */
  attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer)
}

export default IAttackStrategy