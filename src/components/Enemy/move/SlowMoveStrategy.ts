import 'phaser'
import IMoveStrategy from './IMoveStrategy'
import Enemy from '../Enemy'

export default class SlowMoveStrategy implements IMoveStrategy {
  private moveDirectionUp?: boolean

  constructor(moveDirectionUp?: boolean) {
    this.moveDirectionUp = (
      moveDirectionUp !== undefined || moveDirectionUp !== null
    ) ? moveDirectionUp : undefined
  }

  setMovement(enemy: Enemy): void {
    const game = enemy.game
    let props = {y: 0}
    if (this.moveDirectionUp !== undefined)  {
      if (this.moveDirectionUp) {
        props = {y: enemy.body.position.y - 300}
      } else {
        props = {y: enemy.body.position.y + 300}
      }
    } else {
      props = {y: enemy.body.position.y - 300}
    }

    // Truncate to fit world
    props.y = props.y > game.height - 5 ? game.height - 5 : props.y
    props.y = props.y < 5 ? 5 : props.y

    game.add.tween(enemy).to(props, 15000, Phaser.Easing.Linear.None, true, 0, -1, true)
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
