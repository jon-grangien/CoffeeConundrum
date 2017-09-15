import * as Assets from '../../assets'
import Player from '../../components/Player'
import Enemy from '../../components/Enemy/Enemy'
import GameAdapter from '../../globals/GameAdapter'
import GameManager from '../../globals/GameManager'
import EnemyFactory from '../../components/Enemy/EnemyFactory'

export default class LevelOne extends Phaser.State {
  private player: Player
  private enemiesGroup: Phaser.Group
  private gameAdapter: GameAdapter
  private bgBack: any
  private bgMid: any
  private bgFront: any
  private farTilesSpeed: number = 0.1
  private midTilesSpeed: number = 1
  private frontTilesSpeed: number = 3

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
    )

    this.bgMid = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(midImg).height,
      this.game.width,
      this.game.cache.getImage(midImg).height,
      midImg
    )

    this.bgFront = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(frontImg).height,
      this.game.width,
      this.game.cache.getImage(frontImg).height,
      frontImg
    )

    this.gameAdapter.initHealthBar(this.game)

    // Spawn player
    this.player = new Player(this.game)
    GameManager.Instance.setPlayerInstance(this.player)

    this.enemiesGroup = this.game.add.group()

    // Spawn first wave
    this.enemiesGroup.addMultiple(this.getWaveOfEnemies(1))
    this.currentWaveNumber = 1
  }

  public update(): void {
    GameManager.Instance.clearGraveyard()
    this.updateWaveIfPassed()
    this.gameAdapter.checkCollisions(this.game, this.player, this.enemiesGroup)

    //let bullets = 0
    //this.enemiesGroup.forEach((enemy) => {
    //  bullets += enemy.getWeakBullets().length + enemy.getStrongBullets().length
    //}, this)
    //console.log(bullets)

    this.bgBack.tilePosition.x -= this.farTilesSpeed
    this.bgMid.tilePosition.x -= this.midTilesSpeed
    this.bgFront.tilePosition.x -= this.frontTilesSpeed
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

      // Make parallax bg move slightly faster for each wave
      this.farTilesSpeed += 0.03
      this.midTilesSpeed += 0.1
      this.frontTilesSpeed += 0.3

      const wave = this.getWaveOfEnemies(this.currentWaveNumber)

      if (wave.length > 0) {
        this.enemiesGroup.addMultiple(wave)
      } else {
        this.goNext()
      }
    }
  }

  private getWaveOfEnemies(waveNumber: number): Enemy[] {
    const enemyFactory = new EnemyFactory(this.game)
    let enemies

    switch (waveNumber) {
      case 1:
        enemies = [
          enemyFactory.makeDumb(),
          enemyFactory.makeDumb(),
          enemyFactory.makeDumbMovingTracking()
        ]
        break
      case 2:
        enemies = [
          enemyFactory.makeDumb(),
          enemyFactory.makeDumb(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking()
        ]
        break
      case 3:
        enemies = [
          enemyFactory.makeDumbMovingFastShooting(),
          enemyFactory.makeDumbMovingFastShooting(),
          enemyFactory.makeDumbMovingFastShooting(),
        ]
        break
      case 4:
        enemies = [
          enemyFactory.makeDumb(),
          enemyFactory.makeDumb(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingFastShooting()
        ]
        break
      case 5:
        enemies = [
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingFastShooting()
        ]
        break
      case 6:
        enemies = [
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false)
        ]
        break
      case 7:
        enemies = [
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeDumbMovingTracking(),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
        ]
        break
      case 8:
        enemies = [
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),
          enemyFactory.makeSlowMovingSpraying(true),
          enemyFactory.makeSlowMovingSpraying(false),

        ]
        break
      case 9:
        enemies = [
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
          enemyFactory.makeSlowMovingFastShooting(true),
          enemyFactory.makeSlowMovingFastShooting(false),
        ]
        break
      default:
        enemies = []
        break
    }

    return enemies
  }
}
