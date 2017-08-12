import * as Phaser from 'phaser-ce'
import {Images} from '../assets';
import {skipBuiltinTypeChecks} from '../utils/gamehelpers'

export default class Player extends Phaser.Sprite {
    constructor(game: Phaser.Game) {
        skipBuiltinTypeChecks()
        super(game, 100, game.world.centerY, Images.SpritesheetsTinyShip.getName())

        game.add.existing(this)
    }
}


