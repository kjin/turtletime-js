///<reference path="../data/DataDefinitions.ts"/>
///<reference path="EntityModel.ts"/>
///<reference path="GameView.ts"/>
// TODO Move logic dealing with view out, since view should only see model (even within core)

module TurtleTime {
    export abstract class AbstractEntityCollection {
        abstract update(gameView : GameView) : void;

        abstract forEachModel(callback: (value: EntityModel) => void, includeUnprocessed : boolean) : void;
    }

    /**
     * A class representing a managed collection of entities in the game.
     * It accounts for entities that have just been added/removed, so that external logic
     * can operate on these entities.
     */
    export class EntityCollection<T extends EntityModel> extends AbstractEntityCollection {
        private _type : { new() : T };
        private _entities : Array<T>;
        private _preEntities : Array<T>;
        private _postEntities : Array<T>;

        constructor(type : { new() : T }, initialEntities : Array<EntityData> = []) {
            super();
            this._type = type;
            this._entities = [];
            this._preEntities = [];
            this._postEntities = [];
            this.addAll(initialEntities);
        }

        addAll(entityDataArray : Array<EntityData>) : void {
            entityDataArray.forEach((e : EntityData) : void => { this.add(e); return });
        }

        /**
         * Instantiates the model represented by a given entity data.
         * @param entityData The data that represents the model's serialized form.
         */
        add(entityData : EntityData) : T {
            var newObject : T = new this._type();
            newObject.initialize(entityData);
            this._preEntities.push(newObject);
            return newObject;
        }

        remove(entityModel : T) : void {
            var index : number = 0;
            for (; index < this._entities.length; index++) {
                if (this._entities[index] == entityModel) {
                    break;
                }
            }
            if (index < this._entities.length) {
                this._postEntities.push(this._entities[index]);
                this._entities.splice(index, 1);
            }
        }

        update(gameView : GameView) : void {
            this._preEntities.forEach((e : T) : void => {
                gameView.add(this.createEntityView(e));
                this._entities.push(e);
            });
            this._postEntities.forEach((e : T) : void => gameView.remove(e.view));
            // clear both arrays
            this._preEntities.length = 0;
            this._postEntities.length = 0;
        }

        protected createEntityView(entity : T) : EntityView {
            return new EntityView(entity);
        }

        forEach(callback: (value: T) => void, includeUnprocessed : boolean = false) {
            this._entities.forEach(callback);
            if (includeUnprocessed) {
                this._preEntities.forEach(callback);
            }
        }

        forEachModel(callback: (value: EntityModel) => void, includeUnprocessed : boolean = false) : void {
            this.forEach((value : T) => callback(value), includeUnprocessed);
        }

        get underlyingArray() : Array<T> {
            return this._entities;
        }

        get length() : number {
            return this._entities.length;
        }

        serialize() : Array<EntityData> {
            var saveFunc = (e: T, i : number, arr : Array<T>) : EntityData => e.serialize();
            return this._preEntities.map(saveFunc).concat(this._entities.map(saveFunc));
        }
    }

    export class TurtleEntityCollection extends EntityCollection<Turtle> {
        constructor(initialEntities : Array<EntityData> = []) {
            super(Turtle, initialEntities);
        }

        protected createEntityView(entity : Turtle) {
            return new TurtleView(entity);
        }
    }
}