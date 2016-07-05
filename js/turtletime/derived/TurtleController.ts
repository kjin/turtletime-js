module TurtleTime {
    export class TurtleController extends Controller {
        initialize(gameState : GameState, gameView : Array<BaseView>) : void {
            this._readState = {
                inputState: gameState.inputState,
                selectionModel: gameState.selectionModel
            };
            this._writeState = {
                selectionModel: gameState.selectionModel,
                turtles: gameState.entities.turtles
            };
        }

        update(dt : number) : void {
            var inputState = this._readState.inputState;
            this._writeState.turtles.forEach(
                (turtle : Turtle) : void => {
                    turtle.behavior.update();
                    if (this._readState.selectionModel.entity == turtle) {
                        turtle.currentStatus = "selected";
                    } else {
                        turtle.currentStatus = "normal";
                    }
                    if (turtle.view.contains(inputState.inputX, inputState.inputY)) {
                        if (inputState.isPressed) {
                            turtle.currentStatus = "highlighted";
                        } else {
                            turtle.currentStatus = "over";
                        }
                        if (inputState.justReleased) {
                            if (this._writeState.selectionModel.entity == turtle) {
                                this._writeState.selectionModel.entity = null;
                            } else {
                                this._writeState.selectionModel.entity = turtle;
                            }
                        }
                    }
                }
            );
        }
    }
}