import {Images} from '../assets'
import {randomInRange} from '../utils/gamehelpers'
import Player from './Player/Player'
import PlayerWeaponTypes from '../globals/WeaponTypes'

export default class PowerUp extends Phaser.Sprite {
  readonly POWERUP_DURATION: number = 5000

  private player: Player
  private applyWeaponType: boolean = false
  private weaponType: PlayerWeaponTypes

  constructor(game: Phaser.Game, player: Player, weaponType?: PlayerWeaponTypes) {
    super(game, game.world.width, randomInRange(0, game.world.height), Images.SpritesheetsScattererPowerup.getName())
    this.player = player

    if (weaponType) {
      this.weaponType = weaponType
      this.applyWeaponType = true
    }

    game.physics.enable(this, Phaser.Physics.ARCADE)
    this.body.collideWorldBounds = false
    this.anchor.setTo(0.5, 0.5)

    game.add.existing(this)
  }

  public update(): void {
    this.body.position.x -= 10

    // Player picked it up
    this.game.physics.arcade.overlap(this, this.player, (powerUp, player) => {
      this.destroy()

      if (this.applyWeaponType) {
        player.setActiveWeapon(this.weaponType, this.POWERUP_DURATION)
      }
    })
  }
}
