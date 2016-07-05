module TurtleTime {
    export class TurtleSpawnController extends Controller {
        initialize(gameState:GameState, gameView : Array<BaseView>):void {
            this._readState = {
                doors: gameState.entities.doors,
                chairs: gameState.entities.chairs
            };
            this._writeState = {
                turtles: gameState.entities.turtles,
                gameView: gameView
            };
        }

        update(dt:number):void {
            var TURTLE_SPAWN_PROBABILITY_PER_FRAME = 1 - Math.pow(1 - TURTLE_SPAWN_PROBABILITY_PER_SECOND, dt); // hacky ._.
            if (Math.random() < TURTLE_SPAWN_PROBABILITY_PER_FRAME) {
                // pick a random door
                var door : Door = getRandomElement<Door>(this._readState.doors);
                var turtle = new Turtle({
                    position: [door.position.x, door.position.y],
                    direction: door.direction,
                    appearanceID: "turtleBasic",
                    actionStatus: "stand"
                });
                this._writeState.turtles.push(turtle);
                this._writeState.gameView.push(new EntityView(turtle));
            }
        }
    }
}