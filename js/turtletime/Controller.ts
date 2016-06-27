module TurtleTime {
    export abstract class Controller {
        abstract update(dt : number) : void;
    }
}