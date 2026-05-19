const DEFAULT_TIME_BUDGET_MS = 5000;
const POLLARD_RHO_MAX_ATTEMPTS = 96;
const POLLARD_RHO_MAX_STEPS_PER_ATTEMPT = 250000;
const DETERMINISTIC_MILLER_RABIN_MAX = (1n << 64n) - 1n;
const SMALL_FACTORS = [
    2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n,
    31n, 37n, 41n, 43n, 47n, 53n, 59n, 61n, 67n,
    71n, 73n, 79n, 83n, 89n, 97n,
];
const DETERMINISTIC_MILLER_RABIN_WITNESSES = [
    2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n,
];
const MILLER_RABIN_WITNESSES = [
    2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n,
    23n, 29n, 31n, 37n, 41n, 43n, 47n, 53n,
];

self.onmessage = (event) => {
    const { id, value, timeBudgetMs } = event.data;
    const deadline = Date.now() + Math.max(100, Number(timeBudgetMs) || DEFAULT_TIME_BUDGET_MS);

    try {
        const factors = factorFully(BigInt(value), deadline);

        self.postMessage({
            id,
            value,
            status: "resolved",
            factors: factors.map((factor) => factor.toString()),
        });
    } catch (error) {
        self.postMessage({
            id,
            value,
            status: "unknown",
            reason: error instanceof Error ? error.message : "factorization failed",
        });
    }
};

function factorFully(value, deadline) {
    const stack = [value];
    const factors = [];

    while (stack.length > 0) {
        assertTimeRemaining(deadline);
        const current = stack.pop();

        if (current < 2n) {
            continue;
        }

        if (isProbablePrime(current)) {
            factors.push(current);
            continue;
        }

        const divisor = findNonTrivialFactor(current, deadline);

        if (divisor === null || divisor <= 1n || divisor >= current) {
            throw new Error("cofactor timed out");
        }

        stack.push(divisor);
        stack.push(current / divisor);
    }

    return factors.sort(compareBigIntAscending);
}

function findNonTrivialFactor(value, deadline) {
    for (const factor of SMALL_FACTORS) {
        if (value === factor) {
            return null;
        }

        if (value % factor === 0n) {
            return factor;
        }
    }

    for (let attempt = 1; attempt <= POLLARD_RHO_MAX_ATTEMPTS; attempt += 1) {
        assertTimeRemaining(deadline);
        const attemptValue = BigInt(attempt);
        const c = ((attemptValue * attemptValue) % (value - 1n)) + 1n;
        let x = ((attemptValue * 17n + 2n) % (value - 2n)) + 2n;
        let y = x;

        for (let step = 0; step < POLLARD_RHO_MAX_STEPS_PER_ATTEMPT; step += 1) {
            if ((step & 1023) === 0) {
                assertTimeRemaining(deadline);
            }

            x = pollardStep(x, c, value);
            y = pollardStep(pollardStep(y, c, value), c, value);

            const divisor = gcd(absBigInt(x - y), value);

            if (divisor === value) {
                break;
            }

            if (divisor > 1n) {
                return divisor;
            }
        }
    }

    return null;
}

function pollardStep(value, c, modulus) {
    return (value * value + c) % modulus;
}

function isProbablePrime(value) {
    if (value < 2n) {
        return false;
    }

    for (const prime of SMALL_FACTORS) {
        if (value === prime) {
            return true;
        }

        if (value % prime === 0n) {
            return false;
        }
    }

    let oddPart = value - 1n;
    let powerOfTwo = 0;

    while (oddPart % 2n === 0n) {
        oddPart /= 2n;
        powerOfTwo += 1;
    }

    const witnesses = value <= DETERMINISTIC_MILLER_RABIN_MAX
        ? DETERMINISTIC_MILLER_RABIN_WITNESSES
        : MILLER_RABIN_WITNESSES;

    for (const witness of witnesses) {
        const base = witness % value;

        if (base < 2n) {
            continue;
        }

        if (isMillerRabinCompositeWitness(value, base, oddPart, powerOfTwo)) {
            return false;
        }
    }

    return true;
}

function isMillerRabinCompositeWitness(value, witness, oddPart, powerOfTwo) {
    let x = modPow(witness, oddPart, value);

    if (x === 1n || x === value - 1n) {
        return false;
    }

    for (let step = 1; step < powerOfTwo; step += 1) {
        x = (x * x) % value;

        if (x === value - 1n) {
            return false;
        }
    }

    return true;
}

function modPow(base, exponent, modulus) {
    let result = 1n;
    let currentBase = base % modulus;
    let currentExponent = exponent;

    while (currentExponent > 0n) {
        if (currentExponent % 2n === 1n) {
            result = (result * currentBase) % modulus;
        }

        currentBase = (currentBase * currentBase) % modulus;
        currentExponent /= 2n;
    }

    return result;
}

function gcd(a, b) {
    let left = a;
    let right = b;

    while (right !== 0n) {
        const remainder = left % right;
        left = right;
        right = remainder;
    }

    return left;
}

function absBigInt(value) {
    return value < 0n ? -value : value;
}

function compareBigIntAscending(a, b) {
    if (a === b) {
        return 0;
    }

    return a < b ? -1 : 1;
}

function assertTimeRemaining(deadline) {
    if (Date.now() > deadline) {
        throw new Error("cofactor timed out");
    }
}
