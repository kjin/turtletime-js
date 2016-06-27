/**
 * Created by kjin on 6/27/16.
 */

module TurtleTime {
    export module Behavior {
        export interface LoopBehaviorSegment {
            lowerBoundT : number,
            upperBoundT : number,
            behavior : (innerT : number) => void
        }

        export class LoopBehavior {
            t : number = 0;
            dt : number;
            segments : Array<LoopBehaviorSegment>;

            constructor(dt : number, segments : Array<LoopBehaviorSegment>) {
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