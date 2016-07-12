module TurtleTime {
    export class Food extends EntityModel {
        onTable : Table;

        getEntityClass():string {
            return "food";
        }

        protected getAdditionalData():any {
            return {};
        }
    }
}