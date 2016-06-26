///<reference path="defs/phaser.comments.d.ts"/>

import Game = Phaser.Game;
import Group = Phaser.Group;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

namespace TurtleTime {
    class TurtleTimeGame {
        game : Game = new Game(540, 960, Phaser.AUTO, '', {preload: this.preload, create: this.create, update: this.update});
        entities : Array<Array<Entity>>;

        preload() : void {
            this.game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
        }

        create() : void {
            this.entities = [ [new Turtle(100, 100), new Turtle(200, 200)] ];
            // Create sprites for all entities
            applyOnSubelements(this.entities, (item : Entity) : void => item.assignSprite(this.game.add.sprite(0, 0)));
        }

        update() : void {
            // Update drawing
            applyOnSubelements(this.entities, (item : Entity) : void => item.updateSprite() );
        }
    }
}