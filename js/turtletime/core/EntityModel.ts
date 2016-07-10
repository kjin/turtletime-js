///<reference path="../Utils.ts"/>
///<reference path="./VisibleModel.ts"/>
///<reference path="../data/DataDefinitions.ts"/>
///<reference path="../data/SpriteSpecs.ts"/>

import Point = Phaser.Point;

module TurtleTime {
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
            return Direction.getFirstCharacter(this.direction) + "-" + this.currentAction;
        }

        initialize(entityData : EntityData) : void {
            this.position = new Point(entityData.position[0], entityData.position[1]);
            this.direction = entityData.direction;
            this.spriteSpecs = gameData.spriteSpecs.getSpriteSpecs(this.getEntityClass(), entityData.appearanceID);
            this.dimensions = new Point(this.spriteSpecs.dimensions[0], this.spriteSpecs.dimensions[1]);
            this.appearanceID = entityData.appearanceID;
            this.currentAction = entityData.actionStatus;
            this.currentStatus = "hidden";
            this.layerNumber = LAYER_SPRITE;
        }

        abstract getEntityClass() : string;

        onWall() : boolean {
            return false;
        }

        protected abstract getAdditionalData() : any;
        
        serialize() : EntityData {
            return {
                position: [this.position.x, this.position.y],
                direction: this.direction,
                appearanceID: this.appearanceID,
                actionStatus: this.currentAction,
                additionalData: this.getAdditionalData()
            };
        }
    }
}
