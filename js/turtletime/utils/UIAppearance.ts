// TODO: Fill in default values

module TurtleTime {
    export class UISprite {
        spriteID : string;
        tint : number;
        
        constructor(data : UISpriteData) {
            this.spriteID = data.hasOwnProperty("spriteID") ? data.spriteID : "";
            this.tint = data.hasOwnProperty("tint") ? parseInt(data.tint) : 0xFFFFFF;
        }
    }
    
    export class UIText {
        text : string;
        font : string;
        size : number;
        justify : string;
        tint : number;
        
        constructor(data : UITextData) {
            this.text = data.hasOwnProperty("text") ? data.text : "";
            this.font = data.hasOwnProperty("font") ? data.font : "";
            this.size = data.hasOwnProperty("size") ? data.size : 12;
            this.justify = data.hasOwnProperty("justify") ? data.justify : "center";
            this.tint = data.hasOwnProperty("tint") ? parseInt(data.tint) : 0xFFFFFF;
        }
    }

    export class UIGeometry {
        fillColor : number;
        lineColor : number;
        lineWeight : number;
        cornerRadius : number;

        constructor(data : UIGeometryData) {
            this.fillColor = data.hasOwnProperty("fillColor") ? parseInt(data.fillColor) : 0x000000;
            this.lineColor = data.hasOwnProperty("lineColor") ? parseInt(data.lineColor) : 0xFFFFFF;
            this.lineWeight = data.hasOwnProperty("lineWeight") ? parseInt(data.lineWeight) : 1;
            this.cornerRadius = data.hasOwnProperty("cornerRadius") ? parseInt(data.cornerRadius) : 0;
        }
    }

    export class UIAppearance {
        sprite : UISprite;
        text : UIText;
        geometry : UIGeometry;

        constructor(data : UIAppearanceData) {
            if (data.hasOwnProperty("sprite")) {
                this.sprite = new UISprite(data.sprite);
            }
            if (data.hasOwnProperty("text")) {
                this.text = new UIText(data.text);
            }
            if (data.hasOwnProperty("geometry")) {
                this.geometry = new UIGeometry(data.geometry);
            }
        }
    }

    export class UIAppearanceCollection {
        normal : UIAppearance;
        onHover : UIAppearance;
        onClick : UIAppearance;

        constructor(data : UIAppearanceCollectionData) {
            this.normal = new UIAppearance(data.normal);
        }
    }
}