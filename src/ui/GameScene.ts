import Connect4Play from '../game/Connect4Play'


export default class GameScene extends Phaser.Scene {


    private connect4Play: Connect4Play

    private enabled: boolean = false

    private stone: Phaser.Physics.Impact.ImpactImage

    private chosenPromise: Promise<integer>

    private choose: (x: integer)=>void

    private playedPromise: Promise<void>

    private played: ()=>void

    private player: integer

    private readonly worldBounds = new Phaser.Geom.Rectangle(0, 0, 200, 150);

    constructor() {
        super({
            key: "GameScene"
        });
    }

    preload ()
    {
        this.load.setBaseURL('');
        this.load.image('board', 'img/board.png');
        this.load.image('redcircle', 'img/redcircle.png');
        this.load.image('yellowcircle', 'img/yellowcircle.png');
        this.load.image('background', 'img/background.jpg');
        this.load.image('bottom', 'img/bottom.png');
        this.load.image('playerwins', 'img/playerwins.png');
        this.load.image('gpuwins', 'img/gpuwins.png');
        this.load.image('playervsgpu', 'img/playervsgpu.png');
        this.load.image('notsupported', 'img/notsupported.png');
        this.load.image('tie', 'img/tie.png');
    }

    setPlayEnabled(enabled: boolean){
        this.enabled = enabled
        if(!enabled) this.chosenPromise = null
        else this.chosenPromise = new Promise((success,error)=>{
            this.choose = success
        })
    }
    
    getIndex(x: integer){
        if(x<48) return 0
        if(x>48+15*6) return 6
        else {
            return Math.floor((x-48)/15)
        }
    }

    getAbsolutePos(index: integer){
        return 48+15*index
    }    

    setAbsolutePosition(index: integer){
        this.stone.body.pos.x = this.getAbsolutePos(index)
    }

    letStoneFall(){
        this.stone.setGravity(20)
        this.playedPromise =  new Promise((success,error)=>{
            this.played = success
        })
    }

    setupPlayer(player: integer){
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

    nextPlayer(){
        this.setupPlayer(-this.player)
        this.played()
    }


    gameEnded(outcome: integer){

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
                getStart: () => 0,
                getEnd: () => 0.5
            },
            onComplete: () => {
                // Handle completion
            }
        })

        this.tweens.add({
            targets: wintext,
            duration: 500,
            ease: 'Quadratic',
            delay: 0,
            alpha: {
                getStart: () => 0,
                getEnd: () => 1
            },
            onComplete: () => {
                setTimeout(()=>{
                    this.stone = null
                    this.scene.restart();
                }, 5000)
            }
        })
    }

    showNotSupported(){
        let notsupported = this.add.image(100, 75, 'notsupported');
        notsupported.depth = 5
    }

    create ()
    {
    
        let play = async ()=>{
            this.setPlayEnabled(true)
            return this.chosenPromise
        }

        let played = async (x: integer)=>{
            this.setPlayEnabled(false)
            this.setAbsolutePosition(x)
            this.letStoneFall()
            return this.playedPromise
        }

        let gameEnded = async (winner: integer)=>{
            this.setPlayEnabled(false)
            this.stone.setVisible(false)
            this.gameEnded(winner)
        }

        this.connect4Play = new Connect4Play()
        this.connect4Play.init(play, played, gameEnded)
        .then((player)=>{
            this.setupPlayer(player)
            return this.connect4Play.play()
        }).then(()=>{},(error)=>{
            this.showNotSupported()
        })
    
        var board = this.add.image(100, 91, 'board');
        var background = this.add.image(100, 75, 'background');
        this.add.image(155, 8, 'playervsgpu');
        this.impact.world.setBounds(0, 0, this.worldBounds.width, this.worldBounds.height, undefined);
        this.impact.world.on('collide', (bodyA: any, bodyB: any)=>{
            if(bodyA===this.stone.body || bodyB===this.stone.body){
                this.nextPlayer()
            }
        })
        
        board.depth = 2

        var bottom = this.impact.add.image(100, 130, 'bottom');
        bottom.setFixedCollision()
        bottom.setGravity(0)
    
        this.input.on('pointermove', (pointer: any)=>{
            if (this.stone && this.enabled)
            {
                let x = pointer.position.x
                let idx = this.getIndex(x)
                this.setAbsolutePosition(idx)
            }
        }, this)

        this.input.on('pointerup', async (pointer: any)=>{
            if (this.enabled){
                let x = pointer.position.x
                let idx = this.getIndex(x)
                let allowed = await this.connect4Play.isAllowed(idx)
                if(allowed) this.choose(idx)
            }
        })
    }
}