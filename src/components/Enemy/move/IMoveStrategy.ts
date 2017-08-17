import 'phaser'
import Enemy from '../Enemy'

interface IMoveStrategy {

  /**
   * Set an initial position for spawned enemy
   * @returns {number}
   */
  setStartPosY(game: Phaser.Game): number

  /**
   *
   * @param {Enemy} enemy
   * @param {Phaser.Game} game
   */
  setMovement(enemy: Enemy, game: Phaser.Game): void

  /**
   * Move the enemy with particular movement each frame
   * @param {number} elapsedSeconds - Timer in seconds that has passed
   * @param {number} velocity - The velocity and its direction components
   * @returns {number} The changed velocity
   */
  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point
}

export default IMoveStrategy