namespace TurtleTime {
    import BitmapData = Phaser.BitmapData;
    import BaseTexture = PIXI.BaseTexture;
    import Frame = Phaser.Frame;
    import Sprite = Phaser.Sprite;

    /**
     * Represents the engine of the game itself.
     */
    export abstract class GameEngine {
        private gameState : GameState;
        private controllers : Array<Controller<GameState>>;
        views : GameView;
        debugText : string = "";
        /**
         * The current time.
         */
        time : number;
        /**
         * A reference to the underlying Phaser.Game object. Use with care.
         */
        game : Phaser.Game;
        /**
         * A reference to all of the game's globally available data.
         * The data here should remain read-only.
         */
        globalData : GameData;
        /**
         * The camera's position on-screen.
         * This value is used by a lot of objects, so it's probably not worth passing it around.
         */
        cameraPosition : Point = new Point();

        constructor() {
            var scale_factor : number = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? 1 : 1;

            httpGet("assets/assets.json", ((response : string): void => {
                this.game = new Phaser.Game(window.innerWidth * scale_factor, window.innerHeight * scale_factor, Phaser.AUTO, '', null, false, true);

                var assets : AssetDocument = JSON.parse(response);
                var assetCache = {};
                if (localStorage.getItem('dynamicAssetCache')) {
                    assetCache = JSON.parse(localStorage.getItem('dynamicAssetCache'));
                }
                this.game.state.add('loadPhase0', {
                    preload: (() => {
                        this.game.load.image(assets.loadingBar.id, assets.textures.root + '/' + assets.loadingBar.id + '.' + assets.loadingBar.fileType);
                    }).bind(this),
                    create: (() => {
                        this.game.state.start('loadPhase1')
                    }).bind(this)
                });
                this.game.state.add('loadPhase1', {
                    preload: () => this.preloadAssets(this.game, assets),
                    create: (() => {
                        this.game.state.start('loadPhase2')
                    }).bind(this)
                });
                // Generate dynamic assets
                // TODO: Hash dynamic asset JSON to determine whether cache is stale
                var complete = false;
                this.game.state.add('loadPhase2', {
                    preload: () => { complete = this.generateDynamicAssets(this.game, assetCache, assets) },
                    create: (() => {
                        this.game.state.start(complete ? 'main' : 'loadPhase2')
                    }).bind(this)
                });
                this.game.state.add('main', {
                    create: (() => {
                        window.addEventListener("resize", (() => {
                            var oldWidth = this.game.width;
                            var oldHeight = this.game.height;
                            this.game.scale.setGameSize(window.innerWidth * scale_factor, window.innerHeight * scale_factor);
                            this.globalData.screenSize.x = this.game.width;
                            this.globalData.screenSize.y = this.game.height;
                            this.views.onResizeViewport(oldWidth, oldHeight, this.game.width, this.game.height);
                        }).bind(this));
                        this.create();
                    }).bind(this),
                    update: this.update.bind(this)
                });
                this.game.state.start('loadPhase0');
            }).bind(this));
        }

        private preloadAssets(game : Phaser.Game, assets : AssetDocument):void {
            var backingBar : Sprite = game.add.sprite(game.width / 2 - 100, 20, assets.loadingBar.id);
            var preloadBar : Sprite = game.add.sprite(game.width / 2 - 100, 20, assets.loadingBar.id);
            preloadBar.tint = 0x00FF00;
            game.load.setPreloadSprite(preloadBar);

            assets.textures.files.forEach((entry : TextureAssetEntry) : void => {
                if (!entry.hasOwnProperty("fileType")) { entry.fileType = "png"; }
                if (!entry.hasOwnProperty("fileID")) { entry.fileID = entry.id; }
                var path = assets.textures.root + '/' + entry.id + '.' + entry.fileType;
                if (!entry.hasOwnProperty("frameSize")) {
                    game.load.image(entry.id, path);
                } else {
                    game.load.spritesheet(entry.id, path, entry.frameSize[0], entry.frameSize[1]);
                }
            });
            assets.json.files.forEach((entry : AssetEntry) : void => {
                game.load.json(entry.id, assets.json.root + '/' + entry.id + '.json');
            });
            assets.fonts.files.forEach((entry : AssetEntry) : void => {
                game.load.bitmapFont(entry.id,
                    assets.fonts.root + '/' + entry.id + '.png',
                    assets.fonts.root + '/' + entry.id + '.fnt' // courtesy of littera
                );
            });
        }
        
        private generateDynamicAssets(game : Phaser.Game, assetCache : any, assets : AssetDocument) : boolean {
            var complete : boolean = true;
            assets.textures.derivedFiles.forEach((entry : DerivedTextureAssetEntry) : void => {
                // satisfy pre-requisites
                var shouldLoad : boolean = !game.cache.checkImageKey(entry.id);
                if (shouldLoad) {
                    for (var i = 0; i < entry.sources.length; i++) {
                        shouldLoad = shouldLoad && game.cache.checkImageKey(entry.sources[i]);
                        if (!shouldLoad) {
                            break;
                        }
                    }
                    if (!shouldLoad) {
                        complete = false;
                        return;
                    }
                }
                if (!assetCache.hasOwnProperty(entry.id)) {
                    this.debugPrintln("Generating " + entry.id + "...");
                    var bitmapData:BitmapData = ImageProcessing.SINGLETON[entry.action.name](game, entry.sources, entry.action.params);
                    assetCache[entry.id] = bitmapData.baseTexture.source["toDataURL"]();
                } else {
                    this.debugPrintln("Retrieving " + entry.id + " from cache...");
                }
                if (!entry.hasOwnProperty("frameSize")) {
                    game.load.image(entry.id, assetCache[entry.id]);
                } else {
                    game.load.spritesheet(entry.id, assetCache[entry.id], entry.frameSize[0], entry.frameSize[1]);
                }
            });
            localStorage.setItem('dynamicAssetCache', JSON.stringify(assetCache));
            return complete;
        }

        private create() : void {
            // this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
            this.time = 0;
            this.globalData = this.loadData(this.game);
            this.gameState = this.loadModel(this.game);
            this.controllers = this.createControllers();
            this.views = this.createView(this.gameState);
            // Set controllers
            this.controllers.forEach((function (controller : Controller<GameState>) { controller.initialize(this.gameState); }).bind(this));
        }

        private update() : void {
            this.debugText = "";
            // Update controllers
            this.controllers.forEach(function (controller : Controller<GameState>) { controller.update(1.0/60); });
            for (var property in this.gameState.entities) {
                if (this.gameState.entities.hasOwnProperty(property)) {
                    var entityCollection : AbstractEntityCollection = this.gameState.entities[property];
                    entityCollection.update(this.views);
                }
            }
            this.views.update();
            this.time += 1/60.0;
        }

        debugPrint(text : any) {
            this.debugText += "" + text;
            console.debug(text);
        }

        debugPrintln(text : any) {
            this.debugText += "" + text + "\n";
            console.debug(text + "\n");
        }

        protected abstract loadData(game : Phaser.Game) : GameData;

        protected abstract loadModel(game : Phaser.Game) : GameState;

        protected abstract createControllers() : Array<Controller<GameState>>;

        protected abstract createView(gameState : GameState) : GameView;

        protected abstract saveModel(gameState : GameState) : void;
    }

    export var GAME_ENGINE : GameEngine;
}
