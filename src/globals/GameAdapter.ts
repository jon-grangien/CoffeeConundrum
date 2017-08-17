import 'phaser'
import Player from '../components/Player'
import * as Assets from '../assets'
import { PLAYER_HEALTH } from './constants'
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
        if (!player.getInvulnerability()) {
          bullet.kill()
          player.damage(1)
        }
      })

      // Enemy strong bullets hits player
      game.physics.arcade.overlap(player, enemy.getStrongBullets(), (player, bullet) => {
        if (!player.getInvulnerability()) {
          bullet.kill()
          player.damage(1)
        }
      })

      // Player bullets and enemy weak bullets hit each other
      game.physics.arcade.overlap(player.getBullets(), enemy.getWeakBullets(), (playerBullet, enemyBullet) => {
        playerBullet.kill()
        enemyBullet.kill()
      })

      // Player and enemy collision
      game.physics.arcade.overlap(player, enemy, (player, enemy) => {
        if (!player.getInvulnerability()) {
          player.damage(1)
          enemy.damage(3)
        }
      })

    }, this)
  }

  public enemyGroupDead(enemies: Phaser.Group): boolean {
    return enemies.countLiving() === 0;
  }

  public initHealthBar(game: Phaser.Game): void {
    for (let i = 0; i < PLAYER_HEALTH; ++i) {
      const heart = new Phaser.Sprite(game, 10 + i * 36, 10, Assets.Images.SpritesheetsHeart.getName())
      game.add.existing(heart)
      GameManager.Instance.pushHeart(heart)
    }
  }
}