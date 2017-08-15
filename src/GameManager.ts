import 'phaser'

export default class GameManager {
  private static instance: GameManager
  private graveyard: Phaser.Sprite[]

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
}
