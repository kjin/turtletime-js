module TurtleTime {
    export var EffectCircleDictionary = {
        unselectable: 0xff0000ff,
        hidden: 0xffffff00,
        normal: 0xffffffff,
        highlighted: 0xffff00ff,
        selected: 0x00ff00ff
    };

    export function setTintAndAlpha(sprite : Sprite, value : number) : void {
        var tint = (value & 0xffffff00) >>> 8;
        var alpha = (value & 0xff) / 255.0;
        sprite.tint = tint;
        sprite.alpha = alpha;
    }

    /**
     * The number of pixels on-screen per cafe unit.
     * @type {number}
     */
    export var COORDINATE_SCALE : number = 20;

    /**
     * An enumeration of the different directions an entity can face.
     */
    export enum Direction {
        Up = 1,
        Down,
        Left,
        Right
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