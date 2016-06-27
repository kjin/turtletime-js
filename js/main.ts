///<reference path="defs/phaser.comments.d.ts"/>

import Game = Phaser.Game;
import Group = Phaser.Group;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

namespace TurtleTime {
    export class TurtleTimeGame {
        entities : Array<Array<Entity>>;
        controllers : Array<Controller>;

        preload() : void {
            game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
            game.load.image('highlightCircle', 'assets/highlightCircle.png');
        }

        create() : void {
            this.entities = [ [new Turtle(100, 100), new Turtle(200, 200)] ];
            // Create sprites for all entities
            applyOnSubelements(this.entities, (item : Entity) : void => item.assignSprite());
        }

        update() : void {
            // Update drawing
            applyOnSubelements(this.entities, (item : Entity) : void => item.updateView() );
        }
    }

    var turtleTimeGame : TurtleTimeGame = new TurtleTimeGame();
    export var game : Game = new Game(540, 960, Phaser.AUTO, '', {preload: turtleTimeGame.preload, create: turtleTimeGame.create, update: turtleTimeGame.update});
}
