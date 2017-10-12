import 'phaser'
import Player from '../components/Player/Player'
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

  public displayControls(game: Phaser.Game): void {
    const posY = game.world.centerY / 3
    const controls = new Phaser.Sprite(game, game.world.centerX, posY, Assets.Images.ImagesControls.getName())
    controls.anchor.setTo(0.5, 0.5)
    game.add.existing(controls)
    const tween = game.add.tween(controls).to(
      {alpha: 0}, 6500, Phaser.Easing.Linear.None, true, 0, 0, false
    )
    tween.onComplete.add(() => controls.destroy())
  }

  public displayWaveInfo(game: Phaser.Game, wave: number): void {
    const character: Phaser.Sprite = new Phaser.Sprite(game, game.world.centerX / 2, 25, Assets.Images.ImagesAva1Glasses.getName())
    const text: string = `Wave ${wave}`
    let appended: boolean = false
    let counter: number = 0
    const textObj: Phaser.Text = new Phaser.Text(game, character.x + 50, character.y, text, { font: '12px Anonymous Pro', fontStyle: 'bold', fill: '#aea', align: 'left' })

    character.anchor.setTo(0.5, 0.5)
    textObj.anchor.setTo(0, 0.5)
    game.add.existing(character)
    game.add.existing(textObj)

    const tween = game.add.tween(textObj).to(
      {}, 500, Phaser.Easing.Linear.None, true, 0, 1000, true
    )
    tween.onRepeat.add(() => {
      counter++
      if (!appended) {
        textObj.text = text + ' !!'
        appended = true
      } else {
        textObj.text = text
        appended = false
      }

      // Stop
      if (counter >= 8) {
        tween.stop()
        character.destroy()
        textObj.destroy()
      }
    })
  }

  public initHealthBar(game: Phaser.Game): void {
    for (let i = 0; i < PLAYER_HEALTH; ++i) {
      const heart = new Phaser.Sprite(game, 10 + i * 22, 10, Assets.Images.SpritesheetsHeart.getName())
      game.add.existing(heart)
      GameManager.Instance.pushHeart(heart)
    }
  }

  public gameOver(game: Phaser.Game): void {
    const text = new Phaser.Text(game, game.world.centerX, game.world.centerY, 'Game Over', { font: '65px Anonymous Pro', fill: '#ff0044', align: 'center' })
    text.anchor.set(0.5)
    game.add.existing(text)

    game.add.button(game.world.centerX - 100, game.world.centerY + 50, Assets.Images.SpritesheetsTryagain1.getName(), () => {
      game.state.start('levelone')
    })
  }

}