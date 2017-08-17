import 'phaser'
import IMoveStrategy from './IMoveStrategy'

export default class DumbMoveStrategy implements IMoveStrategy {
  public setStartPosY(game: Phaser.Game): number {
    // Return random height between max height - 5 and lowest height (0) + 5
    return Math.floor(Math.random() * game.height - 5) + 5
  }

  public move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    velocity.y += 100 * Math.random() * Math.sin(elapsedSeconds * 1000)
    return velocity
  }
}
