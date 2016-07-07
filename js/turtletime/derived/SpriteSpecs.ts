module TurtleTime {
    export interface SpriteDirectionalFrameData {
        direction : Direction,
        frames : Array<number>
    }

    export interface SpriteAnimation {
        name : string,
        frames : Array<SpriteDirectionalFrameData>
    }

    export interface SpriteSpecs {
        spriteID : String,
        scale : number,
        anchor: Array<number>,
        animations : Array<SpriteAnimation>
    }

    export class SpriteData {
        specMap : Map<string, Map<string, SpriteSpecs>>;

        constructor(json : any) {
            this.specMap = new Map();
            for (var category in json) {
                if (json.hasOwnProperty(category)) {
                    if (!this.specMap.has(category)) {
                        this.specMap.set(category, new Map());
                    }
                    for (var element in json[category]) {
                        if (json[category].hasOwnProperty(element)) {
                            this.specMap.get(category).set(element, json[category][element]);
                        }
                    }
                }
            }
        }

        getSpriteSpecs(category : string, element : string) : SpriteSpecs {
            if (this.specMap.has(category) && this.specMap.get(category).has(element)) {
                return this.specMap.get(category).get(element);
            }
            return null;
        }
    }
}