module TurtleTime {
    import DisplayObject = PIXI.DisplayObject;
    export abstract class BaseView {
        protected _width : number;
        protected _height : number;

        abstract update() : void;

        abstract contains(x : number, y : number) : boolean;

        get width() : number { return this._width; }

        get height() : number { return this._height; }

        abstract getLayerNumber() : number;
        
        abstract enumerateGameObjects() : Array<DisplayObject>;

        abstract onResizeViewport(oldWidth : number, oldHeight : number, newWidth : number, newHeight : number) : void;
    }
}