module TurtleTime {
    // helper function for boilerplate code
    // regex: this\.(.*) = data\.hasOwnProperty\(\".*\"\) \? data\..* :\s+\(base \? base\..* : (.*)\);
    // replace: this.$1 = getField(data, base, "$1", $2);
    function getField<DataType, ModelType, FieldType>(data : DataType, base : ModelType, fieldName : string, defaultValue : FieldType) {
        return data.hasOwnProperty(fieldName) ? data[fieldName] : ((base && base.hasOwnProperty(fieldName)) ? base[fieldName] : defaultValue);
    }

    export class UISprite {
        spriteID : string;
        category : string;
        animation : string;
        tint : number;
        
        constructor(data : UISpriteData, base : UISprite) {
            this.spriteID = getField(data, base, "spriteID", "");
            this.category = getField(data, base, "category", "ui");
            this.animation = getField(data, base, "animation", "default");
            this.tint = data.hasOwnProperty("tint") ? parseInt(data.tint) : (base ? base.tint : 0xFFFFFF);
        }
    }
    
    export class UIText {
        text : string;
        font : string;
        size : number;
        valign : string;
        justify : string;
        tint : number;
        
        constructor(data : UITextData, base : UIText) {
            this.text = getField(data, base, "text", "");
            this.font = getField(data, base, "font", "");
            this.size = getField(data, base, "size", 12);
            this.justify = getField(data, base, "justify", "center");
            this.valign = getField(data, base, "valign", "middle");
            this.tint = data.hasOwnProperty("tint") ? parseInt(data.tint) : (base ? base.tint : 0xFFFFFF);
        }
    }

    export class UIGeometry {
        fillColor : number;
        lineColor : number;
        lineWeight : number;
        cornerRadius : number;

        constructor(data : UIGeometryData, base : UIGeometry) {
            this.fillColor = data.hasOwnProperty("fillColor") ? parseInt(data.fillColor) : (base ? base.fillColor : 0x000000);
            this.lineColor = data.hasOwnProperty("lineColor") ? parseInt(data.lineColor) : (base ? base.lineColor : 0xFFFFFF);
            this.lineWeight = data.hasOwnProperty("lineWeight") ? parseInt(data.lineWeight) : (base ? base.lineWeight : 1);
            this.cornerRadius = data.hasOwnProperty("cornerRadius") ? parseInt(data.cornerRadius) : (base ? base.cornerRadius : 0);
        }
    }

    export class UIAppearance {
        sprite : UISprite;
        text : UIText;
        geometry : UIGeometry;

        constructor(data : UIAppearanceData, base : UIAppearance = null) {
            if (data.hasOwnProperty("sprite")) {
                this.sprite = new UISprite(data.sprite, base ? base.sprite : null);
            }
            if (data.hasOwnProperty("text")) {
                this.text = new UIText(data.text, base ? base.text : null);
            }
            if (data.hasOwnProperty("geometry")) {
                this.geometry = new UIGeometry(data.geometry, base ? base.geometry : null);
            }
        }
    }

    export class UIAppearanceCollection {
        normal : UIAppearance;
        toggled : UIAppearance;

        constructor(data : UIAppearanceCollectionData) {
            if (data == null || data.normal == null) {
                this.normal = new UIAppearance({});
            } else {
                this.normal = new UIAppearance(data.normal);
                this.toggled = data.hasOwnProperty("toggled") ? new UIAppearance(data.toggled, this.normal) : null;
            }
        }
    }
}