import Player from './Player'
import {Shaders} from '../../assets'

export default class CooldownCircle extends Phaser.Sprite {
  private _posOffset: number
  private _filter: Phaser.Filter
  private _uniforms: any
  private _percent: number

  constructor(game: Phaser.Game, player: Player, posOffset: number) {
    super(game, player.body.position.x - posOffset, player.body.position.y + posOffset, null)

    this._posOffset = posOffset

    this._uniforms = {
      u_angle: { type: '1f', value: (360 / 100) * this._percent },
      u_resolution: { type: '2f', value: {x: 32, y: 32}},
      u_screenSize: { type: '2f', value: { x: game.width , y: game.height }},
      u_radius: { type: '1f', value: 16}
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)
    //this.body.immovable = true

    this._filter = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersCooldowncircle.getName()))
    this.filters = [ this._filter ]

    game.add.existing(this)
  }

  public updatePos(playerPos: any) {
    this.body.position.x = playerPos.x - this._posOffset
    this.body.position.y = playerPos.y + this._posOffset
  }
}