import 'phaser'
import GameManager from '../../../globals/GameManager'
import {Shaders} from '../../../assets'
import {checkOnOrOutOfBounds} from '../../../utils/gamehelpers'

export interface IBullet {
  kill(): Phaser.Bullet
  update(): void
}

export default class PlayerBehemothBullet extends Phaser.Bullet {
  private _uniforms: any

  constructor(game: Phaser.Game, x: number, y: number, key?: any, frame?: any) {
    super(game, x, y, key, frame)
    this.width = 128
    this.height = 128
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.anchor.setTo(0.5, 0.5)

    this._uniforms = {
      u_resolution: { type: '2f', value: {x: 128.0, y: 128.0}},
      u_screenSize: { type: '2f', value: { x: this.game.world.width , y: this.game.world.height }},
      u_radius: { type: '1f', value: 128.0},
      u_time: { type: '1f', value: 0.01}
    }

    const filter = new Phaser.Filter(this.game, this._uniforms, this.game.cache.getShader(Shaders.ShadersBehemothbullet.getName()))
    this.filters = [ filter ]

    //this.game.add.existing(this)
  }

  /**
   * @Override
   */
  kill(): Phaser.Bullet {
    if (checkOnOrOutOfBounds(this, this.game)) {
      super.kill()
    } else {
      return null
    }
  }

  /**
   * @Override
   */
  update(): void {
    if (this._uniforms) {
      this._uniforms.u_time.value += 0.01
    }
  }
}
