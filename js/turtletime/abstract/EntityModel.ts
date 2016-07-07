///<reference path="VisibleModel.ts"/>

import Point = Phaser.Point;

module TurtleTime {
    /**
     * Represents any physical object in the cafe.
     */
    export abstract class EntityModel extends VisibleModel {
        public position : Point;
        public direction : Direction;
        public currentAction : string;
        public currentStatus : string;
        public spriteSpecs : SpriteSpecs;
        private _appearanceID : string;

        initialize(entityData : EntityData) : void {
            this.position = new Point(entityData.position[0], entityData.position[1]);
            this.direction = entityData.direction;
            this.spriteSpecs = gameData.spriteSpecs.getSpriteSpecs(this.getEntityClass(), entityData.appearanceID);
            this._appearanceID = entityData.appearanceID;
            this.currentAction = entityData.actionStatus;
            this.currentStatus = "hidden";
        }

        protected abstract getEntityClass() : string;

        protected abstract getAdditionalData() : any;
        
        serialize() : EntityData {
            return {
                position: [this.position.x, this.position.y],
                direction: this.direction,
                appearanceID: this._appearanceID,
                actionStatus: this.currentAction,
                additionalData: this.getAdditionalData()
            };
        }
    }
}
