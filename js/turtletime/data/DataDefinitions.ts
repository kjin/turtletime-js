///<reference path="../../defs/phaser.comments.d.ts"/>

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

    export interface TurtleData {
        name: string,
        description: string,
        likes: Array<string>,
        dislikes: Array<string>
    }

    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>,
            doors: Array<EntityData>
        },
        room: RoomData
    }

    export interface GameData {
        turtleData: Map<string, TurtleData>,
        spriteSpecs: SpriteData,
        roomScale: number,
        maxRoomSize: Point,
        screenSize: Point
    }
}