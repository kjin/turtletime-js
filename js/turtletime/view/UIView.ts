///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    import Graphics = Phaser.Graphics;
    class UIViewNode extends View<UIModel> {
        screenDimensions : Rectangle;
        children : Array<UIViewNode>;
        private _text : Phaser.Text;
        private _sprite : EntitySpriteWrapper;
        private _editMode : boolean;
        protected _treeHeight : number;

        constructor(model : UIModel) {
            super(model);
            this._editMode = checkGlobalOption('uiEdit');
            this.screenDimensions = new Rectangle(0, 0, 0, 0);
            this.children = model.children.map((childData : UIModel) : UIViewNode => new UIViewNode(childData));
            if (this.children.length > 0) {
                this._treeHeight = this.children[0]._treeHeight + 1;
            } else {
                this._treeHeight = 0;
            }
            if (this._editMode) {
                this._text = GAME_ENGINE.game.add.text(0, 0, "", {
                    font: 'Courier New',
                    fontSize: '12px',
                    fill: '#ffffff',
                    wordWrap: true
                });
            } else {
                if (this.model.appearance.normal.text != null) {
                    this._text = GAME_ENGINE.game.add.text(0, 0, this.model.appearance.normal.text.text, {
                        font: 'Courier New',
                        fontSize: '12px',
                        fill: '#ffffff',
                        wordWrap: true
                    });
                    this._text.align = this.model.appearance.normal.text.justify;
                    this._text.boundsAlignH = this.model.appearance.normal.text.justify;
                    this._text.name = "" + (3100 - this._treeHeight);
                }
                if (this.model.appearance.normal.sprite != null) {
                    this._sprite = new EntitySpriteWrapper();
                    this._sprite.reset(GAME_ENGINE.globalData.spriteSpecs.getSpriteSpecs("ui", this.model.appearance.normal.sprite.spriteID));
                    this._sprite.underlyingSprite.name = "" + (2100 - this._treeHeight);
                }
            }
        }

        assignScreenDimensions(parentDimensions : Rectangle) : void {
            this.screenDimensions = this.model.container.eval(parentDimensions);
            if (this._text != null) {
                this._text.setTextBounds(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                this._text.wordWrapWidth = this.screenDimensions.width;
            } else if (this._sprite != null) {
                this._sprite.x = this.screenDimensions.x + this.screenDimensions.width * this.model.container.anchorX;
                this._sprite.y = this.screenDimensions.y + this.screenDimensions.height * this.model.container.anchorY;
            }
            this.children.forEach((child : UIViewNode) : void => child.assignScreenDimensions(this.screenDimensions));
        }

        contains(x:number, y:number):boolean {
            return this.screenDimensions.contains(x, y);
        }

        draw(graphics : Graphics, interactionModel : UIInteractionModel, parentVisible : boolean = true):void {
            if (this._editMode) {
                graphics.lineStyle(2, 0xffffff, 1.0);
                if (interactionModel.mouseOver(this.model)) {
                    this._text.text = this.model.id;
                    graphics.beginFill(0xff0000, 0.2);
                } else if (this.model.visible && parentVisible) {
                    this._text.text = "";
                    graphics.beginFill(0xffffff, 0.05);
                } else {
                    graphics.lineStyle(1, 0xffffff, 0.5);
                    graphics.beginFill(0x000000, 0.05);
                }
                graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                graphics.endFill();
            } else {
                if (this.model.appearance.normal.text != null) {
                    this._text.visible = parentVisible && this.model.visible;
                    this._text.text = this.model.appearance.normal.text.text;
                    this._text.tint = this.model.appearance.normal.text.tint;
                }
                if (this.model.appearance.normal.sprite != null) {
                    this._sprite.visible = parentVisible && this.model.visible;
                    this._sprite.tint = this.model.appearance.normal.sprite.tint;
                }
                if (this.model.appearance.normal.geometry != null && parentVisible && this.model.visible) {
                    var geometry : UIGeometry = this.model.appearance.normal.geometry;
                    graphics.lineStyle(geometry.lineWeight, geometry.lineColor, 1.0);
                    graphics.beginFill(geometry.fillColor, 1.0);
                    if (geometry.cornerRadius == 0) {
                        graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                    } else {
                        graphics.drawRoundedRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height, geometry.cornerRadius);
                    }
                    graphics.endFill();
                }
            }
            this.children.forEach((child : UIViewNode) : void => child.draw(graphics, interactionModel, this.model.visible && parentVisible));
        }

        update():void {
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            var result : Array<PIXI.DisplayObject> = [];
            if (this._text != null) {
                result = [ this._text ];
            } else if (this._sprite != null) {
                result = [ this._sprite.underlyingSprite ];
            }
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
        private _editMode : boolean;
        private _interactionModel : UIInteractionModel;

        constructor(model : UIModel, interactionModel : UIInteractionModel) {
            super();
            this._interactionModel = interactionModel;
            this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
            this._graphics.name = "1000";
            this._rootNode = new UIViewNode(model);
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
            this._editMode = checkGlobalOption('uiEdit');
        }

        update():void {
            this._graphics.clear();
            this._rootNode.draw(this._graphics, this._interactionModel);
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

        onResizeViewport(oldWidth : number, oldHeight : number, newWidth : number, newHeight : number):void {
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
        }
    }
}