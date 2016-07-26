module TurtleTime {
    export class Food extends EntityModel {
        heightFromGround : number;
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