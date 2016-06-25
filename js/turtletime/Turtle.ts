///<reference path="../defs/phaser.comments.d.ts"/>

module TurtleTime {
    export class Turtle {
        position:Phaser.Point;
        sprite:Phaser.Sprite;

        constructor(game:Phaser.Game, x:number, y:number) {
            this.sprite = game.add.sprite(x, y, 'turtle');
        }

        update():void {
            this.sprite.x++;
        }
    }
}