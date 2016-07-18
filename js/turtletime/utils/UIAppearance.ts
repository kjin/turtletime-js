module TurtleTime {
    export abstract class AbstractUIAppearanceModule {}
    
    export class UISprite extends AbstractUIAppearanceModule {
        spriteID : string;
        tint : number;
        
        constructor(data : UISpriteData) {
            super();
            this.spriteID = data.spriteID;
            this.tint = data.tint;
        }
    }
    
    export class UIText extends AbstractUIAppearanceModule {
        text : string;
        justify : Point;
        tint : number;
        
        constructor(data : UITextData) {
            super();
            this.text = data.text;
            this.justify = new Point(data.justify[0], data.justify[1]);
            this.tint = parseInt(data.tint);
        }
    }

    export class UIEmpty extends AbstractUIAppearanceModule {}

    export class UIAppearance {
        normal : AbstractUIAppearanceModule;
        onHover : AbstractUIAppearanceModule;
        onClick : AbstractUIAppearanceModule;

        constructor(data : UIAppearanceData) {
            var createModule = (innerData : UISpriteData|UITextData|{}) : AbstractUIAppearanceModule => {
                if (innerData.hasOwnProperty("spriteID")) {
                    return new UISprite(<UISpriteData>innerData);
                } else if (innerData.hasOwnProperty("text")) {
                    return new UIText(<UITextData>innerData);
                } else {
                    return new UIEmpty();
                }
            };
            this.normal = createModule(data.normal);
        }
    }
}