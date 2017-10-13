import 'phaser'
import GameManager from '../../../globals/GameManager'
import EnemyBullet from './EnemyBullet'
import Zap from '../../Player/Zap'

export default class EnemyStrongBullet extends EnemyBullet {
  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.filters = [ GameManager.Instance.getBulletFilter('strong')]
  }
}