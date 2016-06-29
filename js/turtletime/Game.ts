namespace TurtleTime {
    export class GameState {
        selectionModel:SelectionModel;
        entities:{
            turtles:Array<Turtle>,
            chairs:Array<Chair>,
            tables:Array<Table>
        };
    }

    export function preloadGame():void {
        game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
        game.load.image('highlightCircle', 'assets/highlightCircle.png');
        game.load.spritesheet('tableandchair', 'assets/tableandchair.png', 52, 52);
    }
    
    export function createModel() : GameState {
        return {
            selectionModel : new SelectionModel(),
            entities : {
                turtles : [new Turtle(10, 10), new Turtle(20, 20)],
                chairs : [new Chair(11, 10)],
                tables: [new Table(20, 10)]
            }
        };
    }

    export function createControllers() : Array<Controller> {
        return [new TurtleController(), new InputController()];
    }

    export function initializeView(gameState : GameState) : Array<BaseView> {
        // Initialize drawing
        var result : Array<BaseView> = [];
        applyOnSubelements(gameState.entities, (item : EntityModel) : void => {
            result.push(new EntityView(item)); });
        result.push(new SelectionView(gameState.selectionModel));
        return result;
    }
}