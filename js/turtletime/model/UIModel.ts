///<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    export class UIModel extends VisibleModel {
        id : string;
        container : UIContainer;
        children : Array<UIModel>;
        text : string = "";
        visible : boolean = true;

        constructor(data : UIData) {
            super();
            this.container = new UIContainer(data.container);
            this.id = data.id;
            this.children = data.children.map((childData : UIData) : UIModel => new UIModel(childData));
            if (checkGlobalOption("debugMode")) {
                this.text = this.id;
            }
        }

        getChild(path : string) : UIModel {
            var splitPath : Array<string> = path.split('.');
            var child : UIModel = this.children.find((child : UIModel) : boolean => child.id == splitPath[0]);
            if (child == null) {
                return null;
            }
            if (path.indexOf('.') == -1) {
                return child;
            }
            return child.getChild(path.substring(path.indexOf('.') + 1));
        }
    }
}