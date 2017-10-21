import PowerUp from './PowerUp'
import Player from '../Player/Player'
import PlayerWeaponTypes from '../../globals/WeaponTypes'
import {Images} from '../../assets'

export default class PowerUpFactory {
  private game: Phaser.Game
  private player: Player

  constructor(game: Phaser.Game, player: Player) {
    this.game = game
    this.player = player
  }

  public spawnScatterer(): void {
    this.game.add.existing(
      new PowerUp(
        this.game,
        this.player,
        Images.SpritesheetsScattererPowerup.getName(),
        PlayerWeaponTypes.Scatterer
      )
    )
  }

  public spawnBehemoth(): void {
    this.game.add.existing(
      new PowerUp(
        this.game,
        this.player,
        Images.SpritesheetsScattererPowerup.getName(),
        PlayerWeaponTypes.Behemoth
      )
    )
  }
}
