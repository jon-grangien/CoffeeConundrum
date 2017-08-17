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
import { randomYPos } from '../../utils/gamehelpers'
import FastShootAttackStrategy from '../../components/Enemy/attack/FastShootAttackStrategy'

export default class LevelOne extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null
  private player: Player
  private enemiesGroup: Phaser.Group
  private gameAdapter: GameAdapter
  private bgBack: any
  private bgMid: any
  private bgFront: any

  private waves = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
  }

  private currentWaveNumber: number

  constructor() {
    super()
    this.gameAdapter = new GameAdapter()
  }

  public create(): void {

    this.game.stage.backgroundColor = '#071924'

    const backImg = Assets.Images.ImagesCyberpunkFarEdit3.getName()
    const midImg = Assets.Images.ImagesCyberpunkMid.getName()
    const frontImg = Assets.Images.ImagesCyberpunkForeground.getName()

    this.bgBack = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(backImg).height,
      this.game.width,
      this.game.cache.getImage(backImg).height,
      backImg
    );

    this.bgMid = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(midImg).height,
      this.game.width,
      this.game.cache.getImage(midImg).height,
      midImg
    );

    this.bgFront = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(frontImg).height,
      this.game.width,
      this.game.cache.getImage(frontImg).height,
      frontImg
    );

    this.gameAdapter.initHealthBar(this.game)

    // Spawn player
    this.player = new Player(this.game)
    GameManager.Instance.setPlayerInstance(this.player)

    this.waves[1] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[2] = [
      new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(), new SprayingAttackStrategy()),
    ]
    this.waves[3] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
    ]
    this.waves[3] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy()),
    ]
    this.waves[5] = [
      new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]
    this.waves[6] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy()),
    ]
    this.waves[7] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy()),
    ]
    this.waves[8] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]
    this.waves[9] = [
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(false), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(false), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(true), new SprayingAttackStrategy()),
      new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(false), new SprayingAttackStrategy()),
    ]

    this.enemiesGroup = this.game.add.group()

    // Spawn first wave
    this.enemiesGroup.addMultiple(this.waves[1])
    this.currentWaveNumber = 1
  }

  public update(): void {
    GameManager.Instance.clearGraveyard()
    this.updateWaveIfPassed()
    this.gameAdapter.checkCollisions(this.game, this.player, this.enemiesGroup)

    this.bgBack.tilePosition.x -= 0.2;
    this.bgMid.tilePosition.x -= 0.8;
    this.bgFront.tilePosition.x -= 2;
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
