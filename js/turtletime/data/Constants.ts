/**
 * Constant values used throughout the game
 */
module TurtleTime {
    export var TURTLE_SPEED : number = 0.05;
    export var TURTLE_SPAWN_PROBABILITY_PER_SECOND : number = 0.1;

    export var LAYER_FLOOR : number = 0;
    export var LAYER_SPRITE_TURTLE : number = 29;
    export var LAYER_UI : number = 30;
    export var LAYER_DEBUG : number = 1000; // always highest layer
    export var LAYER_SPRITE_DOOR : number = 20;
    export var LAYER_SPRITE_CHAIR : number = 21;
    export var LAYER_SPRITE_TABLE : number = 22;
    
    export var EffectCircleDictionary = {
        unselectable: 0xff0000ff,
        hidden: 0xffffff00,
        normal: 0xffffffff,
        over: 0xff0000ff,
        highlighted: 0xffff00ff,
        selected: 0x00ff00ff
    };
}