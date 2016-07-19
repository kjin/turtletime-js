namespace TurtleTime {
    export class CameraController extends Controller<GameState> {
        initialize(gameState:GameState):void {
            this._writeState = {
                camera: gameState.cameraModel
            };
            this._writeState.camera.peekTarget().x = gameState.roomModel.width / 2;
            this._writeState.camera.peekTarget().y = gameState.roomModel.height / 2;
            this.updateInternalPosition();
            this._writeState.camera.actualPosition.x = this._writeState.camera.internalPosition.x;
            this._writeState.camera.actualPosition.y = this._writeState.camera.internalPosition.y;
        }

        private updateInternalPosition() : void {
            this._writeState.camera.internalPosition.x =
                (-this._writeState.camera.peekTarget().x - 0.5) * GAME_ENGINE.globalData.roomScale[0] +
                GAME_ENGINE.globalData.screenSize.x / 2;
            this._writeState.camera.internalPosition.y =
                (-this._writeState.camera.peekTarget().y - 0.5) * GAME_ENGINE.globalData.roomScale[1] +
                GAME_ENGINE.globalData.screenSize.y / 2;
        }

        update(dt:number):void {
            this.updateInternalPosition();
            this._writeState.camera.actualPosition.x =
                MathExtensions.lerp(
                    this._writeState.camera.actualPosition.x,
                    this._writeState.camera.internalPosition.x,
                    this._writeState.camera.smoothingRate);
            this._writeState.camera.actualPosition.y =
                MathExtensions.lerp(
                    this._writeState.camera.actualPosition.y,
                    this._writeState.camera.internalPosition.y,
                    this._writeState.camera.smoothingRate);
        }
    }
}