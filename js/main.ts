///<reference path="defs/phaser.comments.d.ts"/>
///<reference path="turtletime/Game.ts"/>
///<reference path="turtletime/core/GameView.ts"/>

import Game = Phaser.Game;
namespace TurtleTime {
    export var debugText : string = "";

    export function debugLog(text : string) {
        debugText += text + "\n";
    }

    class TurtleTimeGame {
        gameState : GameState;
        controllers : Array<Controller>;
        views : GameView;
        time : number;

        create() : void {
            this.time = 0;
            this.gameState = loadModel();
            this.controllers = createControllers();
            this.views = createView(this.gameState);
            // Set controllers
            this.controllers.forEach((function (controller : Controller) { controller.initialize(this.gameState, this.views); }).bind(this));
        }

        update() : void {
            debugText = "";
            // Update controllers
            this.controllers.forEach(function (controller : Controller) { controller.update(1.0/60); });
            for (var property in this.gameState.entities) {
                if (this.gameState.entities.hasOwnProperty(property)) {
                    var entityCollection : AbstractEntityCollection = this.gameState.entities[property];
                    entityCollection.update(this.views);
                }
            }
            this.views.update();
            this.time++;
            // save once per second
            if (this.time % 60 == 0) {
                saveModel(this.gameState);
            }
        }
    }
    var turtleTimeGame : TurtleTimeGame = new TurtleTimeGame();
    export var game : Game = new Game(window.innerWidth, window.innerHeight, Phaser.AUTO, '', {preload: preloadGame, create: turtleTimeGame.create, update: turtleTimeGame.update});
}
