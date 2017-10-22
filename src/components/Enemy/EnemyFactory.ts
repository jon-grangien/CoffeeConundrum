import Enemy from './Enemy'
import {randomYPos} from '../../utils/gamehelpers'
import DumbMoveStrategy from './move/DumbMoveStrategy'
import DumbAttackStrategy from './attack/DumbAttackStrategy'
import TrackingAttackStrategy from './attack/TrackingAttackStrategy'
import SlowMoveStrategy from './move/SlowMoveStrategy'
import SprayingAttackStrategy from './attack/SprayingAttackStrategy'
import FastShootAttackStrategy from './attack/FastShootAttackStrategy'
import ScatterShootAttackStrategy from './attack/ScatterShootAttackStrategy'
import ScatterCrazyAttackStrategy from './attack/ScatterCrazyAttackStrategy'
import ScatterStrongShootAttackStrategy from './attack/ScatterStrongShootAttackStrategy'
import HoseAttackStrategy from './attack/HoseAttackStrategy'
import TutorialAttackStrategy from './attack/TutorialAttackStrategy'

export default class EnemyFactory {
  private game: Phaser.Game

  constructor(game: Phaser.Game) {
    this.game = game
  }

  public makeDumb(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new DumbAttackStrategy())
  }

  public makeTutorial(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TutorialAttackStrategy())
  }

  public makeDumbMovingTracking(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new TrackingAttackStrategy())
  }

  public makeDumbMovingFastShooting(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new FastShootAttackStrategy())
  }

  public makeSlowMovingSpraying(moveUpwards?: boolean): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(moveUpwards), new SprayingAttackStrategy())
  }

  public makeSlowMovingFastShooting(moveUpwards?: boolean): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new SlowMoveStrategy(moveUpwards), new FastShootAttackStrategy())
  }

  public makeSlowCenteredScatterer(moveUpwards?: boolean): Enemy {
    return new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(moveUpwards), new ScatterShootAttackStrategy())
  }

  public makeDumbMovingScatterer(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new ScatterShootAttackStrategy())
  }

  public makeDumbMovingHoseShooter(): Enemy {
    return new Enemy(this.game, randomYPos(this.game.height), new DumbMoveStrategy(), new HoseAttackStrategy())
  }

  public makeSlowCenteredStrongScatterer(moveUpwards?: boolean): Enemy {
    return new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(moveUpwards), new ScatterStrongShootAttackStrategy())
  }

  public makeSlowCenteredCrazyScatterer(moveUpwards?: boolean): Enemy {
    return new Enemy(this.game, this.game.world.centerY, new SlowMoveStrategy(moveUpwards), new ScatterCrazyAttackStrategy())
  }

  public makeDumbMovingCrazyScatterer(): Enemy {
    return new Enemy(this.game, this.game.world.centerY, new DumbMoveStrategy(), new ScatterCrazyAttackStrategy())
  }

  public makeStrongDumbMovingCrazyScatterer(): Enemy {
    const e = new Enemy(this.game, this.game.world.centerY, new DumbMoveStrategy(), new ScatterCrazyAttackStrategy())
    e.health = 15
    return e
  }
}
