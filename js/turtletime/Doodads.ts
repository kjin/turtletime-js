module TurtleTime {
    export class Table extends Entity {
        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'tableandchair',
                scale: 1
            });
            this.currentAction = 'stand';
        }

        assignSprite() : void {
            super.assignSprite();
            this.sprite.animations.add('l-stand', [0]);
            this.sprite.animations.add('d-stand', [0]);
            this.sprite.animations.add('r-stand', [0]);
            this.sprite.animations.add('u-stand', [0]);
        }
    }

    export class Chair extends Entity {
        constructor(x:number, y:number) {
            super(x, y, {
                spriteID: 'tableandchair',
                scale: 1
            });
            this.currentAction = 'stand';
        }

        assignSprite() : void {
            super.assignSprite();
            this.sprite.animations.add('l-stand', [1]);
            this.sprite.animations.add('d-stand', [1]);
            this.sprite.animations.add('r-stand', [1]);
            this.sprite.animations.add('u-stand', [1]);
        }
    }
}