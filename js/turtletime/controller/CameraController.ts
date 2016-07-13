namespace TurtleTime {
    export class CameraController extends Controller<GameState> {
        initialize(gameState:TurtleTime.GameState):void {
            this._writeState = {
                camera: gameState.cameraModel
            };
            this._writeState.camera.targetPosition.x =
                this._writeState.camera.actualPosition.x =
                    (GAME_ENGINE.globalData.screenSize.x - gameState.roomModel.width * GAME_ENGINE.globalData.roomScale[0]) / 2;
            this._writeState.camera.targetPosition.y =
                this._writeState.camera.actualPosition.y =
                    (GAME_ENGINE.globalData.screenSize.y - gameState.roomModel.height * GAME_ENGINE.globalData.roomScale[1]) / 2;
        }

        update(dt:number):void {
            this._writeState.camera.actualPosition.x =
                MathExtensions.lerp(
                    this._writeState.camera.actualPosition.x,
                    this._writeState.camera.targetPosition.x,
                    this._writeState.camera.smoothingRate);
            this._writeState.camera.actualPosition.y =
                MathExtensions.lerp(
                    this._writeState.camera.actualPosition.y,
                    this._writeState.camera.targetPosition.y,
                    this._writeState.camera.smoothingRate);
        }
    }
}