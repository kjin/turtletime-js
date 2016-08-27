///<reference path="../../defs/phaser.comments.d.ts"/>
///<reference path="UIData.ts"/>
///<reference path="SpriteSpecs.ts"/>

module TurtleTime {
    export interface EntityData {
        position:Array<number>,
        direction?:string,
        actionStatus?:string,
        appearanceID:string,
        additionalData?:any
    }

    export interface RoomData {
        size: Array<number>,
        wallHeight: number,
        floorPattern: string,
        wallPattern: string
    }

    /**
     * Data about each individual turtle.
     */
    export interface TurtleData {
        id: string,
        name: string,
        description: string,
        likes: Array<string>,
        dislikes: Array<string>,
        rarity: number
    }

    export interface FoodData {
        id: string,
        name: string,
        description: string,
        hp: number
    }

    /**
     * User-specific data; serializable.
     */
    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>,
            doors: Array<EntityData>,
            wallDecor: Array<EntityData>,
            roomDecor: Array<EntityData>,
            food: Array<EntityData>
        },
        room: RoomData,
        progress: UserProgressData,
        timestamp: number,
        spawnData: TurtleSpawnModel
    }

    /**
     * Static, globally-accessible data.
     */
    export interface GameData {
        turtleData: Map<string, TurtleData>,
        foodData: Map<string, FoodData>,
        spriteSpecs: SpriteData,
        roomScale: Array<number>,
        uiTemplates: Map<string, UIData>,
        maxRoomSize: Point,
        screenSize: Point,
        animations: Map<string, Array<SpriteAnimation> >
    }
}