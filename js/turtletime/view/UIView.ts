///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    import Graphics = Phaser.Graphics;
    class UIViewNode extends View<UIModel> {
        screenDimensions : Rectangle;
        children : Array<UIViewNode>;
        private _text : Phaser.Text;

        constructor(model : UIModel) {
            super(model);
            this.screenDimensions = new Rectangle(0, 0, 0, 0);
            this.children = model.children.map((childData : UIModel) : UIViewNode => new UIViewNode(childData));
            this._text = GAME_ENGINE.game.add.text(0, 0, "", {
                font: 'Courier New',
                fontSize: '12px',
                fill: '#ffffff',
                wordWrap: true
            });
        }

        assignScreenDimensions(parentRectangle : Rectangle) : void {
            this.screenDimensions.x = parentRectangle.x + parentRectangle.width * this.model.internalDimensions.x;
            this.screenDimensions.y = parentRectangle.y + parentRectangle.height * this.model.internalDimensions.y;
            this.screenDimensions.width = parentRectangle.width * this.model.internalDimensions.width;
            this.screenDimensions.height = parentRectangle.height * this.model.internalDimensions.height;
            this._text.setTextBounds(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
            this._text.wordWrapWidth = this.screenDimensions.width;
            this.children.forEach((child : UIViewNode) : void => child.assignScreenDimensions(this.screenDimensions));
        }

        contains(x:number, y:number):boolean {
            return this.screenDimensions.contains(x, y);
        }

        draw(graphics : Graphics):void {
            if (this.model.visible) {
                graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                this.children.forEach((child : UIViewNode) : void => child.draw(graphics));
            }
            this._text.visible = this.model.visible;
            this._text.text = this.model.text;
        }

        update():void {
        }

        bringToTop():void {
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            var result : Array<PIXI.DisplayObject> = [ this._text ];
            // I hate this code why did it take me so much time to write this
            this.children.map((child : UIViewNode) : Array<PIXI.DisplayObject> => child.enumerateGameObjects())
                .forEach((element : Array<PIXI.DisplayObject>) : void => element
                    .forEach((innerElement : PIXI.DisplayObject) : void => { result.push(innerElement); return; }));
            return result;
        }
    }

    export class UIView extends BaseView {
        private _graphics : Graphics;
        private _rootNode : UIViewNode;

        constructor(model : UIModel) {
            super();
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
            this._rootNode = new UIViewNode(model);
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
        }

        update():void {
            this._graphics.clear();
            this._graphics.lineStyle(2, 0xffffff, 1.0);
            this._graphics.beginFill(0xffffff, 0.05);
            this._rootNode.draw(this._graphics);
            this._graphics.endFill();
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_UI;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return this._rootNode.enumerateGameObjects().concat(this._graphics);
        }
    }
}