import 'phaser'

export default class Loading {


    private loading : Phaser.GameObjects.Rectangle

    private text : Phaser.GameObjects.Text

    private timerEvent: Phaser.Time.TimerEvent

    create(scene: Phaser.Scene){
        this.loading = scene.add.rectangle(0,0,400,300, 0x0000cb)
        this.loading.depth = 6

        this.text = scene.add.text(75,70, "Loading...", {fill: 'white', font: 'bold 6pt Helvetica'})
        this.text.depth = 7

        this.timerEvent = scene.time.addEvent({ delay: 1500, loop: true });
    }

    update(){
        let dots = Math.trunc(this.timerEvent.getProgress() / 0.25)
        this.text.setText("Loading" + ".".repeat(dots))
    }

    destroy(){
        this.text.destroy()
        this.loading.destroy()
    }

}