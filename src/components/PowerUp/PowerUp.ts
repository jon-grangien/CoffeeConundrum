import {randomInRange} from '../../utils/gamehelpers'
import Player from '../Player/Player'
import PlayerWeaponTypes from '../../globals/WeaponTypes'
import {Shaders} from '../../assets'

export default class PowerUp extends Phaser.Sprite {
  readonly POWER_UP_DURATION: number = 5000

  private _player: Player
  private _applyWeaponType: boolean = false
  private _weaponType: PlayerWeaponTypes
  private _uniforms: any

  /**
   * PowerUp constructor
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {string} resourceName - The name of the texture string/key
   * @param {PlayerWeaponTypes} weaponType - The type of the weapon, if the PowerUp applies weaponry
   */
  constructor(game: Phaser.Game, player: Player, resourceName: string, weaponType?: PlayerWeaponTypes) {
    super(game, game.world.width, randomInRange(0, game.world.height), resourceName)
    this._player = player

    if (weaponType) {
      this._weaponType = weaponType
      this._applyWeaponType = true
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)

    this.width = 32
    this.height = 32
    this.checkWorldBounds = true
    this.outOfBoundsKill = true
    this.anchor.setTo(0.5, 0.5)

    this._uniforms = {
      u_resolution: { type: '2f', value: {x: 32.0, y: 32.0}},
      u_screenSize: { type: '2f', value: { x: this.game.world.width , y: this.game.world.height }},
      u_radius: { type: '1f', value: 32.0},
      u_time: { type: '1f', value: 0.01}
    }

    const filter = new Phaser.Filter(this.game, this._uniforms, this.game.cache.getShader(Shaders.ShadersPowerup.getName()))
    this.filters = [ filter ]

    const textObj = new Phaser.Text(this.game, this.body.position.x, this.body.position.y, 'Power Up!', { font: '14px Anonymous Pro', fontStyle: 'bold', fill: '#fff', align: 'center' })
    textObj.anchor.setTo(0.5, 0.5)

    textObj.update = () => {
      if (!this || !this.alive || !this.body) {
        textObj.destroy()
      } else {
        textObj.position.x = this.body.position.x + 15
        textObj.position.y = this.body.position.y - 10
      }
    }

    game.add.existing(this)
    game.add.existing(textObj)
  }

  /**
   * @Override
   */
  public update(): void {
    this.body.position.x -= 5

    // Player picked it up
    this.game.physics.arcade.overlap(this, this._player, (powerUp, player) => {
      this.destroy()

      if (this._applyWeaponType) {
        player.setActiveWeapon(this._weaponType, this.POWER_UP_DURATION)
      }
    })

    if (this._uniforms) {
      this._uniforms.u_time.value += 0.01
    }
  }
}
