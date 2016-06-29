///<reference path="defs/phaser.comments.d.ts"/>
///<reference path="turtletime/Game.ts"/>

import Game = Phaser.Game;
namespace TurtleTime {
    class TurtleTimeGame {
        gameState : GameState;
        controllers : Array<Controller>;
        views : Array<BaseView>;

        create() : void {
            this.gameState = createModel();
            this.controllers = createControllers();
            this.views = initializeView(this.gameState);
            this.views.sort((a : BaseView, b : BaseView) : number => (a.getLayerNumber() - b.getLayerNumber()));
            this.views.forEach((view : BaseView) => view.bringToTop());
            // Set controllers
            this.controllers.forEach((function (controller : Controller) { controller.initialize(this.gameState); }).bind(this));
        }

        update() : void {
            // Update controllers
            this.controllers.forEach(function (controller : Controller) { controller.update(1.0/60); });
            this.views.forEach(function (view : BaseView) { view.update(); })
        }
    }
    var turtleTimeGame : TurtleTimeGame = new TurtleTimeGame();
    export var game : Game = new Game(540, 960, Phaser.AUTO, '', {preload: preloadGame, create: turtleTimeGame.create, update: turtleTimeGame.update});
}
