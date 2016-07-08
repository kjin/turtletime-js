///<reference path="core/GameView.ts"/>
import GameState = TurtleTime.GameState;
import GameView = TurtleTime.GameView;
namespace TurtleTime {
    export interface UserData {
        cafeState: {
            turtles: Array<EntityData>,
            chairs: Array<EntityData>,
            tables: Array<EntityData>,
            doors: Array<EntityData>
        },
        room: Array<number>
    }

    export interface GameData {
        turtleData: Map<string, TurtleData>,
        spriteSpecs: SpriteData,
        roomScale: number,
        maxRoomSize: Point,
        screenSize: Point
    }

    export interface GameState {
        inputState: InputModel,
        selectionModel:SelectionModel,
        infoboxModel:InfoboxModel,
        entities:{
            turtles:EntityCollection<Turtle>,
            chairs:EntityCollection<Chair>,
            tables:EntityCollection<Table>,
            doors:EntityCollection<Door>
        },
        roomModel: RoomModel
    }

    export var gameData : GameData = null;

    export function preloadGame():void {
        game.load.spritesheet('turtle', 'assets/textures/turtle.png', 45, 60);
        game.load.image('highlightCircle', 'assets/textures/highlightCircle.png');
        game.load.spritesheet('tableandchair', 'assets/textures/tableandchair.png', 52, 52);
        game.load.json('user_data_new', 'assets/json/new_user_data.json');
        game.load.json('turtle_data', 'assets/json/turtles.json');
        game.load.json('sprite_data', 'assets/json/sprites.json');
    }
    
    export function loadModel() : GameState {
        var userData : UserData = JSON.parse(localStorage.getItem('user_data'));
        if (userData == null || checkGlobalOption('nosave')) {
            userData = game.cache.getJSON('user_data_new');
            if (localStorage.getItem('user_data')) {
                localStorage.removeItem('user_data');
            }
        }
        gameData = {
            turtleData: ((json : any) : Map<string, TurtleData> => {
                var result : Map<string, TurtleData> = new Map();
                var turtles = json["turtles"];
                for (var turtle in turtles) {
                    if (turtles.hasOwnProperty(turtle)) {
                        result.set(turtle, turtles[turtle]);
                    }
                }
                return result;
            })(game.cache.getJSON('turtle_data')),
            spriteSpecs: new SpriteData(game.cache.getJSON('sprite_data')),
            roomScale: 32,
            maxRoomSize: new Point(userData.room[0], userData.room[1]),
            screenSize: new Point(window.innerWidth, window.innerHeight)
        };
        return {
            inputState : new InputModel(),
            selectionModel : new SelectionModel(),
            infoboxModel : new InfoboxModel(),
            entities : {
                turtles : new EntityCollection(Turtle, userData.cafeState.turtles),
                chairs : new EntityCollection(Chair, userData.cafeState.chairs),
                tables: new EntityCollection(Table, userData.cafeState.tables),
                doors: new EntityCollection(Door, userData.cafeState.doors)
            },
            roomModel: new RoomModel(userData.room[0], userData.room[1])
        };
    }

    export function createView(gameState : GameState) : GameView {
        var view : GameView = new GameView();
        view.add(new RoomView(gameState.roomModel));
        view.add(new InfoboxView(gameState.infoboxModel));
        view.add(new DragView(gameState.selectionModel));
        view.add(new DebugView());
        return view;
    }

    export function saveModel(gameState : GameState) : void {
        if (checkGlobalOption('nosave')) {
            return;
        }
        var userData : UserData = {
            cafeState: {
                turtles: gameState.entities.turtles.serialize(),
                chairs: gameState.entities.chairs.serialize(),
                tables: gameState.entities.tables.serialize(),
                doors: gameState.entities.doors.serialize()
            },
            room: [gameState.roomModel.width, gameState.roomModel.height]
        };
        localStorage.setItem('user_data', JSON.stringify(userData));
    }

    export function createControllers() : Array<Controller> {
        return [new TurtleController(), new InputController(), new TurtleSpawnController(), new DragController()];
    }

    export function updateModel(gameState : GameState) : void {
        this.gameState.entities.turtles.update();
    }
}