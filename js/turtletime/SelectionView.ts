module TurtleTime {
    import Text = Phaser.Text;
    export class SelectionView {
        private _text : Text;

        constructor() {
            this._text = game.add.text(0, 0, "Dummy.", { fontSize: '32px', fill: '#ffffff' });
        }

        update(selectionModel : SelectionModel) : void {
            if (selectionModel.entity != null) {
                this._text.text = selectionModel.entity.position.toString();
            }
        }
    }
}