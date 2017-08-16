import 'phaser'
import Player from './components/Player'
import GameManager from './GameManager'

export default class GameAdapter {

  /**
   * Check collisions between objects
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {Phaser.Group} enemies
   */
  public checkCollisions(game: Phaser.Game, player: Player, enemies: Phaser.Group): void {

    // Player bullets hit enemy
    game.physics.arcade.overlap(enemies, player.getBullets(), (enemy, bullet) => {
      bullet.kill()
      enemy.damage(1)
    })

    enemies.forEach(enemy => {

      // Enemy weak bullets hits player
      game.physics.arcade.overlap(player, enemy.getWeakBullets(), (player, bullet) => {
        bullet.kill()
        player.damage(1)
      })

      // Enemy strong bullets hits player
      game.physics.arcade.overlap(player, enemy.getStrongBullets(), (player, bullet) => {
        bullet.kill()
        player.damage(1)
      })

      // Player bullets and enemy weak bullets hit each other
      game.physics.arcade.overlap(player.getBullets(), enemy.getWeakBullets(), (playerBullet, enemyBullet) => {
        playerBullet.kill()
        enemyBullet.kill()
      })
    }, this)
  }
}