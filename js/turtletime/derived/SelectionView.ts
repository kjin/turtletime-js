///<reference path="../abstract/View.ts"/>

import Sprite = Phaser.Sprite;

module TurtleTime {
    import Text = Phaser.Text;
    export class SelectionView extends View<SelectionModel> {
        private _text : Text;

        constructor(model : SelectionModel) {
            super(model);
            this._text = game.add.text(0, 600, "Example text", { fontSize: '12px', fill: '#ffffff' });
        }

        contains(x : number, y : number) : boolean {
            return false;
        }

        update() : void {
            if (this.model.entity != null) {
                this._text.text = this.model.entity.position.toString();
            } else {
                this._text.text = "Example text";
            }
        }

        bringToTop() : void {
            this._text.bringToTop();
        }
    }
}