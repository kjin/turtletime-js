module TurtleTime {
    export class Food extends EntityModel {
        table : Table;
        chair : Chair;
        hp : number;

        initialize(data : EntityData) {
            super.initialize(data);
            this.hp = data.additionalData.hp;
        }

        getEntityClass() : EntityType { return EntityType.Food; }

        protected getAdditionalData():any {
            return {
                hp : this.hp
            };
        }
    }
}