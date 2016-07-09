///<reference path="../core/View.ts"/>
///<reference path="../model/InfoboxModel.ts"/>

import Sprite = Phaser.Sprite;

module TurtleTime {
    import Text = Phaser.Text;
    export class InfoboxView extends View<InfoboxModel> {
        private _text : Text;

        constructor(model : InfoboxModel) {
            super(model);
            this._text = game.add.text(0, 400, "", { fontSize: '12px', fill: '#ffffff' });
        }

        contains(x : number, y : number) : boolean {
            return false;
        }

        update() : void {
            if (this.model.text != null) {
                this._text.text = this.model.text;
            } else {
                this._text.text = "";
            }
        }

        bringToTop() : void {
            this._text.bringToTop();
        }
    }
}