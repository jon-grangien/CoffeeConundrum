import * as Assets from '../assets';

export default class Win extends Phaser.State {
  private backgroundTemplateSprite: Phaser.TileSprite = null
  private sfxAudiosprite: Phaser.AudioSprite = null
  private startKey: Phaser.Key

  // This is any[] not string[] due to a limitation in TypeScript at the moment;
  // despite string enums working just fine, they are not officially supported so we trick the compiler into letting us do it anyway.
  private sfxLaserSounds: any[] = null

  public create(): void {
    this.game.stage.backgroundColor = '#071924'
    const bgImg = Assets.Images.ImagesCyberpunkFarEdit3.getName()
    this.backgroundTemplateSprite = this.game.add.tileSprite(0,
      this.game.height - this.game.cache.getImage(bgImg).height,
      this.game.width,
      this.game.cache.getImage(bgImg).height,
      bgImg
    )

    this.startKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    this.sfxAudiosprite = this.game.add.audioSprite(Assets.Audiosprites.AudiospritesSfx.getName())

    // This is an example of how you can lessen the verbosity
    let availableSFX = Assets.Audiosprites.AudiospritesSfx.Sprites
    this.sfxLaserSounds = [
      availableSFX.Laser1
    ];

    const winText = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.centerY, 'YOU WON!', { font: '64px Anonymous Pro', fontStyle: 'bold', fill: '#aea', align: 'center' })
    winText.anchor.setTo(0.5, 0.5)
    this.game.add.existing(winText)

    const restartText = new Phaser.Text(this.game, this.game.world.centerX, this.game.world.height - this.game.world.centerY / 2, 'Press (space) to restart', { font: '22px Anonymous Pro', fill: '#aea', align: 'center' })
    restartText.anchor.setTo(0.5, 0.5)
    this.game.add.existing(restartText)

    this.backgroundTemplateSprite.inputEnabled = true;
    this.backgroundTemplateSprite.events.onInputDown.add(() => {
      this.sfxAudiosprite.play(Phaser.ArrayUtils.getRandomItem(this.sfxLaserSounds))
    });
  }

  public update(): void {
    if (this.startKey.isDown) {
      this.goNext()
    }
  }

  private goNext(): void {
    this.game.state.start('title')
  }
}
