///<reference path="../core/EntityCollection.ts"/>
///<reference path="Doodads.ts"/>
///<reference path="InputModel.ts"/>
///<reference path="RoomModel.ts"/>
///<reference path="SelectionModel.ts"/>
///<reference path="Turtle.ts"/>

module TurtleTime {
    export interface GameState {
        inputState: InputModel,
        selectionModel:SelectionModel,
        entities:{
            turtles:EntityCollection<Turtle>,
            chairs:EntityCollection<Chair>,
            tables:EntityCollection<Table>,
            doors:EntityCollection<Door>,
            wallDecor:EntityCollection<WallDecoration>,
            food:EntityCollection<Food>
        },
        roomModel: RoomModel,
        uiModel: UIModel
    }
}