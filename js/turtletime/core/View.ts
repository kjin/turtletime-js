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

        getLayerNumber() : number { return this.model.layerNumber; }

        onResizeViewport(oldWidth:number, oldHeight:number, newWidth:number, newHeight:number):void {}
    }
}