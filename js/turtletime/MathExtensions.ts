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
     * Linearly interpolates a value between a and b.
     * @param a The value to return at t = 0.
     * @param b The value to return at t = 1.
     * @param t The interpolation parameter.
     * @returns {number} The linearly interpolated result.
     */
    export function lerp(a : number, b : number, t : number) : number {
        return (1 - t) * a + t * b;
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

    /**
     * If x is positive, returns the fractional part of x. If x is negative, returns one minus the fractional
     * part of x instead.
     * @param x The input argument.
     * @returns {number} A number within the range [0, 1].
     */
    export function sawtoothWave(x : number) : number {
        if (x < 0) {
            return 1 - x + Math.ceil(x);
        }
        return x - Math.floor(x);
    }

    export function triangleWaveFactory(peak : number) : (x : number) => number {
        if (peak == 0) {
            return (x : number) : number => 1 - sawtoothWave(x);
        } else if (peak == 1) {
            return sawtoothWave;
        } else {
            return (x : number) : number => {
                x = sawtoothWave(x);
                if (x < peak) {
                    return x / peak;
                } else {
                    return (1 - x) / (1 - peak);
                }
            };
        }
    }
}