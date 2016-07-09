module TurtleTime {
    export interface EntityData {
        position:Array<number>,
        direction:number,
        actionStatus:string,
        appearanceID:string,
        additionalData:any
    }

    export interface RoomData {
        size: Array<number>,
        wallHeight: number,
        floorPattern: string,
        wallPattern: string
    }
}