import 'phaser'
import {ENEMY_BULLET_HEIGHT, ENEMY_BULLET_WIDTH} from '../../../globals/constants'
import {checkOnOrOutOfBounds} from '../../../utils/gamehelpers'

export default class EnemyBullet extends Phaser.Bullet {
  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.width = ENEMY_BULLET_WIDTH
    this.height = ENEMY_BULLET_HEIGHT
    this.checkWorldBounds = false
    this.outOfBoundsKill = false
    this.anchor.setTo(0.5, 0.5)
  }

  public update(): void {

    // Manual bullet destroy on bounds hit
    if (checkOnOrOutOfBounds(this.body, this.game)) {
      this.destroy()
    }
  }
}
