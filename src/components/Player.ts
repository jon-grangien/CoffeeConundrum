import * as Phaser from 'phaser-ce'
import {Images} from '../assets';

export default class Player extends Phaser.Sprite {
    constructor(game: Phaser.Game) {
        console.log(game)
        super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())
    }
}


