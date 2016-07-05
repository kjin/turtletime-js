module TurtleTime {
    export abstract class Controller {
        protected _readState : any;
        protected _writeState : any;

        abstract initialize(gameState : GameState, gameView : Array<BaseView>) : void;

        abstract update(dt : number) : void;
    }
}