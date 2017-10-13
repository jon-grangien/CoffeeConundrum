import {Shaders} from '../../assets'

export default class Zap extends Phaser.Sprite {
  private _uniforms: any

  /**
   * A self-destructing zap effect
   * @param {Phaser.Game} game
   * @param {Phaser.Sprite} parent - The sprite by which this effect is placed
   * @param {number} radius - The circular radius of the effect
   * @param {number[]} firstColor - One of the colors for the effect
   * @param {number[]} secondColor - One of the colors for the effect
   */
  constructor(game: Phaser.Game, parent: Phaser.Sprite, radius: number, firstColor: number[], secondColor: number[]) {
    super(game, null, null, null)

    this.lifespan = 800
    this.filterArea = new PIXI.Rectangle(parent.body.position.x, parent.body.position.y, radius, radius)

    this._uniforms = {
      u_screenSize: { type: '2f', value: { x: game.width , y: game.height }},
      u_radius: { type: '1f', value: radius},
      u_time: { type: '1f', value: 0},
      u_color_one: { type: '3f', value: { x: firstColor[0] , y: firstColor[1], z: firstColor[2] }},
      u_color_two: { type: '3f', value: { x: secondColor[0] , y: secondColor[1], z: secondColor[2] }}
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)

    const filter = new Phaser.Filter(game, this._uniforms, game.cache.getShader(Shaders.ShadersZap.getName()))
    this.filters = [ filter ]

    this.events.onKilled.add(() => {
      this.destroy()
    })
  }

  public update(): void {
    this._uniforms.u_time.value += 0.01
    // console.log( this._uniforms.u_time.value ) find out max time
  }
}
