import 'phaser'
import Enemy from './components/Enemy/Enemy'
import Player from './components/Player'

export default class GameManager {
  private static instance: GameManager

  private graveyard: Phaser.Sprite[]
  private weakEnemyBullets: Phaser.Group
  private strongEnemyBullets: Phaser.Group
  private playerInstance: Player

  constructor() {
    this.graveyard = []
  }

  static get Instance(): GameManager {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new GameManager()
    }
    return this.instance
  }

  /**
   * Store in graveyard. Clear the graveyard in the next frame,
   * this essentially acts as a mark for delete mechanism
   * @param {Phaser.Sprite} object - A sprite, i.e. enemy or player
   */
  public buryInGraveyard(object: Phaser.Sprite): void {
    this.graveyard.push(object)
  }

  /**
   * Call destroy on buried objects and reset graveyard
   */
  public clearGraveyard(): void {
    if (this.graveyard && this.graveyard.length === 0) {
      return
    }

    for (const object of this.graveyard) {
      object.destroy()
    }

    this.graveyard = []
  }

  public addEnemyBullets(enemy: Enemy): void {

  }

  public setPlayerInstance(player: Player): void {
    this.playerInstance = player
  }

  public getPlayerInstance(): Player {
    return this.playerInstance
  }
}
