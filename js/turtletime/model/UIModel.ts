///<reference path="../data/DataDefinitions.ts"/>

module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    export class UIModel extends VisibleModel {
        id : string;
        internalDimensions : Rectangle;
        children : Array<UIModel>;

        constructor(data : UIData) {
            super();
            this.internalDimensions = new Rectangle(
                data.rect[0][0],
                data.rect[1][0],
                data.rect[0][1] - data.rect[0][0],
                data.rect[1][1] - data.rect[1][0]
            );
            this.id = data.id;
            this.children = data.children.map((childData : UIData) : UIModel => new UIModel(childData));
        }

        serialize() : UIData {
            return {
                id: this.id,
                rect: [[this.internalDimensions.x, this.internalDimensions.width - this.internalDimensions.x],
                       [this.internalDimensions.y, this.internalDimensions.height - this.internalDimensions.y]],
                children: this.children.map((childModel : UIModel) : UIData => childModel.serialize())
            };
        }
    }
}