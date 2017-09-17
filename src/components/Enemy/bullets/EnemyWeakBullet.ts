import 'phaser'
import GameManager from '../../../globals/GameManager'
import EnemyBullet from './EnemyBullet'

export default class EnemyWeakBullet extends EnemyBullet {
  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.filters = [ GameManager.Instance.getBulletFilter('weak')]
  }
}
