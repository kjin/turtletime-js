namespace TurtleTime {
    export interface EatingArea {
        chair : { chair : Chair, atPosition : Point };
        table : { table : Table, atPosition : Point };
        acrossFrom? : EatingArea; // for now, unused
        turtle? : Turtle;
        food? : Food;
    }
}