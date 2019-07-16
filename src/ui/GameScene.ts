import * as Phaser from 'phaser'
import Connect4Play from '../game/Connect4Play'
import Loading from './Loading'

export default class GameScene extends Phaser.Scene{

    private connect4Play: Connect4Play

    private enabled: boolean = false

    private stone: Phaser.Physics.Impact.ImpactImage

    private chosenPromise: Promise<integer>

    private choose: (x: integer) => void

    private playedPromise: Promise<void>

    private played: () => void

    private player: integer

    private readonly worldBounds = new Phaser.Geom.Rectangle(0, 0, 200, 150);

    private loading: Loading

    public constructor(){
        super({
            key: "GameScene"
        })
    }

    public preload(): void
    {
        this.load.setBaseURL('')
        this.load.image('board', 'img/board.png')
        this.load.image('redcircle', 'img/redcircle.png')
        this.load.image('yellowcircle', 'img/yellowcircle.png')
        this.load.image('background', 'img/background.jpg')
        this.load.image('bottom', 'img/bottom.png')
        this.load.image('playerwins', 'img/playerwins.png')
        this.load.image('gpuwins', 'img/gpuwins.png')
        this.load.image('playervsgpu', 'img/playervsgpu.png')
        this.load.image('notsupported', 'img/notsupported.png')
        this.load.image('tie', 'img/tie.png')
    }

    private preloadGame(): void {
        let play = async (): Promise<number> =>{
            this.setPlayEnabled(true)
            return this.chosenPromise
        }

        let played = async (x: integer): Promise<void> =>{
            this.setPlayEnabled(false)
            this.setAbsolutePosition(x)
            this.letStoneFall()
            return this.playedPromise
        }

        let gameEnded = async (winner: integer): Promise<void> =>{
            this.setPlayEnabled(false)
            this.stone.setVisible(false)
            this.gameEnded(winner)
        }

        this.connect4Play = new Connect4Play()
        this.connect4Play.init(play, played, gameEnded)
            .then((player): Promise<void> =>{
                this.setupPlayer(player)
                this.loading.destroy()
                this.loading = null
                return this.connect4Play.play()
            }).then((): void =>{},(): void =>{
                this.showNotSupported()
            })
    }

    private setPlayEnabled(enabled: boolean): void {
        this.enabled = enabled
        if(!enabled) this.chosenPromise = null
        else this.chosenPromise = new Promise((success: (x: number) => void): void =>{
            this.choose = success
        })
    }
    
    private getIndex(x: integer): integer{
        if(x<48) return 0
        if(x>48+15*6) return 6
        else {
            return Math.floor((x-48)/15)
        }
    }

    private getAbsolutePos(index: integer): number{
        return 48+15*index
    }    

    private setAbsolutePosition(index: integer): void {
        this.stone.body.pos.x = this.getAbsolutePos(index)
    }

    private letStoneFall(): void {
        this.stone.setGravity(20)
        this.playedPromise =  new Promise((success): void =>{
            this.played = success
        })
    }

    private setupPlayer(player: integer): void {
        this.player = player
        if(this.stone!=null){
            this.stone.setGravity(0.0)
            this.stone.setFixedCollision()
        }
        this.stone = this.impact.add.image(100, 40, player<0 ? 'redcircle' : 
            'yellowcircle')
        this.stone.setGravity(0.0)
        this.stone.setActiveCollision()
    }

    private nextPlayer(): void {
        this.setupPlayer(-this.player)
        this.played()
    }


    private gameEnded(outcome: integer): void {

        let filter = this.add.rectangle(10, 10, 1000, 1000, 0x666666)
        filter.depth = 3
        filter.setAlpha(0.0)

        let texture = outcome == 1 ? 'playerwins' : outcome==-1 ? 'gpuwins' : 'tie'
        let wintext = this.add.image(100,75, texture)
        wintext.setAlpha(0.0)
        wintext.depth = 4

        this.tweens.add({
            targets: filter,
            duration: 200,
            ease: 'Quadratic',
            delay: 0,
            alpha: {
                getStart: (): number => 0,
                getEnd: (): number => 0.5
            }
        })

        this.tweens.add({
            targets: wintext,
            duration: 500,
            ease: 'Quadratic',
            delay: 0,
            alpha: {
                getStart: (): number => 0,
                getEnd: (): number => 1
            },
            onComplete: (): void => {
                setTimeout((): void =>{
                    this.stone = null
                    this.scene.restart()
                }, 5000)
            }
        })
    }

    private showNotSupported(): void {
        let notsupported = this.add.image(100, 75, 'notsupported')
        notsupported.depth = 5
    }

    public update(): void {
        if(this.loading!=null) this.loading.update()
    }

    public create (): void
    {
    
        this.loading = new Loading()
        this.loading.create(this)

        var board = this.add.image(100, 91, 'board')
        this.add.image(100, 75, 'background')
        this.add.image(155, 8, 'playervsgpu')
        this.impact.world.setBounds(0, 0, this.worldBounds.width, this.worldBounds.height, undefined)
        this.impact.world.on('collide', (bodyA: Phaser.Physics.Impact.Body, bodyB: Phaser.Physics.Impact.Body): void =>{
            if(bodyA===this.stone.body || bodyB===this.stone.body){
                this.nextPlayer()
            }
        })
        
        board.depth = 2

        var bottom = this.impact.add.image(100, 130, 'bottom')
        bottom.setFixedCollision()
        bottom.setGravity(0)
    
        this.input.on('pointermove', (pointer: Phaser.Input.Pointer): void =>{
            if (this.stone && this.enabled)
            {
                let x = pointer.position.x
                let idx = this.getIndex(x)
                this.setAbsolutePosition(idx)
            }
        }, this)

        this.input.on('pointerup', async (pointer: Phaser.Input.Pointer): Promise<void> =>{
            if (this.enabled){
                let x = pointer.position.x
                let idx = this.getIndex(x)
                let allowed = await this.connect4Play.isAllowed(idx)
                if(allowed) this.choose(idx)
            }
        })
        
        this.preloadGame()
    }
}