import * as Assets from '../../assets'
import Player from '../../components/Player'
import Enemy from '../../components/Enemy/Enemy'
import DumbEnemyStrategy from '../../components/Enemy/DumbEnemyStrategy'
import GameAdaper from '../../GameAdapter'
import GameManager from '../../GameManager'

export default class LevelOne extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null
  private player: Player
  private waveOne: Phaser.Group
  private gameAdapter: GameAdaper

  constructor() {
    super()
    this.gameAdapter = new GameAdaper()
  }

  public preload(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesLakeside.getName())
    this.backgroundTemplateSprite.anchor.setTo(0.5)
  }

  public create(): void {
    this.waveOne = this.game.add.group()

    // Spawn first wave
    this.waveOne.addMultiple([
      new Enemy(this.game, new DumbEnemyStrategy()),
      new Enemy(this.game, new DumbEnemyStrategy()),
      new Enemy(this.game, new DumbEnemyStrategy())
    ])

    // Spawn player
    this.player = new Player(this.game)
  }

  public update(): void {
    GameManager.Instance.clearGraveyard()
    this.gameAdapter.checkCollisions(this.game, this.player, this.waveOne)
  }
}
