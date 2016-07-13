///<reference path="../core/EntityModel.ts"/>
///<reference path="../data/DataDefinitions.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class Turtle extends EntityModel {
        intermediateTargetPosition : Point;
        targetPosition : Point;
        chair : Chair;
        // put turtle to sleep if it can't find a path to an object
        sleep : number;

        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.currentStatus = 'normal';
            this.intermediateTargetPosition = new Point(this.position.x, this.position.y);
            this.targetPosition = new Point(entityData.additionalData.targetPosition[0], entityData.additionalData.targetPosition[1]);
            this.sleep = 0;
        }

        getEntityClass() : EntityType { return EntityType.Turtle; }

        getAdditionalData() : any {
            return {
                targetPosition: [this.targetPosition.x, this.targetPosition.y]
            };
        }
    }
}