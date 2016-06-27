/**
 * Created by kjin on 6/26/2016.
 */

namespace TurtleTime {
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