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

        constructor(entityData : EntityData) {
            super();
            this.position = entityData.position;
            this.direction = entityData.direction;
            this.spriteSpecs = SpriteSpecs[this.getEntityClass()][entityData.appearanceID];
            this.currentAction = entityData.actionStatus;
            this.currentStatus = "hidden";
        }

        protected abstract getEntityClass() : string;
    }
}
