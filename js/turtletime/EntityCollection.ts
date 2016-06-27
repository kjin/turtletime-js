module TurtleTime {
    class EntityCollection {
        private _name : String;
        private _entities : Array<Entity>;

        constructor(name : String) {
            this._name = name;
            this._entities = [];
        }

        get name() : String {
            return this._name;
        }

        get entities() : Array<Entity> {
            return this._entities;
        }

        set entities(value : Array<Entity>) {
            this._entities = value;
        }
    }
}