import 'phaser'
import {ENEMY_BULLET_HEIGHT, ENEMY_BULLET_WIDTH} from '../../../globals/constants'
import {checkOnOrOutOfBounds} from '../../../utils/gamehelpers'
import GameManager from '../../../globals/GameManager'

export default class EnemyWeakBullet extends Phaser.Bullet {
  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.width = ENEMY_BULLET_WIDTH
    this.height = ENEMY_BULLET_HEIGHT
    this.checkWorldBounds = false
    this.outOfBoundsKill = false
    this.filters = [ GameManager.Instance.getBulletFilter('weak')]
  }

  public update(): void {

    // Manual bullet destroy on bounds hit
    if (checkOnOrOutOfBounds(this.body, this.game)) {
      this.destroy()
    }
  }
}