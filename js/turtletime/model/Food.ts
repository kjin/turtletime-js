module TurtleTime {
    export class Food extends EntityModel {
        onTable : Table;

        getEntityClass() : EntityType { return EntityType.Food; }

        protected getAdditionalData():any {
            return {};
        }
    }
}