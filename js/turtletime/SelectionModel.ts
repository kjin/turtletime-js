module TurtleTime {
    export class SelectionModel {
        private _dirty : boolean = true;
        private _entity : Entity;
        view : SelectionView;

        get entity() : Entity {
            return this._entity;
        }

        set entity(value : Entity) {
            this._entity = value;
            this._dirty = true;
        }

        initializeView() : void {
            this.view = new SelectionView();
        }

        updateView() : void {
            if (this._dirty) {
                this.view.update(this);
            }
            // this._dirty = false;
        }
    }
}