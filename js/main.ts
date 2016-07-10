///<reference path="defs/phaser.comments.d.ts"/>
///<reference path="turtletime/Game.ts"/>

import Game = Phaser.Game;
namespace TurtleTime {

    class TurtleTimeGame {
        gameState : GameState;
        controllers : Array<Controller<GameState>>;
        views : GameView;
        time : number;

        create() : void {
            this.time = 0;
            this.gameState = loadModel();
            this.controllers = createControllers();
            this.views = createView(this.gameState);
            // Set controllers
            this.controllers.forEach((function (controller : Controller<GameState>) { controller.initialize(this.gameState); }).bind(this));
        }

        update() : void {
            debugText = "";
            // Update controllers
            this.controllers.forEach(function (controller : Controller<GameState>) { controller.update(1.0/60); });
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
    var scale_factor : number = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 0.5 : 1;
    export var game : Game = new Game(window.innerWidth * scale_factor, window.innerHeight * scale_factor, Phaser.AUTO, '', {preload: preloadGame, create: turtleTimeGame.create, update: turtleTimeGame.update});
}
