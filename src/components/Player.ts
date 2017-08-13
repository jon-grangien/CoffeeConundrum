import 'phaser'
import {Images} from '../assets';

export default class Player extends Phaser.Sprite {
  constructor(game: Phaser.Game) {
    super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())
    game.add.existing(this)
  }
}

