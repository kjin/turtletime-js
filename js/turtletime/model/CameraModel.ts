module TurtleTime {
    export class CameraModel {
        targetPosition : Point = new Point();
        smoothingRate : number = 0.5;

        constructor() {
            this.targetPosition.x = this.actualPosition.x = (GAME_ENGINE.globalData.screenSize.x - GAME_ENGINE.globalData.maxRoomSize.x * GAME_ENGINE.globalData.roomScale[0]) / 2;
            this.targetPosition.y = this.actualPosition.y = (GAME_ENGINE.globalData.screenSize.y - GAME_ENGINE.globalData.maxRoomSize.y * GAME_ENGINE.globalData.roomScale[1]) / 2;
        }

        get actualPosition() : Point {
            return GAME_ENGINE.cameraPosition;
        }
    }
}