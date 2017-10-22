import {Images} from '../../assets'
import Player from '../../components/Player/Player'
import GameAdapter from '../../globals/GameAdapter'
import GameManager from '../../globals/GameManager'
import getLevelOneEnemyWave from '../enemyWaves/levelOneWaves'
import EnemyFactory from '../../components/Enemy/EnemyFactory'
import PowerUpFactory from '../../components/PowerUp/PowerUpFactory'

export default class LevelOne extends Phaser.State {
  readonly WAVE_DELAY: number = 750

  private player: Player
  private enemiesGroup: Phaser.Group
  private gameAdapter: GameAdapter
  private timer: Phaser.Timer
  private bgBack: any
  private bgMid: any
  private bgFront: any
  private farTilesSpeed: number = 0.1
  private midTilesSpeed: number = 1
  private frontTilesSpeed: number = 3
  private enemyFactory: EnemyFactory
  private powerUpFactory: PowerUpFactory
  private willUpdateWave: boolean
  private restartKey: Phaser.Key
  private currentWaveNumber: number

  constructor() {
    super()
    this.gameAdapter = new GameAdapter()
  }

  public create(): void {
    GameManager.Instance.levelStartLogic(this.game)

    this.restartKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.willUpdateWave = false
    this.enemyFactory = new EnemyFactory(this.game)
    this.game.stage.backgroundColor = '#071924'

    this.timer = this.game.time.create(false)
    this.timer.start()

    const backImg = Images.ImagesCyberpunkFarEdit3.getName()
    const midImg = Images.ImagesCyberpunkMid.getName()
    const frontImg = Images.ImagesCyberpunkForeground.getName()

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
    this.gameAdapter.displayControls(this.game)

    this.enemiesGroup = this.game.add.group()

    // Spawn player
    this.player = new Player(this.game)
    GameManager.Instance.setPlayerInstance(this.player)
    this.powerUpFactory = new PowerUpFactory(this.game, this.player)

    // Spawn first wave
    this.enemiesGroup.addMultiple(getLevelOneEnemyWave(1, this.enemyFactory))
    this.currentWaveNumber = 1
    console.log(`Wave ${this.currentWaveNumber}`)
    this.powerUpFactory.spawnBehemoth()
  }

  public update(): void {
    GameManager.Instance.clearGraveyard()
    this.checkWavePassed()
    this.gameAdapter.checkCollisions(this.game, this.player, this.enemiesGroup)

    //let bullets = 0
    //this.enemiesGroup.forEach((enemy) => {
    //  bullets += enemy.getWeakBullets().length + enemy.getStrongBullets().length
    //  console.log(enemy.getWeakBullets())
    //}, this)
    //console.log(bullets)

    //if (!this.player.dodgeReady) {
    //  console.log(this.player.getDodgeCooldownTimePercent())
    //}

    GameManager.Instance.updateFiltersTime(this.game.time.totalElapsedSeconds() * 1000)
    this.bgBack.tilePosition.x -= this.farTilesSpeed
    this.bgMid.tilePosition.x -= this.midTilesSpeed
    this.bgFront.tilePosition.x -= this.frontTilesSpeed

    if (!this.player.alive) {
      if (GameManager.Instance.getRestartKeyReady() && this.restartKey.isDown) {
        this.game.state.start('levelone')
      }
    }
  }

  public goNext(): void {
    this.game.state.start('win')
  }

  private checkWavePassed(): void {
    if (!this.willUpdateWave && this.gameAdapter.enemyGroupDead(this.enemiesGroup)) {
      this.willUpdateWave = true

      this.timer.add(this.WAVE_DELAY, () => {
        this.updateWave()
      })
    }
  }

  /**
   * Check if current enemies wave is all dead
   * and if so, add the next until none are left
   */
  private updateWave(): void {
    this.willUpdateWave = false // reset state for coming loops
    this.currentWaveNumber = this.currentWaveNumber + 1

    // Make parallax bg move slightly faster for each wave
    this.farTilesSpeed += 0.03
    this.midTilesSpeed += 0.1
    this.frontTilesSpeed += 0.3

    const wave = getLevelOneEnemyWave(this.currentWaveNumber, this.enemyFactory)

    if (wave.length > 0) {
      console.log(`Wave ${this.currentWaveNumber}`)
      this.gameAdapter.displayWaveInfo(this.game, this.currentWaveNumber)
      this.enemiesGroup.addMultiple(wave)

      // Spawn powerUp possibility
      const poll: number = Math.random()
      if (poll <= 0.35) {
        const poll2: number = Math.random()
        const timer = this.game.time.create(true)
        timer.start()

        if (poll2 > 0.5)
          timer.add(750, () => this.powerUpFactory.spawnScatterer())
        else
          timer.add(750, () => this.powerUpFactory.spawnBehemoth())
      }

    } else {
      // No more enemies
      this.goNext()
    }
  }

}
