import {Images} from '../../assets'
import GameAdapter from '../../globals/GameAdapter'

export default class Intro extends Phaser.State {
  private bgBack: any
  private bgMid: any
  private textContent: string[]
  private textEmotions: any
  private characterHead: Phaser.Sprite
  private textObject: any
  private gameAdapter: GameAdapter
  private countdownNumber: number = 3
  private startLevelCounter: any
  private skipKey: Phaser.Key

  private line: string[] = [];
  private wordIndex: number = 0;
  private lineIndex: number = 0;
  readonly WORD_DELAY: number = 150;
  readonly LINE_DELAY: number = 600;

  constructor() {
    super()
    this.gameAdapter = new GameAdapter()

    this.textContent = [
      'Drop the coffee mugs! It looks like the Tea Tyrant Triad is attacking again!',
      'If they get here they will burn our shop\'s organic coffee powder from the Old World!',
      'We can\'t let them have a monopoly on warm drinks in this city!',
      'Take the X-51 Caffeine and shoot those soggy teabags into powders.',
      'Shoot with J and use the java-dodge mechanic with K! Now GO!',
      '',
    ]

    this.textEmotions = {
      0: Images.ImagesAva1Normal.getName(),
      1: Images.ImagesAva1Sad.getName(),
      2: Images.ImagesAva1Sad.getName(),
      3: Images.ImagesAva1Normal.getName(),
      4: Images.ImagesAva1Happy.getName(),
      5: Images.ImagesAva1Glasses.getName()
    }
  }

  public create(): void {
    const backImg = Images.ImagesCyberpunkFarEdit3.getName()
    const midImg = Images.ImagesCyberpunkMid.getName()

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

    this.game.add.button(this.game.world.width - 150, this.game.world.height - 85, Images.SpritesheetsSkip.getName(), this.goNext, this, 2, 1, 0)
    this.skipKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR)

    this.textObject = this.game.add.text(110, 32, '', { font: '13px Arial', fill: '#19de65' })
    this.characterHead = this.game.add.sprite(32, 64, Images.ImagesAva1Normal.getName())
    this.nextLine()
  }

  public update(): void {
    if (this.skipKey.isDown) {
      this.goNext()
    }
  }
  private goNext(): void {
    this.game.state.start('levelone')
  }

  private nextLine() {
    if (this.lineIndex === this.textContent.length) {
      return this.countdownToNext()
    }

    this.line = this.textContent[this.lineIndex].split(' ')
    this.wordIndex = 0
    this.setDisplayCharacter(this.lineIndex)
    this.game.time.events.repeat(this.WORD_DELAY, this.line.length, this.nextWord, this)
    this.lineIndex++
  }

  private nextWord(): void {
    this.textObject.text = this.textObject.text.concat(this.line[this.wordIndex] + ' ')
    this.wordIndex++

    if (this.wordIndex === this.line.length) {
      this.textObject.text = this.textObject.text.concat('\n')
      this.game.time.events.add(this.LINE_DELAY, this.nextLine, this)
    }
  }

  private setDisplayCharacter(lineIdx: number): void {
    this.characterHead.loadTexture(this.textEmotions[lineIdx])
  }

  private countdownToNext(): void {
    this.startLevelCounter = this.game.add.text(this.game.world.centerX, this.game.world.centerY, this.countdownNumber.toString(), { font: '62px Arial', fill: '#fff' })

    const tween = this.game.add.tween(this.startLevelCounter).to(
      {alpha: 0}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false
    )
    tween.onComplete.add(() => {
      this.countdownNumber--

      if (this.countdownNumber === 0)
        this.goNext()
      else
        this.countdownToNext()
    })
  }
}
