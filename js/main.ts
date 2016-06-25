///<reference path="defs/phaser.comments.d.ts"/>
///<reference path="turtletime/Turtle.ts"/>

import Game = Phaser.Game;
import Group = Phaser.Group;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

namespace TurtleTime {
    class TurtleTimeGame {
        game:Game = new Game(540, 960, Phaser.AUTO, '', {preload: this.preload, create: this.create, update: this.update});
        turtles:Array<Turtle>;

        preload() {
            this.game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
        }

        create() {
            this.turtles = [new Turtle(this.game, 100, 100), new Turtle(this.game, 200, 200)];
        }

        update() {
            this.turtles.forEach(function (turtle:Turtle) {
                turtle.update();
            });
        }
    }
}