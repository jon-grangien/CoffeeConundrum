import 'phaser'
import Player from '../components/Player/Player'
import * as Assets from '../assets'
import { PLAYER_HEALTH } from './constants'
import GameManager from './GameManager'
import Zap from '../components/Player/Zap'

export default class GameAdapter {

  /**
   * Check collisions between objects
   * @param {Phaser.Game} game
   * @param {Player} player
   * @param {Phaser.Group} enemies
   */
  public checkCollisions(game: Phaser.Game, player: Player, enemies: Phaser.Group): void {

    // Player bullets hit enemy
    player.getBullets().children.map(playerBullets => {
      game.physics.arcade.overlap(enemies, playerBullets, (enemy, bullet) => {
        bullet.kill()
        enemy.damage(1)
      })
    })

    enemies.forEach(enemy => {

      // Enemy weak bullets hits player
      game.physics.arcade.overlap(player, enemy.getWeakBullets(), (player, bullet) => {
        if (!player.getInvulnerability()) {
          bullet.kill()
          player.damage(1)
          const zap = new Zap(game, bullet, 24, [1.0, 0.7, 0.2], [0.8, 0.8, 0.8])
          game.add.existing(zap)
        }
      })

      // Enemy strong bullets hits player
      game.physics.arcade.overlap(player, enemy.getStrongBullets(), (player, bullet) => {
        if (!player.getInvulnerability()) {
          bullet.kill()
          player.damage(1)
          const zap = new Zap(game, bullet, 24, [1.0, 0.5, 1.0], [0.8, 0.8, 0.8])
          game.add.existing(zap)
        }
      })

      // Player bullets and enemy weak bullets hit each other
      game.physics.arcade.overlap(player.getBullets(), enemy.getWeakBullets(), (playerBullet, enemyBullet) => {
        playerBullet.kill()
        enemyBullet.kill()
        const zap = new Zap(game, enemyBullet, 24, [1.0, 0.7, 0.2], [0.8, 0.8, 0.8])
        game.add.existing(zap)
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
    let { waveSpritesTween, waveSpritesCharacter, waveSpritesText } = GameManager.Instance
    if (waveSpritesTween)
      waveSpritesTween.stop()
    if (waveSpritesCharacter && waveSpritesCharacter.alive)
      waveSpritesCharacter.destroy()
    if (waveSpritesText && waveSpritesText.alive)
      waveSpritesText.destroy()

    const text: string = `Wave ${wave}`
    let appended: boolean = false
    let counter: number = 0

    waveSpritesCharacter = new Phaser.Sprite(game, game.world.centerX / 2, 25, Assets.Images.ImagesAva1Glasses.getName())
    const { position } = waveSpritesCharacter
    waveSpritesText = new Phaser.Text(game, position.x + 50, position.y, text, { font: '12px Anonymous Pro', fontStyle: 'bold', fill: '#aea', align: 'left' })

    waveSpritesCharacter.anchor.setTo(0.5, 0.5)
    waveSpritesText.anchor.setTo(0, 0.5)
    game.add.existing(waveSpritesCharacter)
    game.add.existing(waveSpritesText)

    waveSpritesTween = game.add.tween(this).to(
      {}, 400, Phaser.Easing.Linear.None, true, 0, 1000, true
    )
    waveSpritesTween.onRepeat.add(() => {
      counter++
      if (!appended) {
        waveSpritesText.text = text + ' !!'
        appended = true
      } else {
        waveSpritesText.text = text
        appended = false
      }

      // Stop
      if (counter >= 7) {
        waveSpritesTween.stop()
        waveSpritesCharacter.destroy()
        waveSpritesText.destroy()
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

    game.add.button(game.world.centerX - 100, game.world.centerY + 50, Assets.Images.SpritesheetsTryagain2.getName(), () => {
      game.state.start('levelone')
    })
  }
}