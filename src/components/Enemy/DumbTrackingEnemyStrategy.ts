import 'phaser'
import DumbEnemyStrategy from './DumbEnemyStrategy'
import GameManager from '../../globals/GameManager'

/**
 * A dumb, standard enemy that shoots towards the player
 */
export default class DumbTrackingEnemyStrategy extends DumbEnemyStrategy {
  /**
   * @Override
   * @param {Phaser.Weapon} weaponWeak
   * @param {Phaser.Weapon} weaponStrong
   * @param {Phaser.Timer} timer
   */
  public attack(weaponWeak: Phaser.Weapon, weaponStrong: Phaser.Weapon, timer: Phaser.Timer) {
    const poll = Math.random()
    const playerInstance = GameManager.Instance.getPlayerInstance()
    const x = playerInstance.body ? playerInstance.body.position.x : undefined
    const y = playerInstance.body ? playerInstance.body.position.y : undefined

    if (poll < 0.08) {
      if (x && y) {
        weaponStrong.fireAtXY(x, y)
      } else {
        weaponStrong.fire()
      }
    }

    else {
      if (x && y) {
        weaponWeak.fireAtXY(x, y)
      } else {
        weaponWeak.fire()
      }
    }
  }
}
