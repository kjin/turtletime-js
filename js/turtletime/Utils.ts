///<reference path="../defs/phaser.comments.d.ts"/>

module TurtleTime {
    import Sprite = Phaser.Sprite;
    /**
     * An enumeration of the different directions an entity can face.
     */
    export enum Direction {
        None = 0,
        Up = 1,
        Down = 2,
        Left = 4,
        Right = 8,
        UpLeft = 5,
        UpRight = 9,
        DownLeft = 6,
        DownRight = 10,
        Horizontal = 12,
        Vertical = 3,
        All = 15
    }

    export enum EntityType {
        FloorDecor = 0,
        Door = 1,
        Chair = 2,
        Table = 3,
        RoomDecor = 4,
        Food = 5,
        WallDecor = 6,
        Turtle = 7
    }

    export function setTintAndAlpha(sprite : Sprite, value : number) : void {
        var tint = (value & 0xffffff00) >>> 8;
        var alpha = (value & 0xff) / 255.0;
        sprite.tint = tint;
        sprite.alpha = alpha;
    }

    export module EntityType {
        var entityStrings : Array<string> = [
            "floorDecor", "door", "chair", "table", "roomDecor", "food", "wallDecor", "turtle"
        ];

        export function toString(entityType : EntityType) : string {
            return entityStrings[entityType];
        }
    }

    export module Direction {
        var directionalStrings : Array<string> = [
            "none", "up", "down", "vertical", "left", "upleft", "downleft", "invalid",
            "right", "upright", "downright", "invalid", "horizontal", "invalid", "invalid", "all"
        ];

        export function toDirection(vector : Point) : Direction {
            var a = vector.x;
            var b = vector.y;
            if (a == 0 && b == 0) {
                return Direction.None;
            }
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

        export function getDirectionalString(dir : Direction) : string {
            return directionalStrings[dir];
        }

        export function getDirection(directionalString : string) : Direction {
            return Math.max(directionalStrings.findIndex((value : string) : boolean =>  (value == directionalString)), 0);
        }

        export function toVector(dir : Direction) : Point {
            if (dir == Direction.Up) {
                return new Point(0, -1);
            } else if (dir == Direction.Left) {
                return new Point(-1, 0);
            } else if (dir == Direction.Right) {
                return new Point(1, 0);
            } else if (dir == Direction.Down) {
                return new Point(0, 1);
            }
            return new Point(0, 0);
        }
    }

    export function twoDForEach<T>(arr : Array<Array<T>>, callback : (e : T, x : number, y : number) => void) {
        arr.forEach((innerArr : Array<T>, x : number) : void => {
            innerArr.forEach((element : T, y : number) : void => callback(element, x, y));
        });
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

    export function httpGet(url : string, callback : (response : string) => void) {
        var oReq : XMLHttpRequest = new XMLHttpRequest();
        oReq.onload = function () {
            callback(oReq.response);
        };
        oReq.open("GET", url);
        oReq.send();
    }

    export function getRandomElement<T>(arr : Array<T>) : T {
        return arr[Math.floor(Math.random() * arr.length)];
    }

    /**
     * Converts a point in room coordinates to one in screen coordinates.
     * @param x The x-coordinate of the point in room coordinates.
     * @param y The y-coordinate of the point in room coordinates.
     * @returns {Phaser.Point} A point in screen coordinates.
     */
    export function roomToScreen(x : number, y : number) : Point {
        return new Point(x * GAME_ENGINE.globalData.roomScale[0] + GAME_ENGINE.cameraPosition.x,
                         y * GAME_ENGINE.globalData.roomScale[1] + GAME_ENGINE.cameraPosition.y);
    }

    /**
     * Converts a point in wall coordinates to one in screen coordinates.
     * @param x The x-coordinate of the point in wall coordinates.
     * @param y The y-coordinate of the point in wall coordinates.
     * @returns {Phaser.Point} A point in screen coordinates.
     */
    export function wallToScreen(x : number, y : number) : Point {
        return new Point(x * GAME_ENGINE.globalData.roomScale[0] + GAME_ENGINE.cameraPosition.x,
            -y * GAME_ENGINE.globalData.roomScale[0] + GAME_ENGINE.cameraPosition.y);
    }

    /**
     * Converts a point in screen coordinates to one in room coordinates.
     * @param x The x-coordinate of the point in screen coordinates.
     * @param y The y-coordinate of the point in screen coordinates.
     * @returns {Phaser.Point} A point in room coordinates.
     */
    export function screenToRoom(x : number, y : number) : Point {
        var result : Point = new Point();
        screenToRoomPoint(result, x, y);
        return result;
    }

    /**
     * Sets a point to a pair of screen coordinates converted to room coordinates.
     * @param point The Point object to set.
     * @param x The x-coordinate of the point in screen coordinates.
     * @param y The y-coordinate of the point in screen coordinates.
     */
    export function screenToRoomPoint(point : Point, x : number, y : number) : void {
        point.x = (x - GAME_ENGINE.cameraPosition.x) / GAME_ENGINE.globalData.roomScale[0];
        point.y = (y - GAME_ENGINE.cameraPosition.y) / GAME_ENGINE.globalData.roomScale[1];
    }

    export function listToMap<T>(list : Array<T>, keyFunction : (item : T) => string) : Map<string, T> {
        var result : Map<string, T> = new Map<string, T>();
        list.forEach((item : T) : void => {
            result.set(keyFunction(item), item);
        });
        return result;
    }

    /**
     * Given start and end points on a 2D grid, as well as a method of evaluating whether a space may be moved to,
     * return the best direction for an object at the start point to move in order to most efficiently get to the end
     * point.
     * TODO: This only works for 1x1 objects.
     * @param start The start point for the traversal.
     * @param end The end point for the traversal.
     * @param maxX The maximum x-value of the search space.
     * @param heuristicCostEstimate A heuristic for estimating the cost between two nodes.
     * @param isValidSpace A function that returns true if a space can be entered.
     * @param hint A particular direction the traversal algorithm should favor for the first step.
     * @returns {Phaser.Point} A direction to move. If there is no path at all, (0, 0) will be returned.
     */
    export function aStarTraversal(
        start : Point,
        end : Point,
        maxX : number,
        heuristicCostEstimate : (x1 : number, y1 : number, x2 : number, y2 : number) => number,
        isValidSpace : (x : number, y : number) => boolean,
        hint : Direction = Direction.None
    ) : Point {
        // convenience functions
        var getScore = (map : Map<number, number>, key : number) : number => {
            return map.has(key) ? map.get(key) : Infinity;
        };
        var encode = (x : number, y : number) : number => ((maxX + 2) * y + x + 1);
        var decodeX = (v : number) : number => (v % (maxX + 2) - 1);
        var decodeY = (v : number) : number => (Math.floor(v / (maxX + 2)));
        var extractFirstNode = (chain : Map<number, number>, from : number) : number => {
            while (chain.has(from)) {
                var next : number = chain.get(from);
                if (next == encode(start.x, start.y)) {
                    return from;
                }
                from = next;
            }
            return 0; // won't reach here
        };
        // cached value so we don't use so many constructions
        var neighbors : Array<number> = [0, 0, 0, 0];
        var encodedStart = encode(start.x, start.y);
        var encodedEnd = encode(end.x, end.y);
        var hintVector : Point = Direction.toVector(hint);

        var closedSet : Set<number> = new Set();
        var openSet : Set<number> = new Set<number>();
        openSet.add(encodedStart);
        var cameFrom : Map<number, number> = new Map<number, number>();

        var gScore : Map<number, number> = new Map<number, number>();
        gScore.set(encodedStart, 0);
        var fScore : Map<number, number> = new Map<number, number>();
        fScore.set(encodedStart, heuristicCostEstimate(start.x, start.y, end.x, end.y));

        while (openSet.size > 0) {
            var current : number = (() : number => {
                var lowest : number = null;
                var lowestScore : number = Infinity;
                openSet.forEach((element : number) : void => {
                    if (getScore(fScore, element) < lowestScore) {
                        lowest = element;
                        lowestScore = getScore(fScore, element);
                    }
                });
                return lowest;
            })();
            if (current == encodedEnd) {
                var firstNode = extractFirstNode(cameFrom, encode(end.x, end.y));
                return new Point(decodeX(firstNode) - start.x, decodeY(firstNode) - start.y);
            }

            openSet.delete(current);
            closedSet.add(current);
            var currentX = decodeX(current);
            var currentY = decodeY(current);
            neighbors[0] = encode(currentX + 1, currentY);
            neighbors[1] = encode(currentX - 1, currentY);
            neighbors[2] = encode(currentX, currentY + 1);
            neighbors[3] = encode(currentX, currentY - 1);
            neighbors.forEach((neighbor : number) : void => {
                var neighborX = decodeX(neighbor);
                var neighborY = decodeY(neighbor);
                if ((neighbor != encodedEnd && !isValidSpace(neighborX, neighborY)) || closedSet.has(neighbor)) {
                    return;
                }
                var tentative_gScore = getScore(gScore, current);
                if (neighborX - currentX == hintVector.x && neighborY - currentY == hintVector.y) {
                    tentative_gScore += 0.5;
                } else {
                    tentative_gScore += 1.0;
                }
                if (!openSet.has(neighbor)) {
                    openSet.add(neighbor);
                } else if (tentative_gScore >= getScore(gScore, neighbor)) {
                    return;
                }

                cameFrom.set(neighbor, current);
                gScore.set(neighbor, tentative_gScore);
                fScore.set(neighbor, tentative_gScore + heuristicCostEstimate(neighborX, neighborY, end.x, end.y));
            });
        }
        return new Point(0, 0);
    }
}