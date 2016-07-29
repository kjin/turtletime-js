/**
 * Constant values used throughout the game
 */
module TurtleTime {
    export var TURTLE_SPEED : number = 0.05;
    export var TURTLE_SPAWN_PROBABILITY_PER_SECOND : number = 0.1;

    export var UI_FADE_TIME : number = 0.2;
    export var UI_DRAG_Y_OFFSET : number = 72;

    export var LAYER_FLOOR : number = 0;
    export var LAYER_UI : number = 30;
    export var LAYER_DEBUG : number = 1000; // always highest layer
    export var LAYER_SPRITE : number = 20;
    
    export var EffectCircleDictionary = {
        unselectable: 0xff0000ff,
        hidden: 0xffffff00,
        normal: 0xffffffff,
        over: 0xff0000ff,
        highlighted: 0xffff00ff,
        selected: 0x00ff00ff
    };
}