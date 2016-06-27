module TurtleTime {
    import ReadState = TurtleTime.InputController.ReadState;
    import WriteState = TurtleTime.InputController.WriteState;
    export class InputController extends GameController<ReadState, WriteState> {
        initialize(gameState:TurtleTime.GameState):void {
        }

        update(dt:number):void {
        }
    }

    export module InputController {
        export interface ReadState {

        }

        export interface WriteState {
            
        }
    }
}