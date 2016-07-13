///<reference path="BaseView.ts"/>

module TurtleTime {
    import Group = Phaser.Group;
    import DisplayObject = PIXI.DisplayObject;

    export class GameView {
        private _views : Array<BaseView>;
        private _groups : Map<number, Group>;
        private _allGroup : Group;

        constructor() {
            this._views = [];
            this._groups = new Map<number, Group>();
            this._allGroup = GAME_ENGINE.game.add.group();
        }

        update() : void {
            this._allGroup.sort('name');
            this._groups.forEach((group : Group) : void => {
                group.sort('name', Group.SORT_ASCENDING);
            });
            this._views.forEach(function (view : BaseView) { view.update(); });
        }

        add(view : BaseView) : void {
            if (!this._groups.has(view.getLayerNumber())) {
                this._groups.set(view.getLayerNumber(), GAME_ENGINE.game.add.group(null, "" + (view.getLayerNumber() + 10000))); // to sort easily
                this._allGroup.add(this._groups.get(view.getLayerNumber()));
            }
            var group : Group = this._groups.get(view.getLayerNumber());
            view.enumerateGameObjects().forEach((gameObject : DisplayObject) : void => {
                if (gameObject == null) {
                    return;
                }
                group.add(gameObject);
            });
            this._views.push(view);
        }

        remove(view : BaseView) : void {
            var index : number = this._views.findIndex((e : BaseView) => (e == view));
            if (index >= 0) {
                this._views = this._views.splice(index, 1);
            }
            var group : Group = this._groups.get(view.getLayerNumber());
            view.enumerateGameObjects().forEach((gameObject : DisplayObject) : void => {
                if (gameObject == null) {
                    return;
                }
                group.remove(gameObject);
            });
        }
    }
}