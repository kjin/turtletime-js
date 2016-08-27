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

    export interface UserProgressData {
        ratingLog: Array<Rating>,
        turtles: Array<TurtleDiscoveryProgress>,
        food: Array<FoodDiscoveryProgress>
    }
}