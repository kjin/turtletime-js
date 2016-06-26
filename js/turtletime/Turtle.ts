module TurtleTime {
    export class Turtle extends Entity {
        constructor(x:number, y:number) {
            this.position = new Point(x, y);
        }
    }
}