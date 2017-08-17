import 'phaser'
import IMoveStrategy from './IMoveStrategy'
import Enemy from '../Enemy'
import { randomInRange } from '../../../utils/gamehelpers'

export default class DumbMoveStrategy implements IMoveStrategy {
  private tween1: Phaser.Tween
  private tween2: Phaser.Tween
  private tween3: Phaser.Tween

  setMovement(enemy: Enemy): void {
    const game = enemy.game
    const originalPosY = enemy.body.position.y
    const originalPosX = enemy.body.position.x

    const firstSpeed = randomInRange(2000, 3000)
    const secondSpeed = randomInRange(2000, 3000)
    const thirdSpeed = randomInRange(3000, 3500)

    const firstDelay = randomInRange(50, 1000)
    const secondDelay = randomInRange(10, 600)
    const thirdDelay = randomInRange(10, 600)

    let firstX = enemy.body.position.x + randomInRange(0, 100)
    let firstY = randomInRange(5, game.height - 5)
    let secondX = enemy.body.position.x + randomInRange(0, 100)
    let secondY = randomInRange(5, game.height - 5)

    // Truncate to fit world
    firstY = firstY > game.height - 5 ? game.height - 5 : firstY
    secondY = secondY > game.height - 5 ? game.height - 5 : secondY
    firstY = firstY < 5 ? 5 : firstY
    secondY = secondY < 5 ? 5 : secondY
    firstX = firstX > game.width - 10 ? game.width - 10 : firstX
    secondX = firstX > game.width - 10 ? game.width - 10 : firstX

    this.tween1 = game.add.tween(enemy).to({
      x: firstX,
      y: firstY
    }, firstSpeed, Phaser.Easing.Linear.None, false, firstDelay)
    this.tween2 = game.add.tween(enemy)
    this.tween3 = game.add.tween(enemy)

    this.tween1.onComplete.add(() => {
      this.tween2.to({
        x: secondX,
        y: secondY,
      }, secondSpeed, Phaser.Easing.Linear.None, true, secondDelay)
    })

    this.tween2.onComplete.add(() => {
      this.tween3.to({
        x: originalPosX,
        y: originalPosY
      }, thirdSpeed, Phaser.Easing.Linear.None, true, thirdDelay)
    })

    this.tween3.onComplete.add(() => this.tween1.start())
    this.tween1.start()
  }

  public move(elapsedSeconds: number, velocity: Phaser.Point): Phaser.Point {
    velocity.y += 100 * Math.random() * Math.sin(elapsedSeconds * 1000)
    return velocity
  }
}
