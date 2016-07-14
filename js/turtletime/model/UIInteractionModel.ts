module TurtleTime {
    export class UIInteractionModel {
        activeUIModel : UIModel;

        mouseOver(ui : UIModel) : boolean {
            return this.activeUIModel == ui;
        }
    }
}