module TurtleTime {
    export class Table extends EntityModel {
        constructor(x:number, y:number) {
            super(x, y, SpriteSpecs.tables["tableBasic"]);
            this.layerNumber = LAYER_SPRITE_TABLE;
            this.currentAction = 'stand';
        }
    }

    export class Chair extends EntityModel {
        constructor(x:number, y:number) {
            super(x, y, SpriteSpecs.chairs["chairBasic"]);
            this.layerNumber = LAYER_SPRITE_CHAIR;
            this.currentAction = 'stand';
        }
    }
}