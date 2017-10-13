import Player from './Player'
import {Shaders} from '../../assets'

export default class Zap extends Phaser.Sprite {
  private _filter: Phaser.Filter
  private _uniforms: any
  private _isInwards: boolean

  /**
   * A zap effect for player dodges
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {number} lifespan - The time for this effect to exist
   * @param {boolean} inWards - If the zap effect goes in towards center, or if not, outwards
   */
  constructor(game: Phaser.Game, player: Player, lifespan: number, inWards: boolean) {
    super(game, null, null, null)

    this.lifespan = lifespan
    this.filterArea = new PIXI.Rectangle(player.body.position.x, player.body.position.y, 48, 48)

    this._uniforms = {
      u_screenSize: { type: '2f', value: { x: game.width , y: game.height }},
      u_radius: { type: '1f', value: 48},
      u_time: { type: '1f', value: 0}
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)

    this._filter = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersZap.getName()))
    this.filters = [ this._filter ]

    this.events.onKilled.add(() => {
      this.destroy()
    })
  }

  public update(): void {
    this._uniforms.u_time.value += 0.01
  }
}
