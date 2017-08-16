import * as Assets from '../assets';

export default class Title extends Phaser.State {
  private backgroundTemplateSprite: Phaser.Sprite = null
  private sfxAudiosprite: Phaser.AudioSprite = null
  private startKey: Phaser.Key

  // This is any[] not string[] due to a limitation in TypeScript at the moment;
  // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
  private sfxLaserSounds: any[] = null

  public create(): void {
    this.backgroundTemplateSprite = this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, Assets.Images.ImagesBackgroundTemplate.getName())
    this.backgroundTemplateSprite.anchor.setTo(0.5)

    this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.sfxAudiosprite = this.game.add.audioSprite(Assets.Audiosprites.AudiospritesSfx.getName())

    // This is an example of how you can lessen the verbosity
    let availableSFX = Assets.Audiosprites.AudiospritesSfx.Sprites
    this.sfxLaserSounds = [
      availableSFX.Laser1,
      availableSFX.Laser2,
      availableSFX.Laser3,
      availableSFX.Laser4,
      availableSFX.Laser5,
      availableSFX.Laser6,
      availableSFX.Laser7,
      availableSFX.Laser8,
      availableSFX.Laser9
    ];

    this.backgroundTemplateSprite.inputEnabled = true;
    this.backgroundTemplateSprite.events.onInputDown.add(() => {
      this.sfxAudiosprite.play(Phaser.ArrayUtils.getRandomItem(this.sfxLaserSounds))
    });

    this.game.add.button(this.game.world.centerX - 100, 400, 'button', this.goNext, this, 2, 1, 0)
    this.game.camera.flash(0x000000, 1000)
  }

  public update(): void {
    if (this.startKey.isDown) {
      this.goNext()
    }
  }

  private goNext(): void {
    this.game.state.start('levelone')
  }
}
