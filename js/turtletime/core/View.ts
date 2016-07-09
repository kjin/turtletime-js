///<reference path="BaseView.ts"/>
///<reference path="VisibleModel.ts"/>

namespace TurtleTime {
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