///<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    export class UIModel extends VisibleModel {
        id : string;
        container : UIContainer;
        children : Array<UIModel>;
        visible : boolean = true;
        appearance : UIAppearance;

        constructor(data : UIData) {
            super();
            this.container = new UIContainer(data.container);
            this.id = data.id;
            this.children = data.children.map((childData : UIData) : UIModel => new UIModel(childData));
            this.appearance = new UIAppearance(data.appearance);
            if (data.hasOwnProperty("visible")) {
                this.visible = data["visible"];
            }
        }

        getDeepestElementContaining(x : number, y : number) : UIModel {
            // probe into view
            if (this.visible && this.view.contains(x, y)) {
                var result : UIModel = this;
                this.children.forEach((child : UIModel) => {
                    var childResult = child.getDeepestElementContaining(x, y);
                    if (childResult != null) {
                        result = childResult;
                    }
                });
                return result;
            }
            return null;
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

        getAllChildren() : Array<UIModel> {
            return this.children;
        }
    }
}