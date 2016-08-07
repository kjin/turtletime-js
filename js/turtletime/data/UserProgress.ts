namespace TurtleTime {
    export interface Rating {
        numStars : number
    }

    export interface TurtleDiscoveryProgress {
        turtleID : string,
        sightings : number
    }

    export interface FoodDiscoveryProgress {
        foodID : string
    }

    export interface UserProgress {
        ratingLog: Array<Rating>,
        turtles: Array<TurtleDiscoveryProgress>,
        food: Array<FoodDiscoveryProgress>
    }
}