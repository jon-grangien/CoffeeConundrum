import 'phaser'
import Enemy from '../Enemy'

interface IMoveStrategy {

  /**
   *
   * @param {Enemy} enemy
   */
  setMovement(enemy: Enemy): void

  /**
   * Move the enemy with particular movement each frame
   * @param {number} elapsedSeconds - Timer in seconds that has passed
   * @param {number} velocity - The velocity and its direction components
   * @returns {number} The changed velocity
   */
  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point
}

export default IMoveStrategy