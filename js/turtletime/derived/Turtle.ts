module TurtleTime {
    import LoopBehavior = TurtleTime.Behavior.LoopBehavior;
    export class Turtle extends EntityModel {
        brain : LoopBehavior;

        constructor(entityData : EntityData) {
            super(entityData);
            this.layerNumber = LAYER_SPRITE_TURTLE;
            this.currentStatus = 'normal';
            var side = 4;
            var x = entityData.position[0];
            var y = entityData.position[1];
            // this.brain = new LoopBehavior(0.01, [
            //     {
            //         lowerBoundT: 0,
            //         upperBoundT: 0.5,
            //         behavior: (innerT : number) => {
            //             this.position.x = x + innerT * side;
            //             this.position.y = y;
            //             this.direction = Direction.Right;
            //         }
            //     },
            //     {
            //         lowerBoundT: 0.5,
            //         upperBoundT: 1.0,
            //         behavior: (innerT : number) => {
            //             this.position.x = x + (1 - innerT) * side;
            //             this.position.y = y;
            //             this.direction = Direction.Left;
            //         }
            //     }
            // ]);
            this.brain = new LoopBehavior(0.0025, [
                {
                    lowerBoundT: 0,
                    upperBoundT: 0.25,
                    behavior: (innerT : number) => {
                        this.position.x = x + innerT * side;
                        this.position.y = y;
                        this.direction = Direction.Right;
                    }
                },
                {
                    lowerBoundT: 0.25,
                    upperBoundT: 0.5,
                    behavior: (innerT : number) => {
                        this.position.x = x + side;
                        this.position.y = y + innerT * side;
                        this.direction = Direction.Down;
                    }
                },
                {
                    lowerBoundT: 0.5,
                    upperBoundT: 0.75,
                    behavior: (innerT : number) => {
                        this.position.x = x + (1 - innerT) * side;
                        this.position.y = y + side;
                        this.direction = Direction.Left;
                    }
                },
                {
                    lowerBoundT: 0.75,
                    upperBoundT: 1.0,
                    behavior: (innerT : number) => {
                        this.position.x = x;
                        this.position.y = y + (1 - innerT) * side;
                        this.direction = Direction.Up;
                    }
                }
            ]);
        }

        getEntityClass() : string { return "turtle"; }
    }
}