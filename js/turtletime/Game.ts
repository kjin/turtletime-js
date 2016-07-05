namespace TurtleTime {
    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>,
            doors: Array<EntityData>
        }
    }

    export interface GameState {
        inputState: InputModel,
        selectionModel:SelectionModel,
        entities:{
            turtles:Array<Turtle>,
            chairs:Array<Chair>,
            tables:Array<Table>,
            doors:Array<Door>
        }
    }

    export function preloadGame():void {
        game.load.spritesheet('turtle', 'assets/textures/turtle.png', 45, 60);
        game.load.image('highlightCircle', 'assets/textures/highlightCircle.png');
        game.load.spritesheet('tableandchair', 'assets/textures/tableandchair.png', 52, 52);
        game.load.json('user_data_new', 'assets/json/new_user_data.json');
    }
    
    export function loadModel() : GameState {
        var userData : UserData = JSON.parse(localStorage.getItem('user_data'));
        if (userData == null || checkGlobalOption('nosave')) {
            userData = game.cache.getJSON('user_data_new');
        }
        return {
            inputState : new InputModel(),
            selectionModel : new SelectionModel(),
            entities : {
                // TODO See if there's a way to make this neater with generics and/or iteration over members,
                turtles : userData.cafeState.turtles.map((e : EntityData, i : number, arr : Array<EntityData>) : Turtle => new Turtle(e)),
                chairs : userData.cafeState.chairs.map((e : EntityData, i : number, arr : Array<EntityData>) : Chair => new Chair(e)),
                tables: userData.cafeState.tables.map((e : EntityData, i : number, arr : Array<EntityData>) : Table => new Table(e)),
                doors: userData.cafeState.doors.map((e : EntityData, i : number, arr : Array<EntityData>) : Door => new Door(e))
            }
        };
    }

    export function saveModel(gameState : GameState) : void {
        if (checkGlobalOption('nosave')) {
            return;
        }
        var userData : UserData = {
            cafeState: {
                turtles: gameState.entities.turtles.map((e: Turtle, i : number, arr : Array<Turtle>) : EntityData => e.serialize()),
                chairs: gameState.entities.chairs.map((e: Chair, i : number, arr : Array<Chair>) : EntityData => e.serialize()),
                tables: gameState.entities.tables.map((e: Table, i : number, arr : Array<Table>) : EntityData => e.serialize()),
                doors: gameState.entities.doors.map((e: Door, i : number, arr : Array<Door>) : EntityData => e.serialize())
            }
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
    }

    export function createControllers() : Array<Controller> {
        return [new TurtleController(), new InputController(), new TurtleSpawnController()];
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