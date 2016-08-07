///<reference path="model/GameState.ts"/>
///<reference path="data/DataDefinitions.ts"/>
///<reference path="core/Controller.ts"/>
///<reference path="core/GameView.ts"/>
///<reference path="core/GameEngine.ts"/>

namespace TurtleTime {
    export class TurtleTimeGame extends GameEngine {
        protected loadData(game:Phaser.Game):GameData {
            return {
                turtleData: listToMap(game.cache.getJSON('turtles').turtles, (data : TurtleData) : string => data.id),
                foodData: listToMap(game.cache.getJSON('food').food, (data : FoodData) : string => data.id),
                spriteSpecs: new SpriteData(game.cache.getJSON('sprites')),
                uiTemplates : listToMap(game.cache.getJSON('ui').templates, (item : UIData) => item.id),
                roomScale: [32, 32],
                maxRoomSize: new Point(12, 16),
                screenSize: new Point(game.width, game.height),
                animations: objectToMap<Array<SpriteAnimation> >(game.cache.getJSON('animations').animations)
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
            var uiData : UIDataCollection = game.cache.getJSON('ui');
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
                eatingAreas: [],
                roomModel: new RoomModel(userData.room),
                uiModel: new UIModel(uiData.layout),
                uiInteractionModel: new UIInteractionModel(),
                userProgress: userData.progress
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
                    new UIController(),
                    new FoodSpawnController(),
                    new EatingAreaController(),
                    new InGameUIController()
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
            view.add(new MainUIView(gameState.uiModel, gameState.uiInteractionModel));
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