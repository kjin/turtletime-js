module TurtleTime {
    export class Table extends EntityModel {
        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.layerNumber = LAYER_SPRITE_TABLE;
        }

        getEntityClass() : string { return "table"; }

        getAdditionalData() : any {
            return {};
        }
    }

    export class Chair extends EntityModel {
        isWaitingChair : boolean;

        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.layerNumber = LAYER_SPRITE_CHAIR;
        }

        getEntityClass() : string { return "chair"; }

        getAdditionalData() : any {
            return {
                isWaitingChair : this.isWaitingChair
            };
        }
    }

    export class Door extends EntityModel {
        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
            this.layerNumber = LAYER_SPRITE_DOOR;
        }

        getEntityClass() : string { return "door"; }

        getAdditionalData() : any {
            return {};
        }
    }
}