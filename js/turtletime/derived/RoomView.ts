module TurtleTime {
    export class RoomView extends View<RoomModel> {
        private _graphics : Phaser.Graphics;
        
        constructor(model : RoomModel) {
            super(model);
            this._graphics = game.add.graphics(0, 0);
            this._graphics.lineStyle(1, 0xffffff, 1);
            this._graphics.beginFill(0xffffff, 0.5);
            var topLeft : Point = roomToScreen(new Point(0, 0));
            var bottomRight : Point = roomToScreen(new Point(this.model.width, this.model.height));
            this._graphics.drawRect(topLeft.x, topLeft.y, bottomRight.x - topLeft.x, bottomRight.y - topLeft.y);
            this._graphics.endFill();
        }

        update():void {
        }

        bringToTop():void {}
    }
}