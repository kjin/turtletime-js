///<reference path="../abstract/VisibleModel.ts"/>

module TurtleTime {
    export class SelectionModel extends VisibleModel {
        private _entity : EntityModel;

        constructor() {
            super();
            this.layerNumber = LAYER_UI;
        }

        get entity() : EntityModel {
            return this._entity;
        }

        set entity(value : EntityModel) {
            this._entity = value;
        }
    }
}