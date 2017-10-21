import {randomInRange} from '../../utils/gamehelpers'
import Player from '../Player/Player'
import PlayerWeaponTypes from '../../globals/WeaponTypes'

export default class PowerUp extends Phaser.Sprite {
  readonly POWER_UP_DURATION: number = 5000

  private player: Player
  private applyWeaponType: boolean = false
  private weaponType: PlayerWeaponTypes

  /**
   * PowerUp constructor
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {string} resourceName - The name of the texture string/key
   * @param {PlayerWeaponTypes} weaponType - The type of the weapon, if the PowerUp applies weaponry
   */
  constructor(game: Phaser.Game, player: Player, resourceName: string, weaponType?: PlayerWeaponTypes) {
    super(game, game.world.width, randomInRange(0, game.world.height), resourceName)
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
    this.body.position.x -= 5

    // Player picked it up
    this.game.physics.arcade.overlap(this, this.player, (powerUp, player) => {
      this.destroy()

      if (this.applyWeaponType) {
        player.setActiveWeapon(this.weaponType, this.POWER_UP_DURATION)
      }
    })
  }
}
