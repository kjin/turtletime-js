namespace TurtleTime {
    export abstract class BaseView {
        protected _width : number;
        protected _height : number;

        abstract update() : void;

        abstract contains(x : number, y : number) : boolean;

        get width() : number { return this._width; }

        get height() : number { return this._height; }

        abstract getLayerNumber() : number;

        abstract bringToTop() : void;
    }

    export abstract class View<T extends VisibleModel> extends BaseView {
        model : T;

        constructor(model : T) {
            super();
            this.model = model;
            this.model.view = this;
        }

        abstract update() : void;

        contains(x : number, y : number) : boolean { return false; }

        getLayerNumber() : number { return this.model.layerNumber; }

        abstract bringToTop() : void;
    }
}