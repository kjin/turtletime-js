namespace TurtleTime {
    import BaseTexture = PIXI.BaseTexture;
    import BitmapData = Phaser.BitmapData;

    export class ImageProcessing {
        static SINGLETON = new ImageProcessing();

        hueRotation = (game : Phaser.Game, sources : Array<string>, params : Array<any>) : BitmapData => {
            var amount : number = params[0];
            var texture:BaseTexture = game.cache.getBaseTexture(sources[0]);
            var bitmapData:BitmapData = game.make.bitmapData(texture.width, texture.height);
            bitmapData.copy(sources[0]);
            bitmapData.update();
            BitmapFilters.rotateHueFactory(amount)(bitmapData);
            return bitmapData;
        };

        stack = (game : Phaser.Game, sources : Array<string>, params : Array<any>) : BitmapData => {
            var textures : Array<BaseTexture> = sources.map((key : string) : BaseTexture => game.cache.getBaseTexture(key));
            var maxWidth : number = 0;
            var maxHeight : number = 0;
            for (var i = 0; i < textures.length; i++) {
                maxWidth = (maxWidth > textures[i].width) ? maxWidth : textures[i].width;
                maxHeight = (maxHeight > textures[i].height) ? maxHeight : textures[i].height;
            }
            var bitmapData:BitmapData = game.make.bitmapData(maxWidth, maxHeight);
            for (var i = 0; i < sources.length; i++) {
                bitmapData.draw(sources[i]);
            }
            return bitmapData;
        };
    }
}