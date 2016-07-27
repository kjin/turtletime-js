///<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;

    // describes how user interacts with the UI component
    export enum UIType {
        Dummy, Container, Button, ScrollingContainer, TabbedContainer
    }

    export class UIModel extends VisibleModel {
        id : string;
        fullID : string;
        container : UIContainer;
        children : Array<UIModel>;
        visible : boolean = true;
        generate : string;
        type : UIType;
        appearance : UIAppearanceCollection;

        constructor(data : UIData, parentFullID : string = null) {
            super();
            if (data.hasOwnProperty("template")) {
                // do a deep copy of the whole template in order to substitute values
                var rawTemplate : string = JSON.stringify(GAME_ENGINE.globalData.uiTemplates.get(data.template.id));
                if (data.template.hasOwnProperty("subs")) {
                    for (var i : number = 0; i < data.template.subs.length; i++) {
                        rawTemplate = rawTemplate.replace(new RegExp("\\$" + i, "g"), data.template.subs[i]);
                    }
                }
                var template : UIData = JSON.parse(rawTemplate);
                data.children = template.children;
                data.container = template.container;
                data.appearance = template.appearance;
                if (template.hasOwnProperty("generate")) {
                    data.generate = template.generate;
                }
            }
            this.container = new UIContainer(data.container);
            this.id = data.id;
            this.generate = data.hasOwnProperty("generate") ? data.generate : "";
            if (parentFullID == null) {
                this.fullID = "";
            } else {
                this.fullID = parentFullID == "" ? data.id : parentFullID + "." + data.id;
            }
            this.children = data.children.map((childData : UIData) : UIModel => new UIModel(childData, this.fullID));
            this.appearance = new UIAppearanceCollection(data.appearance);
            if (data.hasOwnProperty("visible")) {
                this.visible = data["visible"];
            }
        }

        getDeepestElementContaining(x : number, y : number, onlyVisible : boolean) : UIModel {
            // probe into view
            if ((this.visible || !onlyVisible) && this.view.contains(x, y)) {
                var result : UIModel = this;
                this.children.forEach((child : UIModel) => {
                    var childResult = child.getDeepestElementContaining(x, y, onlyVisible);
                    if (childResult != null) {
                        result = childResult;
                    }
                });
                return result;
            }
            return null;
        }

        addChild(uiData : UIData) : void {
            this.children.push(new UIModel(uiData, this.fullID));
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

        getEntireTree() : Array<UIModel> {
            var result : Array<UIModel> = [this];
            this.children.forEach((child : UIModel) => {
                child.getEntireTree().forEach((node : UIModel) => result.push(node));
            });
            return result;
        }
    }
}