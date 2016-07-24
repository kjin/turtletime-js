namespace TurtleTime {
    export class RGBColor {
        r : number;
        g : number;
        b : number;

        constructor(hex : number) {
            // rgb comes in the form 0xRRGGBB; break it down here
            this.r = ((hex & 0xFF0000) >>> 16) / 255.0;
            this.g = ((hex & 0x00FF00) >>> 8) / 255.0;
            this.b = (hex & 0x0000FF) / 255.0;
        }

        toHSV() : HSVColor {
            // these are output values and get combined into a single return value
            var out : HSVColor = new HSVColor();
            // magic starts here
            var min : number = Math.min(Math.min(this.r, this.g), this.b);
            var max : number = Math.max(Math.max(this.r, this.g), this.b);
            var delta : number = max - min;
            out.v = max;
            if (delta == 0) {
                out.s = out.h = 0;
                return out;
            }
            out.s = delta / max; // max cannot be 0 because then delta would be zero, and that's already covered
            if (this.r == max) {
                out.h = (this.g - this.b) / delta;
            } else if (this.g == max) {
                out.h = 2.0 + (this.b - this.r) / delta;
            } else { // this.b == max
                out.h = 4.0 + (this.r - this.g) / delta;
            }
            out.h *= 60.0; // degrees
            if (out.h < 0.0) {
                out.h += 360.0;
            }
            return out;
        }
    }

    export class HSVColor {
        h : number; // deg (0.0 - 360.0)
        s : number; // 0.0 - 1.0
        v : number; // 0.0 - 1.0

        toRGB() : RGBColor {
            var out : RGBColor = new RGBColor(0x0);

            if (this.s == 0) {
                out.r = out.g = out.b = this.v;
                return out;
            }
            var hh = this.h / 60.0;
            var i = Math.floor(hh);
            var ff = hh - i;
            var p = this.v * (1.0 - this.s);
            var q = this.v * (1.0 - this.s * ff);
            var t = this.v * (1.0 - (this.s * (1.0 - ff)));
            var assignOut = (r, g, b) : void => {
                out.r = r;
                out.g = g;
                out.b = b;
            };
            switch (i) {
                case 0:
                    assignOut(this.v, t, p);
                    break;
                case 1:
                    assignOut(q, this.v, p);
                    break;
                case 2:
                    assignOut(p, this.v, t);
                    break;
                case 3:
                    assignOut(p, q, this.v);
                    break;
                case 4:
                    assignOut(t, p, this.v);
                    break;
                case 5:
                    assignOut(this.v, p, q);
                    break;
            }
            return out;
        }
    }

    export module BitmapFilters {
        import BitmapData = Phaser.BitmapData;
        export function rotateHueFactory(amount : number) : (bitmapData : BitmapData) => void {
            return (bitmapData : BitmapData) : void => {
                for (var x = 0; x < bitmapData.width; x++) {
                    for (var y = 0; y < bitmapData.height; y++) {
                        var rgba : number = bitmapData.getPixel32(x, y);
                        var alpha : number = rgba & 0xFF;
                        if (alpha != 0) {
                            var rgb:number = (rgba & 0xFFFFFF00) >>> 8;
                            var hsvObject:HSVColor = new RGBColor(rgb).toHSV();
                            hsvObject.h += amount;
                            var rgbObject:RGBColor = hsvObject.toRGB();
                            bitmapData.setPixel32(x, y, rgbObject.r, rgbObject.g, rgbObject.b, alpha);
                        }
                    }
                }
            };
        }
    }
}