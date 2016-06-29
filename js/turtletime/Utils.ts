module TurtleTime {
    /**
     * The number of pixels on-screen per cafe unit.
     * @type {number}
     */
    export var COORDINATE_SCALE : number = 20;
    export var LAYER_SPRITE_TURTLE : number = 29;
    export var LAYER_UI : number = 30;
    export var LAYER_SPRITE_CHAIR : number = 20;
    export var LAYER_SPRITE_TABLE : number = 21;

    /**
     * An enumeration of the different directions an entity can face.
     */
    export enum Direction {
        Up = 1,
        Down,
        Left,
        Right
    }

    export var EffectCircleDictionary = {
        unselectable: 0xff0000ff,
        hidden: 0xffffff00,
        normal: 0xffffffff,
        over: 0xff0000ff,
        highlighted: 0xffff00ff,
        selected: 0x00ff00ff
    };

    export var SpriteSpecs = {
        turtles: {
            turtleBasic: {
                spriteID: 'turtle',
                scale: 1.0,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            { direction: Direction.Left, frames: [0] },
                            { direction: Direction.Down, frames: [1] },
                            { direction: Direction.Right, frames: [2] },
                            { direction: Direction.Up, frames: [3] }
                        ]
                    }
                ]
            }
        },
        chairs: {
            chairBasic: {
                spriteID: 'tableandchair',
                scale: 1,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            {direction: Direction.Left, frames: [1]},
                            {direction: Direction.Down, frames: [1]},
                            {direction: Direction.Right, frames: [1]},
                            {direction: Direction.Up, frames: [1]}
                        ]
                    }
                ]
            }
        },
        tables: {
            tableBasic: {
                spriteID: 'tableandchair',
                scale: 1,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            {direction: Direction.Left, frames: [1]},
                            {direction: Direction.Down, frames: [1]},
                            {direction: Direction.Right, frames: [1]},
                            {direction: Direction.Up, frames: [1]}
                        ]
                    }
                ]
            }
        }
    };

    export function setTintAndAlpha(sprite : Sprite, value : number) : void {
        var tint = (value & 0xffffff00) >>> 8;
        var alpha = (value & 0xff) / 255.0;
        sprite.tint = tint;
        sprite.alpha = alpha;
    }

    export function getFirstCharacter(dir : Direction) : string {
        if (dir == Direction.Up) {
            return 'u';
        } else if (dir == Direction.Left) {
            return 'l';
        } else if (dir == Direction.Right) {
            return 'r';
        } else {
            return 'd';
        }
    }

    /**
     * Performs an action to each sub element in an object whose properties are arrays of objects.
     * @param obj An object whose properties are arrays of type T objects.
     * @param action An action to perform on an object of type T.
     */
    export function applyOnSubelements<T>(obj : any, action : (item : T) => void) : void {
        for (var innerArrayName in obj) {
            if (obj.hasOwnProperty(innerArrayName)) {
                var innerArray = obj[innerArrayName];
                innerArray.forEach(function (subElement:T):void {
                    action(subElement);
                })
            }
        }
    }
}