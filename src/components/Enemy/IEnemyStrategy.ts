import 'phaser'

interface IEnemyStrategy {
  /**
   * Set up weapon properties
   * @param {Phaser.Game} game - The game instance
   * @param {Phaser.Weapon} weapon - The weapon to set up
   * @param {string} resource = The name of the sprite asset for the projectile
   */
  setupWeapon(game: Phaser.Game, weapon: Phaser.Weapon, resource: string): Phaser.Weapon

  /**
   * Move the enemy with particular movement each frame
   * @param {number} elapsedSeconds - Timer in seconds that has passed
   * @param {number} velocity - The velocity and its direction components
   * @returns {number} The changed velocity
   */
  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point

  /**
   * Fire the weapons in a certain pattern
   * @param {Phaser.Weapon} weapon1 - The first weapon
   * @param {Phaser.Weapon} weapon2 - The second weapon
   * @param {Phaser.Timer} timer - Timer to execute events on
   */
  attack(weapon1: Phaser.Weapon, weapon2: Phaser.Weapon, timer: Phaser.Timer)
}

export default IEnemyStrategy
