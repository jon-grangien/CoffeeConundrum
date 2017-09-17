import 'phaser'
import {ENEMY_BULLET_HEIGHT, ENEMY_BULLET_RADIUS, ENEMY_BULLET_WIDTH} from '../../../globals/constants'
import {Shaders} from '../../../assets'
import {checkOnOrOutOfBounds} from '../../../utils/gamehelpers'
import GameManager from '../../../globals/GameManager'

export default class EnemyWeakBullet extends Phaser.Bullet {
  private _shader
  private _uniforms

  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.width = ENEMY_BULLET_WIDTH
    this.height = ENEMY_BULLET_HEIGHT
    this.checkWorldBounds = false
    this.outOfBoundsKill = false

    this._uniforms = {
      u_color: { type: '3f', value: {x: 0.8, y: 0.5, z: 0.3} },
      u_resolution: { type: '2f', value: {x: ENEMY_BULLET_WIDTH, y: ENEMY_BULLET_HEIGHT} },
      u_screenSize: { type: '2f', value: { x: this.game.width , y: this.game.height }},
      u_radius: { type: '1f', value: ENEMY_BULLET_RADIUS},
      u_time: { type: '1f', value: game.time.totalElapsedSeconds() * 1000 }
    }

    this._shader = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersEnemyBullet.getName()))
    this._shader.setResolution(ENEMY_BULLET_WIDTH, ENEMY_BULLET_HEIGHT)
    //this.shader = this._shader
    this.filters = [ GameManager.Instance.getBulletFilter('weak')]
  }

  public update(): void {
    this._uniforms.u_time.value = this.game.time.totalElapsedSeconds() * 1000

    // Manual bullet destroy on bounds hit
    if (checkOnOrOutOfBounds(this.body, this.game)) {
      this.destroy()
    }
  }
}