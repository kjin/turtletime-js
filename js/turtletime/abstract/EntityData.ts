module TurtleTime {
    export interface EntityData {
        position:Array<number>,
        direction:number,
        actionStatus:string,
        appearanceID:string
    }

    // TODO Come up with a way to easily serialize data without copying a lot of code
    export interface DoorEntityData extends EntityData {
        turtleEntryRate: number
    }
}