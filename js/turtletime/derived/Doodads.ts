module TurtleTime {
    export class Table extends EntityModel {
        constructor(entityData : EntityData) {
            super(entityData);
            this.layerNumber = LAYER_SPRITE_TABLE;
        }

        getEntityClass() : string { return "table"; }
    }

    export class Chair extends EntityModel {
        constructor(entityData : EntityData) {
            super(entityData);
            this.layerNumber = LAYER_SPRITE_CHAIR;
        }

        getEntityClass() : string { return "chair"; }
    }
}