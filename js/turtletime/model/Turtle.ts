///<reference path="../core/EntityModel.ts"/>
///<reference path="../data/DataDefinitions.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class Turtle extends EntityModel {
        intermediateTargetPosition : Point;
        targetPosition : Point;
        // put turtle to sleep if it can't find a path to an object
        sleep : number;
        mood : Mood;
        timeUntilDecision : number;
        status : string;

        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.selectionStatus = 'normal';
            this.intermediateTargetPosition = new Point(this.position.x, this.position.y);
            this.targetPosition = new Point(entityData.additionalData.targetPosition[0], entityData.additionalData.targetPosition[1]);
            this.mood = new Mood(entityData.additionalData.mood);
            this.status = entityData.additionalData.status;
            this.timeUntilDecision = 0;
            this.sleep = 0;
        }

        atTargetPosition() : boolean {
            return this.position.x == this.targetPosition.x && this.position.y == this.targetPosition.y;
        }

        getEntityClass() : EntityType { return EntityType.Turtle; }

        setTargetPosition(x : number, y : number) : void {
            this.targetPosition.x = x;
            this.targetPosition.y = y;
        }

        getAdditionalData() : any {
            return {
                targetPosition: [this.targetPosition.x, this.targetPosition.y],
                mood: this.mood.serialize(),
                status: this.status
            };
        }
    }
}