///<reference path="defs/phaser.comments.d.ts"/>

import Game = Phaser.Game;
import Group = Phaser.Group;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

namespace TurtleTime {
    export interface GameState {
        entities : {
            misc : Array<Entity>,
            turtles : Array<Turtle>,
            chairs : Array<Chair>,
            tables : Array<Table>
        }
    }

    export class TurtleTimeGame {
        gameState : GameState;
        controllers : Array<Controller>;

        preload() : void {
            game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
            game.load.image('highlightCircle', 'assets/highlightCircle.png');
            game.load.spritesheet('tableandchair', 'assets/tableandchair.png', 52, 52);
        }

        create() : void {
            this.gameState = {
                entities : {
                    misc: [],
                    turtles : [new Turtle(10, 10), new Turtle(20, 20)],
                    chairs : [],
                    tables: [new Table(20, 10)]
                }
            };
            this.controllers = [new TurtleController()];
            // Set controllers
            this.controllers.forEach((function (controller : Controller) { controller.initialize(this.gameState); }).bind(this));
            // Create sprites for all entities
            applyOnSubelements(this.gameState.entities, (item : Entity) : void => item.assignSprite());
        }

        update() : void {
            // Update controllers
            this.controllers.forEach(function (controller : Controller) { controller.update(1.0/60); });
            // Update drawing
            applyOnSubelements(this.gameState.entities, (item : Entity) : void => item.updateView());
        }
    }

    var turtleTimeGame : TurtleTimeGame = new TurtleTimeGame();
    export var game : Game = new Game(540, 960, Phaser.AUTO, '', {preload: turtleTimeGame.preload, create: turtleTimeGame.create, update: turtleTimeGame.update});
}
