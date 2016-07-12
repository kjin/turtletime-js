///<reference path="../data/Constants.ts"/>
///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    export class DebugView extends BaseView {
        private _text : Phaser.Text;

        constructor() {
            super();
            this._text = GAME_ENGINE.game.add.text(0, 0, "", { fontSize: '12px', fill: '#00ff00' });
        }

        update():void {
            this._text.text = debugText;
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_DEBUG;
        }

        bringToTop():void {
            this._text.bringToTop();
        }
    }
}