module TurtleTime {
    export class Table extends EntityModel {
        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'tableandchair',
                scale: 1,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            { direction: Direction.Left, frames: [1] },
                            { direction: Direction.Down, frames: [1] },
                            { direction: Direction.Right, frames: [1] },
                            { direction: Direction.Up, frames: [1] }
                        ]
                    }
                ]
            });
            this.currentAction = 'stand';
        }
    }

    export class Chair extends EntityModel {
        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'tableandchair',
                scale: 1,
                animations: [
                    {
                        name: "stand",
                        frames: [
                            { direction: Direction.Left, frames: [1] },
                            { direction: Direction.Down, frames: [1] },
                            { direction: Direction.Right, frames: [1] },
                            { direction: Direction.Up, frames: [1] }
                        ]
                    }
                ]
            });
            this.currentAction = 'stand';
        }
    }
}