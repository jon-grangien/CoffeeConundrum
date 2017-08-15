import 'phaser'
import Player from './components/Player'

export default class GameAdapter {

  /**
   * Check collisions between enemies group and player bullets
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {Phaser.Group} enemies
   */
  public checkCollisions(game: Phaser.Game, player: Player, enemies: Phaser.Group): void {
    game.physics.arcade.overlap(enemies, player.getBullets(), (enemy, bullet) => {
      enemy.damage(1)
    })
  }
}