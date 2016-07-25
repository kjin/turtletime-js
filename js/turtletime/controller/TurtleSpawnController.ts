//<reference path="../core/Controller.ts"/>
//<reference path="../model/GameState.ts"/>
//<reference path="../model/Doodads.ts"/>
//<reference path="../model/Turtle.ts"/>
//<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    export class TurtleSpawnController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._readState = {
                doors: gameState.entities.doors,
                chairs: gameState.entities.chairs
            };
            this._writeState = {
                turtles: gameState.entities.turtles
            };
        }

        update(dt:number):void {
            // temporary - if greenie2 is already there, just stop everything
            if (this._writeState.turtles.underlyingArray.length > 1) {
                return;
            }

            var TURTLE_SPAWN_PROBABILITY_PER_FRAME = 1 - Math.pow(1 - TURTLE_SPAWN_PROBABILITY_PER_SECOND, dt); // hacky ._.
            if (Math.random() < TURTLE_SPAWN_PROBABILITY_PER_FRAME) {
                // pick a random door
                var door : Door = getRandomElement<Door>(this._readState.doors.underlyingArray);
                // pick a random seat to move to
                var chair : Chair = getRandomElement<Chair>(this._readState.chairs.underlyingArray);
                this._writeState.turtles.add({
                    position: [door.position.x, door.position.y],
                    direction: Direction.getDirectionalString(door.direction),
                    appearanceID: "greenie2",
                    actionStatus: "stand",
                    additionalData: {
                        targetPosition: [chair.position.x, chair.position.y]
                    }
                });
            }
        }
    }
}