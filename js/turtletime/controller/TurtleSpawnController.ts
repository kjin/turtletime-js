//<reference path="../core/Controller.ts"/>
//<reference path="../model/GameState.ts"/>
//<reference path="../model/Doodads.ts"/>
//<reference path="../model/Turtle.ts"/>
//<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    export class TurtleSpawnController extends Controller<GameState> {
        turtles : Array<TurtleData>;
        currentIndex : number = 0;
        time : number = 0;

        initialize(gameState:GameState):void {
            this._readState = {
                doors: gameState.entities.doors,
                chairs: gameState.entities.chairs
            };
            this._writeState = {
                turtles: gameState.entities.turtles
            };
            this.turtles = [];
            GAME_ENGINE.globalData.turtleData.forEach((turtle : TurtleData) => {
                this.turtles.push(turtle);
            });
        }

        private static rarityToProbability(rarity : number) : number {
            return Math.pow(1 - rarity / 100.0, 8);
        }

        update(dt:number):void {
            if (this.time < 1) {
                this.time += dt;
                return;
            }
            this.time--;
            this.currentIndex++;
            if (this.currentIndex >= this.turtles.length) {
                this.currentIndex = 0;
            }
            var possibleTurtle : TurtleData = this.turtles[this.currentIndex];
            // check if the turtle's already there by any chance
            var exists = false;
            this._writeState.turtles.forEach((turtle : Turtle) : void => {
                if (turtle.appearanceID == possibleTurtle.id) {
                    exists = true;
                }
            });
            if (exists) {
                return;
            }
            if (Math.random() < TurtleSpawnController.rarityToProbability(possibleTurtle.rarity)) {
                // pick a random door
                var door : Door = getRandomElement<Door>(this._readState.doors.underlyingArray);
                this._writeState.turtles.add({
                    position: [door.position.x, door.position.y],
                    direction: Direction.getDirectionalString(door.direction),
                    appearanceID: possibleTurtle.id,
                    actionStatus: "stand",
                    additionalData: {
                        targetPosition: [door.position.x, door.position.y], // doesn't matter
                        mood: { happy: 3 },
                        status: "justEntered"
                    }
                });
            }
        }
    }
}