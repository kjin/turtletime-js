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
        public dimensions : Point;
        public currentAction : string;
        public currentStatus : string;
        public spriteSpecs : SpriteSpecs;
        public appearanceID : string;

        get animationString() : string {
            return Direction.getDirectionalString(this.direction) + "-" + this.currentAction;
        }

        initialize(entityData : EntityData) : void {
            this.position = new Point(entityData.position[0], entityData.position[1]);
            this.direction = Direction.getDirection(entityData.direction);
            this.spriteSpecs = GAME_ENGINE.globalData.spriteSpecs
                .getSpriteSpecs(EntityType.toString(this.getEntityClass()), entityData.appearanceID);
            // set default specs in case they're not filled in
            if (!this.spriteSpecs.hasOwnProperty("anchor")) { this.spriteSpecs.anchor = [0.5, 0.5]; }
            if (!this.spriteSpecs.hasOwnProperty("anchor")) { this.spriteSpecs.dimensions = [1, 1]; }
            if (!this.spriteSpecs.hasOwnProperty("scale")) { this.spriteSpecs.scale = 1; }
            if (!this.spriteSpecs.hasOwnProperty("path")) { this.spriteSpecs.path = this.spriteSpecs.spriteID + ".png"; } // lol
            if (!this.spriteSpecs.hasOwnProperty("animations")) { this.spriteSpecs.animations = [ { name: "default",  frames: [ { direction: "all",  frames: [0] } ] } ]; }
            this.dimensions = new Point(this.spriteSpecs.dimensions[0], this.spriteSpecs.dimensions[1]);
            this.appearanceID = entityData.appearanceID;
            this.currentAction = entityData.actionStatus;
            this.currentStatus = "hidden";
            this.layerNumber = LAYER_SPRITE;
        }

        abstract getEntityClass() : EntityType;

        overlaps(other : EntityModel) : boolean {
            return new Rectangle(this.position.x, this.position.y, this.dimensions.x - 0.5, this.dimensions.y - 0.5)
                .intersects(new Rectangle(other.position.x, other.position.y, other.dimensions.x - 0.5, other.dimensions.y - 0.5), 0);
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
