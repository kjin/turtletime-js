///<reference path="../core/EntityModel.ts"/>
///<reference path="../data/DataDefinitions.ts"/>
///<reference path="../data/Constants.ts"/>

module TurtleTime {
    export class Table extends EntityModel {
        initialize(entityData : EntityData) : void {
            super.initialize(entityData);
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
        }

        getEntityClass() : string { return "door"; }

        getAdditionalData() : any {
            return {};
        }
    }
}