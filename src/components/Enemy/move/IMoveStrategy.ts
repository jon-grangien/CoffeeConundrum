import 'phaser'

interface IMoveStrategy {

  /**
   * Set an initial position for spawned enemy
   * @returns {number}
   */
  setStartPosY(game: Phaser.Game): number

  /**
   * Move the enemy with particular movement each frame
   * @param {number} elapsedSeconds - Timer in seconds that has passed
   * @param {number} velocity - The velocity and its direction components
   * @returns {number} The changed velocity
   */
  move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point
}

export default IMoveStrategy