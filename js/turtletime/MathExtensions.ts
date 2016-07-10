namespace MathExtensions {
    /**
     * Returns the distance squared between two points at (x1, y1) and (x2, y2) respectively.
     * @param x1 The first coordinate of the first point.
     * @param y1 The second coordinate of the first point.
     * @param x2 The first coordinate of the second point.
     * @param y2 The second coordinate of the second point.
     * @returns {number} The distance squared between the two input points.
     */
    export function dist2(x1 : number, y1 : number, x2 : number, y2 : number) : number {
        return (x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2);
    }

    /**
     * If x is positive, returns 0 if the fractional part of x is less than 0.5, and 1 otherwise.
     * If x is negative, the above return values are reversed.
     * @param x The input argument.
     * @returns {number} Either 0 or 1.
     */
    export function squareWave(x : number) : number {
        if (x < 0) {
            return (x - Math.ceil(x) < 0.5) ? 0 : 1;
        }
        return (x - Math.floor(x) < 0.5) ? 0 : 1;
    }
}