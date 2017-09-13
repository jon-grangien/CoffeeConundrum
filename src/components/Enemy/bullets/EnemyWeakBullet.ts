import 'phaser'
import {ENEMY_BULLET_HEIGHT, ENEMY_BULLET_RADIUS, ENEMY_BULLET_WIDTH} from '../../../globals/constants'
const glsl = require('glslify')
const weakFrag = require('raw-loader!glslify!../glsl/weaponweak.frag')

export default class EnemyWeakBullet extends Phaser.Bullet {
  private _shader

  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.width = ENEMY_BULLET_WIDTH
    this.height = ENEMY_BULLET_HEIGHT

    const uniforms = {
      u_resolution: { type: '2f', value: {x: ENEMY_BULLET_WIDTH, y: ENEMY_BULLET_HEIGHT} },
      u_screenSize: { type: '2f', value: { x: this.game.width , y: this.game.height }},
      u_radius: { type: '1f', value: ENEMY_BULLET_RADIUS}
    }

    this._shader = new Phaser.Filter(game, uniforms, weakFrag)
    this._shader.setResolution(ENEMY_BULLET_WIDTH, ENEMY_BULLET_HEIGHT)
    this.filters = [ this._shader ]
  }
}