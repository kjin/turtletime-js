///<reference path="../core/BaseView.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    import Graphics = Phaser.Graphics;
    interface UIFadeData {
        xOffset : number;
        yOffset : number;
        alpha : number;
    }

    class UIViewNode extends View<UIModel> {
        screenDimensions : Rectangle;
        children : Array<UIViewNode>;
        private _graphics : Graphics;
        private _bitmapText : Phaser.BitmapText;
        private _text : Phaser.Text;
        private _sprite : EntitySpriteWrapper;
        private _editMode : boolean;
        private _timeSinceVisiblityChanged : number = 0;
        private _cachedVisibility : boolean = false;
        protected _level : number;

        constructor(model : UIModel, level : number = 0) {
            super(model);
            this._editMode = checkGlobalOption('uiEdit');
            this.screenDimensions = new Rectangle(0, 0, 0, 0);
            this._level = level;
            this.children = model.children.map((childData : UIModel) : UIViewNode => new UIViewNode(childData, level + 1));
            if (this._editMode) {
                this._text = GAME_ENGINE.game.add.text(0, 0, "", {
                    font: 'Courier New',
                    fontSize: '12px',
                    fill: '#ffffff',
                    wordWrap: true
                });
                this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
            } else {
                if (this.model.appearance.normal.text != null) {
                    if (this.model.appearance.normal.text.font != "") {
                        this._bitmapText = GAME_ENGINE.game.add.bitmapText(0, 0,
                            this.model.appearance.normal.text.font, "",
                            this.model.appearance.normal.text.size);
                        this._bitmapText.align = this.model.appearance.normal.text.justify;
                        this._bitmapText.data = this._level * 10 + 3;
                    } else { // fallback
                        this._text = GAME_ENGINE.game.add.text(0, 0, this.model.appearance.normal.text.text, {
                            font: 'Courier New',
                            fontSize: '' + this.model.appearance.normal.text.size + 'px',
                            fill: '#ffffff',
                            wordWrap: true
                        });
                        this._text.align = this.model.appearance.normal.text.justify;
                        this._text.boundsAlignH = this.model.appearance.normal.text.justify;
                        this._text.boundsAlignV = this.model.appearance.normal.text.valign;
                        this._text.data = this._level * 10 + 3;
                    }
                }
                if (this.model.appearance.normal.sprite != null) {
                    this._sprite = new EntitySpriteWrapper();
                    this._sprite.reset(GAME_ENGINE.globalData.spriteSpecs.getSpriteSpecs(this.model.appearance.normal.sprite.category, this.model.appearance.normal.sprite.spriteID));
                    this._sprite.underlyingSprite.data = this._level * 10 + 2;
                }
                if (this.model.appearance.normal.geometry != null) {
                    this._graphics = GAME_ENGINE.game.add.graphics(0, 0);
                    this._graphics.data = this._level * 10 + 1;
                }
            }
        }

        assignScreenDimensions(parentDimensions : Rectangle) : void {
            this.screenDimensions = this.model.container.eval(parentDimensions);
            if (this._text != null) {
                this._text.setTextBounds(0, 0, this.screenDimensions.width, this.screenDimensions.height);
                this._text.wordWrapWidth = this.screenDimensions.width;
            } else if (this._bitmapText != null) {
                this._bitmapText.maxWidth = this.screenDimensions.width;
            }
            this.children.forEach((child : UIViewNode) : void => child.assignScreenDimensions(this.screenDimensions));
        }

        contains(x:number, y:number):boolean {
            return this.screenDimensions.contains(x, y);
        }

        draw(dt : number, interactionModel : UIInteractionModel, parentFadeData : UIFadeData = null, parentVisible : boolean = true):void {
            var fadeData : UIFadeData = null;
            if (this._editMode) {
                this._graphics.clear();
                this._graphics.lineStyle(2, 0xffffff, 1.0);
                if (interactionModel.mouseOver(this.model)) {
                    this._text.text = this.model.id;
                    this._graphics.beginFill(0xff0000, 0.2);
                } else if (this.model.visible && parentVisible) {
                    this._text.text = "";
                    this._graphics.beginFill(0xffffff, 0.05);
                } else {
                    this._graphics.lineStyle(1, 0xffffff, 0.5);
                    this._graphics.beginFill(0x000000, 0.05);
                }
                this._graphics.drawRect(this.screenDimensions.x, this.screenDimensions.y, this.screenDimensions.width, this.screenDimensions.height);
                this._graphics.endFill();
            } else {
                var currentAppearance : UIAppearance = this.model.appearance[this.model.visualState];
                if (this._cachedVisibility != (parentVisible && this.model.visible)) {
                    this._timeSinceVisiblityChanged = 0;
                    this._cachedVisibility = parentVisible && this.model.visible;
                } else {
                    this._timeSinceVisiblityChanged++;
                }
                var t : number = Math.min(this._timeSinceVisiblityChanged * dt / UI_FADE_TIME, 1);
                t = Math.sqrt(t);
                t = this._cachedVisibility ? (1 - t) : t;
                fadeData = {
                    xOffset: t * this.model.fadeVector.x + (!parentFadeData ? 0 : parentFadeData.xOffset),
                    yOffset: t * this.model.fadeVector.y + (!parentFadeData ? 0 : parentFadeData.yOffset),
                    alpha: (1 - t) * (!parentFadeData ? 1 : parentFadeData.alpha)
                };
                if (this._text != null) {
                    this._text.x = this.screenDimensions.x + fadeData.xOffset;
                    this._text.y = this.screenDimensions.y + fadeData.yOffset;
                    this._text.text = currentAppearance.text.text;
                    this._text.tint = currentAppearance.text.tint;
                    this._text.alpha = fadeData.alpha;
                }
                if (this._bitmapText != null) {
                    switch (this._bitmapText.align) {
                        case 'left':
                            this._bitmapText.x = this.screenDimensions.x + fadeData.xOffset;
                            this._bitmapText.anchor.x = 0;
                            break;
                        case 'center':
                            this._bitmapText.x = this.screenDimensions.x + this.screenDimensions.width / 2 + fadeData.xOffset;
                            this._bitmapText.anchor.x = 0.5;
                            break;
                        case 'right':
                            this._bitmapText.x = this.screenDimensions.x + this.screenDimensions.width + fadeData.xOffset;
                            this._bitmapText.anchor.x = 1;
                            break;
                    }
                    switch (this.model.appearance.normal.text.valign) {
                        case 'top':
                            this._bitmapText.y = this.screenDimensions.y + fadeData.yOffset;
                            this._bitmapText.anchor.y = 0;
                            break;
                        case 'middle':
                            this._bitmapText.y = this.screenDimensions.y + this.screenDimensions.height / 2 + fadeData.yOffset;
                            this._bitmapText.anchor.y = 0.5;
                            break;
                        case 'bottom':
                            this._bitmapText.y = this.screenDimensions.y + this.screenDimensions.height + fadeData.yOffset;
                            this._bitmapText.anchor.y = 1;
                            break;
                    }
                    this._bitmapText.text = currentAppearance.text.text;
                    this._bitmapText.tint = currentAppearance.text.tint;
                    this._bitmapText.alpha = fadeData.alpha;
                }
                if (this._sprite != null) {
                    this._sprite.x = this.screenDimensions.x + this.screenDimensions.width / 2 + fadeData.xOffset;
                    this._sprite.y = this.screenDimensions.y + this.screenDimensions.height / 2 + fadeData.yOffset;
                    this._sprite.animation = currentAppearance.sprite.animation;
                    this._sprite.tint = currentAppearance.sprite.tint;
                    this._sprite.alpha = fadeData.alpha;
                }
                if (this._graphics != null) {
                    this._graphics.clear();
                    if (fadeData.alpha > 0) {
                        var geometry:UIGeometry = currentAppearance.geometry;
                        this._graphics.lineStyle(geometry.lineWeight, geometry.lineColor, fadeData.alpha);
                        this._graphics.beginFill(geometry.fillColor, fadeData.alpha);
                        if (geometry.cornerRadius == 0) {
                            this._graphics.drawRect(this.screenDimensions.x + fadeData.xOffset, this.screenDimensions.y + fadeData.yOffset, this.screenDimensions.width, this.screenDimensions.height);
                        } else {
                            this._graphics.drawRoundedRect(this.screenDimensions.x + fadeData.xOffset, this.screenDimensions.y + fadeData.yOffset, this.screenDimensions.width, this.screenDimensions.height, geometry.cornerRadius);
                        }
                        this._graphics.endFill();
                    }
                }
            }
            this.children.forEach((child : UIViewNode) : void => child.draw(dt, interactionModel, parentFadeData, this.model.visible && parentVisible));
        }

        update():void {
            this.model.children.forEach((child : UIModel) : void => {
                if (!child.view) {
                    var viewNode : UIViewNode = new UIViewNode(child, this._level + 1);
                    GAME_ENGINE.views.add(viewNode);
                    child.view = viewNode;
                    this.children.push(viewNode);
                    viewNode.assignScreenDimensions(this.screenDimensions);
                }
                if (child.mobile) {
                    (<UIViewNode>child.view).assignScreenDimensions(this.screenDimensions);
                }
            });
            this.children.forEach((child : UIViewNode) : void => child.update());
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            var result : Array<PIXI.DisplayObject> = [];
            if (this._text != null) {
                result.push(this._text);
            }
            if (this._bitmapText != null) {
                result.push(this._bitmapText);
            }
            if (this._sprite != null) {
                result.push(this._sprite.underlyingSprite);
            }
            if (this._graphics != null) {
                result.push(this._graphics);
            }
            // I hate this code why did it take me so much time to write this
            this.children.map((child : UIViewNode) : Array<PIXI.DisplayObject> => child.enumerateGameObjects())
                .forEach((element : Array<PIXI.DisplayObject>) : void => element
                    .forEach((innerElement : PIXI.DisplayObject) : void => { result.push(innerElement); return; }));
            return result;
        }
    }

    export class MainUIView extends BaseView {
        private _rootNode : UIViewNode;
        private _editMode : boolean;
        private _interactionModel : UIInteractionModel;

        constructor(model : UIModel, interactionModel : UIInteractionModel) {
            super();
            this._interactionModel = interactionModel;
            this._rootNode = new UIViewNode(model);
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
            this._editMode = checkGlobalOption('uiEdit');
        }

        update():void {
            this._rootNode.update();
            this._rootNode.draw(1.0/60, this._interactionModel);
        }

        contains(x:number, y:number):boolean {
            return false;
        }

        getLayerNumber():number {
            return LAYER_UI;
        }

        enumerateGameObjects():Array<PIXI.DisplayObject> {
            return this._rootNode.enumerateGameObjects();
        }

        onResizeViewport(oldWidth : number, oldHeight : number, newWidth : number, newHeight : number):void {
            this._rootNode.assignScreenDimensions(
                new Rectangle(0, 0, GAME_ENGINE.globalData.screenSize.x, GAME_ENGINE.globalData.screenSize.y));
        }
    }
}