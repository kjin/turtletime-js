module TurtleTime {
    export abstract class Controller<T> {
        protected _readState : any;
        protected _writeState : any;

        abstract initialize(gameState : T) : void;

        abstract update(dt : number) : void;
    }

    export abstract class QuickController<T> extends Controller<T> {
        private _gameState : T;

        initialize(gameState : T) : void {
            this._gameState = gameState;
            this.initializeInternal(this._gameState);
        }

        update(dt : number) : void {
            this.updateInternal(this._gameState, dt);
        }

        protected initializeInternal(gameState : T) : void {}

        protected abstract updateInternal(gameState : T, dt : number) : void;
    }
}