module TurtleTime {
    import Rectangle = Phaser.Rectangle;
    class PercentageAndPixel {
        private _percentage : number = 0;
        private _pixel : number = 0;

        constructor(str : string) {
            var matchedArray : RegExpMatchArray = str.match("(\\+|-|)(\\d*\\.{0,1}\\d*)(%|px)\\s*(\\+|-)(\\s*\\d*\\.{0,1}\\d*)(%|px)");
            if (matchedArray == null) {
                matchedArray = str.match("(\\+|-|)(\\d*\\.{0,1}\\d*)(%|px)");
                if (matchedArray == null) {
                    return;
                }
            }
            if (matchedArray.length >= 3) {
                if (matchedArray[3] == "%") {
                    this._percentage += parseFloat(matchedArray[1] + matchedArray[2]) / 100;
                } else {
                    this._pixel += parseFloat(matchedArray[1] + matchedArray[2]);
                }
            }
            if (matchedArray.length >= 6) {
                if (matchedArray[6] == "%") {
                    this._percentage += parseFloat(matchedArray[4] + matchedArray[5]) / 100;
                } else {
                    this._pixel += parseFloat(matchedArray[4] + matchedArray[5]);
                }
            }
        }

        eval(outerValue : number) : number {
            return outerValue * this._percentage + this._pixel;
        }
    }

    class UIPoint {
        private _x : PercentageAndPixel;
        private _y : PercentageAndPixel;

        constructor(xStr : string, yStr : string) {
            this._x = new PercentageAndPixel(xStr);
            this._y = new PercentageAndPixel(yStr);
        }

        evalX(outerWidth : number) : number {
            return this._x.eval(outerWidth);
        }

        evalY(outerHeight : number) : number {
            return this._y.eval(outerHeight);
        }
    }

    export class UIContainer {
        private _anchor : Point;
        private _position : UIPoint;
        private _size : UIPoint;
        private _minSizePixels : Point = new Point(0, 0);
        private _maxSizePixels : Point = new Point(Infinity, Infinity);

        constructor(containerData : UIContainerData) {
            this._anchor = new Point(containerData.anchor[0], containerData.anchor[1]);
            this._position = new UIPoint(containerData.position[0], containerData.position[1]);
            this._size = new UIPoint(containerData.size[0], containerData.size[1]);
            if (containerData.hasOwnProperty("minSizePixels")) {
                this._minSizePixels.set(containerData["minSizePixels"][0], containerData["minSizePixels"][1]);
            }
            if (containerData.hasOwnProperty("maxSizePixels")) {
                this._maxSizePixels.set(containerData["maxSizePixels"][0], containerData["maxSizePixels"][1]);
            }
        }

        eval(outerRectangle : Rectangle) : Rectangle {
            var width = Phaser.Math.clamp(this._size.evalX(outerRectangle.width), this._minSizePixels.x, this._maxSizePixels.x);
            var height = Phaser.Math.clamp(this._size.evalY(outerRectangle.height), this._minSizePixels.y, this._maxSizePixels.y);
            return new Rectangle(
                outerRectangle.x + this._position.evalX(outerRectangle.width) - width * this._anchor.x,
                outerRectangle.y + this._position.evalY(outerRectangle.height) - height * this._anchor.y,
                width,
                height);
        }

        get anchorX() : number {
            return this._anchor.x;
        }

        get anchorY() : number {
            return this._anchor.y;
        }
    }
}