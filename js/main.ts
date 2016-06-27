///<reference path="defs/phaser.comments.d.ts"/>

import Game = Phaser.Game;
import Group = Phaser.Group;
import Point = Phaser.Point;
import Sprite = Phaser.Sprite;

namespace TurtleTime {
    export interface GameState {
        entities : {
            turtles : Array<Turtle>
        }
    }

    export class TurtleTimeGame {
        gameState : GameState;
        controllers : Array<Controller>;

        preload() : void {
            game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
            game.load.image('highlightCircle', 'assets/highlightCircle.png');
        }

        create() : void {
            this.gameState = {
                entities : {
                    turtles : [new Turtle(100, 100), new Turtle(200, 200)]
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
