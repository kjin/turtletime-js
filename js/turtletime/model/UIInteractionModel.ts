module TurtleTime {
    // a hodgepodge of things that record temporary UI stuff
    export class UIInteractionModel {
        activeUIModel : UIModel;
        menuStack : UIStack = new UIStack();
        currentFood : string = null;

        mouseOver(ui : UIModel) : boolean {
            return this.activeUIModel == ui;
        }
    }
}