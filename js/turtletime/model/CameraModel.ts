module TurtleTime {
    export class CameraModel {
        targetPosition : Point = new Point();
        smoothingRate : number = 0.5;

        get actualPosition() : Point {
            return GAME_ENGINE.cameraPosition;
        }
    }
}