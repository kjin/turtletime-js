///<reference path="../../defs/phaser.comments.d.ts"/>

module TurtleTime {
    export interface EntityData {
        position:Array<number>,
        direction:string,
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

    export interface UIContainerData {
        anchor: Array<number>,
        position: Array<string>,
        size: Array<string>
    }

    export interface UISpriteData {
        spriteID: string,
        tint : number
    }

    export interface UITextData {
        text: string,
        justify: Array<number>,
        tint: string
    }

    export interface UIAppearanceData {
        normal: UISpriteData|UITextData|{}
    }

    export interface UIData {
        id: string,
        container: UIContainerData,
        appearance: UIAppearanceData,
        children: Array<UIData>
    }

    /**
     * Data about each individual turtle.
     */
    export interface TurtleData {
        name: string,
        description: string,
        likes: Array<string>,
        dislikes: Array<string>
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
        room: RoomData
    }

    /**
     * Static, globally-accessible data.
     */
    export interface GameData {
        turtleData: Map<string, TurtleData>,
        spriteSpecs: SpriteData,
        roomScale: Array<number>,
        maxRoomSize: Point,
        screenSize: Point
    }
}