namespace TurtleTime {
    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>
        }
    }

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
        game.load.spritesheet('turtle', 'assets/textures/turtle.png', 45, 60);
        game.load.image('highlightCircle', 'assets/textures/highlightCircle.png');
        game.load.spritesheet('tableandchair', 'assets/textures/tableandchair.png', 52, 52);
        game.load.json('user_data', 'assets/json/new_user_data.json');
    }
    
    export function createModel() : GameState {
        var userData : UserData = game.cache.getJSON('user_data');
        return {
            inputState : new InputModel(),
            selectionModel : new SelectionModel(),
            entities : {
                turtles : userData.cafeState.turtles.map((e : EntityData, i : number, arr : Array<EntityData>) : Turtle => new Turtle(e)),
                chairs : userData.cafeState.chairs.map((e : EntityData, i : number, arr : Array<EntityData>) : Chair => new Chair(e)),
                tables: userData.cafeState.tables.map((e : EntityData, i : number, arr : Array<EntityData>) : Table => new Table(e))
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