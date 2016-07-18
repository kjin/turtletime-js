///<reference path="../core/View.ts"/>
module TurtleTime {
    // kind of a dummy class
    export class CameraView extends View<CameraModel> {
        constructor(model : CameraModel) {
            super(model);
        }

        update():void {
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return 0;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return [];
        }
    }
}