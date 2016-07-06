module TurtleTime {
    import FollowPathBehavior = TurtleTime.Behavior.FollowPathBehavior;

    export class Turtle extends EntityModel {
        behavior : Behavior;
        intermediateTargetPosition : Point;
        targetPosition : Point;

        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.layerNumber = LAYER_SPRITE_TURTLE;
            this.currentStatus = 'normal';
            this.intermediateTargetPosition = new Point(this.position.x, this.position.y);
            this.targetPosition = new Point(entityData.additionalData.targetPosition[0], entityData.additionalData.targetPosition[1]);
            this.behavior = new FollowPathBehavior(this);
        }

        getEntityClass() : string { return "turtle"; }

        getAdditionalData() : any {
            return {};
        }
    }
}