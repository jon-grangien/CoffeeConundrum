import * as Assets from '../../assets'
import Player from '../../components/Player'
import Enemy from '../../components/Enemy/Enemy'
import GameAdapter from '../../globals/GameAdapter'
import GameManager from '../../globals/GameManager'
import DumbMoveStrategy from '../../components/Enemy/move/DumbMoveStrategy'
import DumbAttackStrategy from '../../components/Enemy/attack/DumbAttackStrategy'
import TrackingAttackStrategy from '../../components/Enemy/attack/TrackingAttackStrategy'
import SprayingAttackStrategy from '../../components/Enemy/attack/SprayingAttackStrategy'
import SlowMoveStrategy from '../../components/Enemy/move/SlowMoveStrategy'

export default class LevelOne extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null
  private player: Player
  private enemiesGroup: Phaser.Group
  private gameAdapter: GameAdapter

  private waves = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
  }

  private currentWaveNumber: number

  constructor() {
    super()
    this.gameAdapter = new GameAdapter()
  }

  public preload(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesLakeside.getName())
    this.backgroundTemplateSprite.anchor.setTo(0.5)
  }

  public create(): void {

    // Spawn player
    this.player = new Player(this.game)
    GameManager.Instance.setPlayerInstance(this.player)

    this.waves[1] = [
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[2] = [
      new Enemy(this.game, new SlowMoveStrategy(), new SprayingAttackStrategy()),
    ]
    this.waves[3] = [
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[4] = [
      new Enemy(this.game, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]
    this.waves[5] = [
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[6] = [
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[6] = [
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]
    this.waves[6] = [
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]

    this.enemiesGroup = this.game.add.group()

    // Spawn first wave
    this.enemiesGroup.addMultiple(this.waves['1'])
    this.currentWaveNumber = 1
  }

  public update(): void {
    GameManager.Instance.clearGraveyard()
    this.updateWaveIfPassed()
    this.gameAdapter.checkCollisions(this.game, this.player, this.enemiesGroup)
  }

  public goNext(): void {
    this.game.state.start('title')
  }

  /**
   * Check if current enemies wave is all dead
   * and if so, add the next until none are left
   */
  private updateWaveIfPassed(): void {
    if (this.gameAdapter.enemyGroupDead(this.enemiesGroup)) {
      this.currentWaveNumber = this.currentWaveNumber + 1

      if (this.waves[this.currentWaveNumber] !== undefined) {
        this.enemiesGroup.addMultiple(this.waves[this.currentWaveNumber])
      } else {
        this.goNext()
      }
    }
  }
}
