import * as Assets from '../../assets'
import Player from '../../components/Player'
import Enemy from '../../components/Enemy/BaseEnemy'
import DumbEnemyStrategy from '../../components/Enemy/DumbEnemyStrategy'

export default class LevelOne extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null
  private player: Player
  private enemies: Enemy[]

  public preload(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesLakeside.getName())
    this.backgroundTemplateSprite.anchor.setTo(0.5)
  }

  public create(): void {
    this.player = new Player(this.game)
    this.enemies = [
      new Enemy(this.game, new DumbEnemyStrategy()),
      new Enemy(this.game, new DumbEnemyStrategy()),
      new Enemy(this.game, new DumbEnemyStrategy())
    ]
  }
}
