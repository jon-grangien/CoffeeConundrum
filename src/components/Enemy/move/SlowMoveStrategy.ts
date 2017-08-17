import 'phaser'
import IMoveStrategy from './IMoveStrategy'

export default class SlowMoveStrategy implements IMoveStrategy {
  private moveDirectionUp?: boolean

  constructor(moveDirectionUp?: boolean) {
    this.moveDirectionUp = (
      moveDirectionUp !== undefined || moveDirectionUp !== null
    ) ? moveDirectionUp : undefined
  }

  public setStartPosY(game: Phaser.Game): number {
    return game.world.centerY
  }

  public move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    const step = 0.5

    if (this.moveDirectionUp !== undefined)  {
      if (this.moveDirectionUp) {
        velocity.y += step
      } else {
        velocity.y -= step
      }
    }

    else {
      velocity.y += step
    }

    return velocity
  }
}
