import {Shaders} from '../../assets'
import {ENEMY_BULLET_HEIGHT, ENEMY_BULLET_RADIUS, ENEMY_BULLET_WIDTH} from '../constants'

export interface IColor {
  x: number
  y: number
  z: number
}

export default class EnemyBulletFilter {
  private _filter: Phaser.Filter
  private _uniforms: any

  constructor(game: Phaser.Game, color: IColor ) {

    this._uniforms = {
      u_time: { type: '1f', value: game.time.totalElapsedSeconds() * 1000 },
      u_color: { type: '3f', value: color },
      u_resolution: { type: '2f', value: {x: ENEMY_BULLET_WIDTH, y: ENEMY_BULLET_HEIGHT} },
      u_screenSize: { type: '2f', value: { x: game.width , y: game.height }},
      u_radius: { type: '1f', value: ENEMY_BULLET_RADIUS}
    }

    this._filter = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersEnemyBullet.getName()))
    this._filter.setResolution(ENEMY_BULLET_WIDTH, ENEMY_BULLET_HEIGHT)
  }

  public getFilter(): Phaser.Filter {
    return this._filter
  }

  public updateTime(time: number) {
    this._uniforms.u_time.value = time
  }
}

