import 'phaser'
import Player from '../components/Player/Player'
import EnemyBulletFilter from './filters/EnemyBulletFilter'
import {ENEMY_STRONG_BULLET_COLOR, ENEMY_WEAK_BULLET_COLOR} from './constants'

export default class GameManager {
  private static instance: GameManager
  private graveyard: Phaser.Sprite[]
  private playerInstance: Player
  private hearts: Phaser.Sprite[]
  private restartReady: boolean = false
  private enemyStrongBulletFilter: EnemyBulletFilter
  private enemyWeakBulletFilter: EnemyBulletFilter

  readonly RESTART_KEY_DELAY: number = 1000

  constructor() {
    this.graveyard = []
    this.hearts = []
  }

  static get Instance(): GameManager {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new GameManager()
    }
    return this.instance
  }

  /**
   * What manager needs to do when player starts level
   */
  public levelStartLogic(): void {
    this.restartReady = false
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

  public setPlayerInstance(player: Player): void {
    this.playerInstance = player
  }

  public getPlayerInstance(): Player {
    return this.playerInstance
  }

  public pushHeart(heart: Phaser.Sprite): void {
    this.hearts.push(heart)
  }

  public removeHeart(): void {
    const heart: Phaser.Sprite = this.hearts.pop()
    const tween = heart.game.add.tween(heart).to({
      alpha: 0
    }, 100, Phaser.Easing.Linear.None, true, 0, 2, true)
    tween.onComplete.add(() => heart.alpha = 0)
  }

  public initBulletFilters(game: Phaser.Game) {
    this.enemyWeakBulletFilter = new EnemyBulletFilter(game, ENEMY_WEAK_BULLET_COLOR)
    this.enemyStrongBulletFilter = new EnemyBulletFilter(game, ENEMY_STRONG_BULLET_COLOR)
  }

  public getBulletFilter(type: string): Phaser.Filter {
    if (type === 'weak') {
      return this.enemyWeakBulletFilter.getFilter()
    } else {
      return this.enemyStrongBulletFilter.getFilter()
    }
  }

  public updateFiltersTime(time: number) {
    this.enemyStrongBulletFilter.updateTime(time)
    this.enemyWeakBulletFilter.updateTime(time)
  }

  public setRestartReady(readiness: boolean): void {
    this.restartReady = readiness
  }

  public getRestartKeyReady(): boolean {
    return this.restartReady
  }
}
