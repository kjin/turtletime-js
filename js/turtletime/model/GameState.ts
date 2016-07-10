///<reference path="../core/EntityCollection.ts"/>
///<reference path="Doodads.ts"/>
///<reference path="InfoboxModel.ts"/>
///<reference path="InputModel.ts"/>
///<reference path="RoomModel.ts"/>
///<reference path="SelectionModel.ts"/>
///<reference path="Turtle.ts"/>

module TurtleTime {
    export interface GameState {
        inputState: InputModel,
        selectionModel:SelectionModel,
        infoboxModel:InfoboxModel,
        entities:{
            turtles:EntityCollection<Turtle>,
            chairs:EntityCollection<Chair>,
            tables:EntityCollection<Table>,
            doors:EntityCollection<Door>,
            wallDecor:EntityCollection<WallDecoration>
        },
        roomModel: RoomModel,
        uiModel: UIModel
    }
}