///<reference path="../Utils.ts"/>
///<reference path="./VisibleModel.ts"/>
///<reference path="../data/DataDefinitions.ts"/>
///<reference path="../data/SpriteSpecs.ts"/>

import Point = Phaser.Point;

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    /**
     * Represents any physical object in the cafe.
     */
    export abstract class EntityModel extends VisibleModel {
        public position : Point;
        public direction : Direction;
        public shape : Array<boolean>;
        private dimensions : Point;
        public currentAction : string;
        public selectionStatus : string;
        public spriteSpecs : SpriteSpecs;
        public appearanceID : string;

        get width() : number {
            return (this.direction & Direction.Horizontal) ? this.dimensions.y : this.dimensions.x;
        }

        get height() : number {
            return (this.direction & Direction.Horizontal) ? this.dimensions.x : this.dimensions.y;
        }

        get animationString() : string {
            return Direction.getDirectionalString(this.direction) + "-" + this.currentAction;
        }

        initialize(entityData : EntityData) : void {
            this.position = new Point(entityData.position[0], entityData.position[1]);
            this.direction = entityData.hasOwnProperty("direction") ? Direction.getDirection(entityData.direction) : Direction.Down;
            this.spriteSpecs = GAME_ENGINE.globalData.spriteSpecs
                .getSpriteSpecs(EntityType.toString(this.getEntityClass()), entityData.appearanceID);
            // set default specs in case they're not filled in
            if (!this.spriteSpecs.hasOwnProperty("anchor")) { this.spriteSpecs.anchor = [0.5, 0.5]; }
            if (!this.spriteSpecs.hasOwnProperty("dimensions")) { this.spriteSpecs.dimensions = [1, 1]; }
            if (!this.spriteSpecs.hasOwnProperty("scale")) { this.spriteSpecs.scale = 1; }
            if (!this.spriteSpecs.hasOwnProperty("tint")) { this.spriteSpecs.tint = "0xFFFFFF"; }
            if (!this.spriteSpecs.hasOwnProperty("animations")) {
                if (!this.spriteSpecs.hasOwnProperty("animationTemplate")) {
                    this.spriteSpecs.animations = [{name: "default", frames: [{direction: "all", frames: [0]}]}];
                } else {
                    this.spriteSpecs.animations = GAME_ENGINE.globalData.animations.get(this.spriteSpecs.animationTemplate);
                }
            }
            this.dimensions = new Point(this.spriteSpecs.dimensions[0], this.spriteSpecs.dimensions[1]);
            if (!this.spriteSpecs.hasOwnProperty("shape")) {
                this.spriteSpecs.shape = new Array<string>(this.dimensions.y).fill('1'.repeat(this.dimensions.x));
            }
            this.shape = new Array<boolean>(this.dimensions.x * this.dimensions.y); // i kind of hate this
            for (var y = 0; y < this.dimensions.y; y++) {
                for (var x = 0; x < this.dimensions.x; x++) {
                    this.shape[y * this.dimensions.x + x] = this.spriteSpecs.shape[y].charAt(x) == '1';
                }
            }
            this.appearanceID = entityData.appearanceID;
            this.currentAction = entityData.hasOwnProperty("actionStatus") ? entityData.actionStatus : "default";
            this.selectionStatus = "unselectable";
            this.layerNumber = LAYER_SPRITE;
        }

        abstract getEntityClass() : EntityType;

        overlaps(other : EntityModel, precise : boolean = false) : boolean {
            if (!precise) {
                return this.collisionRectangle.intersects(other.collisionRectangle, 0);
            } else {
                var myRectangle : Rectangle = this.collisionRectangle;
                if (!myRectangle.intersects(other.collisionRectangle, 0)) {
                    return false;
                }
                for (var x = myRectangle.left; x < myRectangle.right; x++) {
                    for (var y = myRectangle.top; y < myRectangle.bottom; y++) {
                        if (this.occupiesSpace(x, y) && other.occupiesSpace(x, y)) {
                            return true;
                        }
                    }
                }
                return false;
            }
        }

        private get collisionRectangle() : Rectangle {
            return new Rectangle (this.position.x, this.position.y, this.width - 0.5, this.height - 0.5);
        }

        occupiesSpace(x : number, y : number) : boolean {
            if (x < this.position.x || x >= this.position.x + this.width ||
                y < this.position.y || y >= this.position.y + this.height) {
                return false;
            }
            var ax = Math.floor(x - this.position.x);
            var ay = Math.floor(y - this.position.y);
            return this.shape[ay * this.dimensions.x + ax];
        }

        getAllSpaces() : Array<Point> {
            var result : Array<Point> = [];
            for (var x = this.position.x; x < this.position.x + this.width; x++) {
                for (var y = this.position.y; y < this.position.y + this.height; y++) {
                    if (this.occupiesSpace(x, y)) {
                        result.push(new Point(x, y));
                    }
                }
            }
            return result;
        }
        
        setTargetPosition(x : number, y : number, memo : string) : void {
            this.position.x = x;
            this.position.y = y;
        }

        protected abstract getAdditionalData() : any;
        
        serialize() : EntityData {
            return {
                position: [this.position.x, this.position.y],
                direction: Direction.getDirectionalString(this.direction),
                appearanceID: this.appearanceID,
                actionStatus: this.currentAction,
                additionalData: this.getAdditionalData()
            };
        }
    }
}
