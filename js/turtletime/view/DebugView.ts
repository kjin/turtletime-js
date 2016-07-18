///<reference path="../data/Constants.ts"/>
///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    import DisplayObject = PIXI.DisplayObject;
    export class DebugView extends BaseView {
        private _text : Phaser.Text;

        constructor() {
            super();
            this._text = GAME_ENGINE.game.add.text(0, 0, "", { fontSize: '12px', fill: '#00ff00' });
        }

        update():void {
            this._text.text = GAME_ENGINE.debugText;
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_DEBUG;
        }

        enumerateGameObjects():Array<DisplayObject> {
            return [this._text];
        }

        onResizeViewport(oldWidth:number, oldHeight:number, newWidth:number, newHeight:number):void {}
    }
}