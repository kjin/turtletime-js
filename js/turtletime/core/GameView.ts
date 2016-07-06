module TurtleTime {
    export class GameView {
        private _views : Array<BaseView>;

        constructor() {
            this._views = [];
        }

        update() : void {
            this._views.sort((a : BaseView, b : BaseView) : number => (a.getLayerNumber() - b.getLayerNumber()));
            this._views.forEach(function (view : BaseView) { view.bringToTop(); view.update(); });
        }

        add(view : BaseView) : void {
            this._views.push(view);
        }

        remove(view : BaseView) : void {
            var index : number = this._views.findIndex((e : BaseView) => (e == view));
            if (index >= 0) {
                this._views = this._views.splice(index, 1);
            }
        }
    }
}