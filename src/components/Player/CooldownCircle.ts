import Player from './Player'
import {Shaders} from '../../assets'

export default class CooldownCircle extends Phaser.Sprite {
  private _posOffset: number
  private _filter: Phaser.Filter
  private _uniforms: any
  private _percent: number

  constructor(game: Phaser.Game, player: Player, posOffset: number) {
    super(game, null, null, null)

    this._posOffset = posOffset
    this.filterArea = new PIXI.Rectangle(0, 0, 16, 16)

    this._uniforms = {
      u_angle: { type: '1f', value: Math.floor((360 / 100) * this._percent) },
      u_resolution: { type: '2f', value: {x: 16, y: 16}},
      u_screenSize: { type: '2f', value: { x: game.world.width , y: game.world.height }},
      u_radius: { type: '1f', value: 16}
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)
    this.angle += 90

    this._filter = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersCooldowncircle.getName()))
    this.filters = [ this._filter ]

    game.add.existing(this)
  }

  public setPercentage(p: number): void {
    this._percent = p
    this._uniforms.u_angle.value = Math.floor((360 / 100) * p)
  }

  public updatePos(playerPos: any) {
    this.filterArea.x = playerPos.x - this._posOffset
    this.filterArea.y = playerPos.y + this._posOffset
  }
}