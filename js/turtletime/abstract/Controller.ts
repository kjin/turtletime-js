module TurtleTime {
    export abstract class Controller {
        abstract initialize(gameState : GameState) : void;

        abstract update(dt : number) : void;
    }

    export abstract class GameController<R, W> extends Controller {
        protected _readState : R;
        protected _writeState : W;
    }
}