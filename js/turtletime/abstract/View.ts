namespace TurtleTime {
    export abstract class BaseView {
        abstract update() : void;

        abstract contains(x : number, y : number) : boolean;

        abstract getLayerNumber() : number;

        abstract bringToTop() : void;
    }

    export abstract class View<T extends VisibleModel> {
        model : T;

        constructor(model : T) {
            this.model = model;
            this.model.view = this;
        }

        update() : void {}

        contains(x : number, y : number) : boolean { return false; }

        getLayerNumber() : number { return this.model.layerNumber; }

        abstract bringToTop() : void;
    }
}