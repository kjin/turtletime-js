module TurtleTime {
    export abstract class Controller<T> {
        protected _readState : any;
        protected _writeState : any;

        abstract initialize(gameState : T) : void;

        abstract update(dt : number) : void;
    }
}