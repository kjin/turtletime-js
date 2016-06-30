namespace TurtleTime {
    export interface GameState {
        inputState: InputModel,
        selectionModel:SelectionModel,
        entities:{
            turtles:Array<Turtle>,
            chairs:Array<Chair>,
            tables:Array<Table>
        }
    }

    export function preloadGame():void {
        game.load.spritesheet('turtle', 'assets/turtle.png', 45, 60);
        game.load.image('highlightCircle', 'assets/highlightCircle.png');
        game.load.spritesheet('tableandchair', 'assets/tableandchair.png', 52, 52);
    }
    
    export function createModel() : GameState {
        return {
            inputState : new InputModel(),
            selectionModel : new SelectionModel(),
            entities : {
                turtles : [
                    new Turtle({ position: new Point(5, 5), direction: Direction.Down, appearanceID: "turtleBasic", actionStatus: "stand" }),
                    new Turtle({ position: new Point(10, 10), direction: Direction.Down, appearanceID: "turtleBasic", actionStatus: "stand" })
                ],
                chairs : [
                    new Chair({ position: new Point(8, 5), direction: Direction.Down, appearanceID: "chairBasic", actionStatus: "stand"})
                ],
                tables: [
                    new Table({ position: new Point(10, 5), direction: Direction.Down, appearanceID: "tableBasic", actionStatus: "stand"})
                ]
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