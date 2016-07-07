///<reference path="../abstract/VisibleModel.ts"/>

module TurtleTime {
    export class SelectionModel {
        private _entity : EntityModel;

        get entity() : EntityModel {
            return this._entity;
        }

        set entity(value : EntityModel) {
            this._entity = value;
        }
    }
}