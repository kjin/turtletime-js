module TurtleTime {
    export class InfoboxModel extends VisibleModel {
        text : string;

        constructor() {
            super();
            this.text = "";
            this.layerNumber = LAYER_UI;
        }
    }
}