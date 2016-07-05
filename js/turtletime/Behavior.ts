/**
 * Created by kjin on 6/27/16.
 */

module TurtleTime {
    export abstract class Behavior {
        abstract update() : void;
    }

    export module Behavior {
        export class FollowPathBehavior extends Behavior {
            turtle : Turtle;

            constructor(turtle : Turtle) {
                super();
                this.turtle = turtle;
            }

            update() : void {
                // If turtle is considered close enough to its intended position, just put it right there.
                if (this.turtle.position.distance(this.turtle.intermediateTargetPosition) < TURTLE_SPEED) {
                    this.turtle.position.set(
                        this.turtle.intermediateTargetPosition.x,
                        this.turtle.intermediateTargetPosition.y
                    );
                    var newDirection : Point = Direction.toVector(Math.floor(Math.random() * 4));
                    this.turtle.intermediateTargetPosition.add(newDirection.x, newDirection.y);
                } else { // move towards intended position
                    var direction : Point = new Point(
                        this.turtle.intermediateTargetPosition.x - this.turtle.position.x,
                        this.turtle.intermediateTargetPosition.y - this.turtle.position.y);
                    direction = direction.normalize().multiply(TURTLE_SPEED, TURTLE_SPEED);
                    this.turtle.position.add(direction.x, direction.y);
                    this.turtle.direction = Direction.toDirection(direction);
                }
            }
        }

        export interface LoopBehaviorSegment {
            lowerBoundT : number,
            upperBoundT : number,
            behavior : (innerT : number) => void
        }

        export class LoopBehavior extends Behavior {
            t : number = 0;
            dt : number;
            segments : Array<LoopBehaviorSegment>;

            constructor(dt : number, segments : Array<LoopBehaviorSegment>) {
                super();
                this.t = 0;
                this.dt = dt;
                this.segments = segments;
            }

            update() : void {
                this.segments.forEach((segment : LoopBehaviorSegment) : void => {
                    if (this.t >= segment.lowerBoundT && this.t <= segment.upperBoundT) {
                        var innerT = (this.t - segment.lowerBoundT) / (segment.upperBoundT - segment.lowerBoundT);
                        segment.behavior(innerT);
                    }
                });
                this.t += this.dt;
                if (this.t > 1) {
                    this.t--;
                } else if (this.t < 0) {
                    this.t++;
                }
            }
        }
    }
}