namespace TurtleTime {
    export class AutosaveController extends QuickController<GameState> {
        time : number;
        
        protected updateInternal(gameState:TurtleTime.GameState, dt:number):void {
            var before : number = this.time;
            this.time += dt;
            if (Math.floor(before / AUTOSAVE_RATE_SECONDS) != Math.floor(this.time / AUTOSAVE_RATE_SECONDS)) {
                GAME_ENGINE.raiseSave();
            }
        }
    }
}