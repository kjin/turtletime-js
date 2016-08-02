module TurtleTime {
    export interface SpriteDirectionalFrameData {
        direction : string,
        frames : Array<number>
    }

    export interface SpriteAnimation {
        name : string,
        frames : Array<SpriteDirectionalFrameData>,
        frameRate? : number
    }

    export interface SpriteSpecs {
        spriteID : string,
        scale? : number,
        dimensions? : Array<number>,
        shape? : Array<string>,
        anchor? : Array<number>,
        tint? : string,
        animations? : Array<SpriteAnimation>,
        animationTemplate? : string
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
            } else {
                return {
                    spriteID: "core/loading",
                    scale: 1,
                    dimensions: [1, 1],
                    anchor: [0, 0],
                    tint: "0xFFFFFF",
                    animations: []
                }; // dummy
            }
        }
    }
}