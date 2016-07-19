///<reference path="model/GameState.ts"/>
///<reference path="data/DataDefinitions.ts"/>
///<reference path="core/Controller.ts"/>
///<reference path="core/GameView.ts"/>
///<reference path="core/GameEngine.ts"/>

namespace TurtleTime {
    export class TurtleTimeGame extends GameEngine {
        protected preloadAssets(game : Phaser.Game):void {
            game.load.spritesheet('turtle', 'assets/textures/turtle.png', 45, 60);
            game.load.image('highlightCircle', 'assets/textures/highlightCircle.png');
            game.load.spritesheet('tableandchair', 'assets/textures/tableandchair.png', 52, 52);
            game.load.image('tile', 'assets/textures/tile.png');
            game.load.image('brick', 'assets/textures/brick.png');
            game.load.image('brick_top', 'assets/textures/bricktop.png');
            game.load.image('blackboard', 'assets/textures/blackboard.png');
            game.load.image('aloe', 'assets/textures/aloe.png');
            game.load.image('banana', 'assets/textures/banana.png');
            game.load.image('grandson', 'assets/textures/grandson.png');
            game.load.image('shadow', 'assets/textures/shadow.png');
            game.load.json('newUserData', 'assets/json/new_user_data.json');
            game.load.json('emptyUserData', 'assets/json/empty_user_data.json');
            game.load.json('turtleData', 'assets/json/turtles.json');
            game.load.json('spriteData', 'assets/json/sprites.json');
            game.load.json('uiData', 'assets/json/ui.json');
        }

        protected loadData(game:Phaser.Game):GameData {
            return {
                turtleData: ((json : any) : Map<string, TurtleData> => {
                    var result : Map<string, TurtleData> = new Map();
                    var turtles = json["turtles"];
                    for (var turtle in turtles) {
                        if (turtles.hasOwnProperty(turtle)) {
                            result.set(turtle, turtles[turtle]);
                        }
                    }
                    return result;
                })(game.cache.getJSON('turtleData')),
                spriteSpecs: new SpriteData(game.cache.getJSON('spriteData')),
                roomScale: [32, 24],
                maxRoomSize: new Point(12, 16),
                screenSize: new Point(game.width, game.height)
            };
        }

        protected loadModel(game : Phaser.Game):GameState {
            var userData : UserData = JSON.parse(localStorage.getItem('userData'));
            if (userData == null || checkGlobalOption('noload')) {
                userData = game.cache.getJSON('newUserData');
                if (localStorage.getItem('userData')) {
                    localStorage.removeItem('userData');
                }
            }
            var uiData : UIDataCollection = game.cache.getJSON('uiData');
            if (checkGlobalOption('uiEdit')) {
                userData = game.cache.getJSON('emptyUserData');
                uiData = JSON.parse(localStorage.getItem('uiData'));
            }
            return {
                inputState : new InputModel(),
                selectionModel : new SelectionModel(),
                cameraModel : new CameraModel(),
                entities : {
                    turtles : new TurtleEntityCollection(userData.cafeState.turtles),
                    chairs : new EntityCollection(Chair, userData.cafeState.chairs),
                    tables: new EntityCollection(Table, userData.cafeState.tables),
                    doors: new EntityCollection(Door, userData.cafeState.doors),
                    wallDecor: new EntityCollection(WallDecoration, userData.cafeState.wallDecor),
                    food: new EntityCollection(Food, userData.cafeState.food)
                },
                roomModel: new RoomModel(userData.room),
                uiModel: new UIModel(uiData.layout, listToMap(uiData.templates, (item : UIData) => item.id)),
                uiInteractionModel: new UIInteractionModel()
            };
        }

        protected createControllers():Array<Controller<GameState>> {
            if (checkGlobalOption('uiEdit')) {
                return [
                    new InputController(),
                    new UIController()
                ]
            } else {
                return [
                    new CameraController(),
                    new AssociationController(),
                    new RoomLayoutController(),
                    new TurtleController(),
                    new InputController(),
                    new TurtleSpawnController(),
                    new DragController(),
                    new UIController()
                ];
            }
        }

        protected createView(gameState:GameState):GameView {
            var view : GameView = new GameView();
            if (!checkGlobalOption('uiEdit')) {
                view.add(new RoomView(gameState.roomModel));
                view.add(new DragView(gameState.selectionModel));
                view.add(new DebugView());
                view.add(new CameraView(gameState.cameraModel));
            }
            view.add(new UIView(gameState.uiModel, gameState.uiInteractionModel));
            return view;
        }

        protected saveModel(gameState : GameState) : void {
            if (checkGlobalOption('nosave')) {
                return;
            }
            var userData : UserData = {
                cafeState: {
                    turtles: gameState.entities.turtles.serialize(),
                    chairs: gameState.entities.chairs.serialize(),
                    tables: gameState.entities.tables.serialize(),
                    doors: gameState.entities.doors.serialize(),
                    wallDecor: gameState.entities.wallDecor.serialize(),
                    roomDecor: [],
                    food: gameState.entities.food.serialize()
                },
                room: gameState.roomModel.serialize()
            };
            localStorage.setItem('userData', JSON.stringify(userData));
        }
    }
}