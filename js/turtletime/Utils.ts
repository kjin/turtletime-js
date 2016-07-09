///<reference path="../defs/phaser.comments.d.ts"/>

module TurtleTime {
    export var debugText : string = "";

    export function debugLog(text : string) {
        debugText += text + "\n";
    }

    /**
     * An enumeration of the different directions an entity can face.
     */
    export enum Direction {
        Up = 0,
        Down,
        Left,
        Right
    }

    export function setTintAndAlpha(sprite : Sprite, value : number) : void {
        var tint = (value & 0xffffff00) >>> 8;
        var alpha = (value & 0xff) / 255.0;
        sprite.tint = tint;
        sprite.alpha = alpha;
    }

    export module Direction {
        export function toDirection(vector : Point) : Direction {
            var a = vector.x;
            var b = vector.y;
            if (Math.abs(a) >= Math.abs(b)) { // either left or right
                if (a >= 0) {
                    return Direction.Right;
                } else {
                    return Direction.Left;
                }
            } else {
                if (b <= 0) {
                    return Direction.Up;
                } else {
                    return Direction.Down;
                }
            }
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

        export function toVector(dir : Direction) : Point {
            if (dir == Direction.Up) {
                return new Point(0, -1);
            } else if (dir == Direction.Left) {
                return new Point(-1, 0);
            } else if (dir == Direction.Right) {
                return new Point(1, 0);
            } else {
                return new Point(0, 1);
            }
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

    export function checkGlobalOption(value : string) : boolean {
        var globalOptions : string = localStorage.getItem('globalOptions');
        if (globalOptions == null) {
            return false;
        }
        return globalOptions.includes(value);
    }

    export function getRandomElement<T>(arr : Array<T>) : T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Converts a point in room coordinates to one in screen coordinates.
     * @param point A point in room coordinates.
     * @returns {Phaser.Point} A point in screen coordinates.
     */
    export function roomToScreen(point : Point) : Point {
        return roomToScreenXY(point.x, point.y);
    }

    /**
     * Converts a point in room coordinates to one in screen coordinates.
     * @param x The x-coordinate of the point in room coordinates.
     * @param y The y-coordinate of the point in room coordinates.
     * @returns {Phaser.Point} A point in screen coordinates.
     */
    export function roomToScreenXY(x : number, y : number) : Point {
        return new Point(x * gameData.roomScale + (gameData.screenSize.x - gameData.maxRoomSize.x * gameData.roomScale) / 2,
                         y * gameData.roomScale + (gameData.screenSize.y - gameData.maxRoomSize.y * gameData.roomScale) / 2);
    }

    /**
     * Converts a point in screen coordinates to one in room coordinates.
     * @param point A point in screen coordinates.
     * @returns {Phaser.Point} A point in room coordinates.
     */
    export function screenToRoom(point : Point) : Point {
        return screenToRoomXY(point.x, point.y);
    }

    /**
     * Converts a point in screen coordinates to one in room coordinates.
     * @param x The x-coordinate of the point in screen coordinates.
     * @param y The y-coordinate of the point in screen coordinates.
     * @returns {Phaser.Point} A point in room coordinates.
     */
    export function screenToRoomXY(x : number, y : number) : Point {
        return new Point((x - (gameData.screenSize.x - gameData.maxRoomSize.x * gameData.roomScale) / 2) / gameData.roomScale,
                         (y - (gameData.screenSize.y - gameData.maxRoomSize.y * gameData.roomScale) / 2) / gameData.roomScale);
    }
}