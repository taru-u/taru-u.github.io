// app.js

// Define color sets
const colorSets = {
    simple: ['#fff', '#e22', '#15f', '#1b1', '#ee2', '#e61', '#841', '#81e', '#f4f', '#1ee', '#666'],
    extended: ['#fff', '#e22', '#15f', '#1b1', '#ee2', '#e61', '#841', '#81e', '#f4f', '#1ee', '#8f2', '#f99', '#99f', '#9f9', '#ff9', '#aff', '#f9f', '#880606', '#0606cc', '#066606', '#888806', '#088', '#880688', '#955', '#559', '#595', '#995', '#599', '#959', '#bbb', '#666', '#333'],
    colorblind: ['#fff', '#F0E442', '#0072B2', '#409E73', '#76c4E9', '#D55E00', '#889', '#505005', '#1111af', '#444'],
};

// Set current color set
let currentColorSetName = 'simple'; // Default color set
let currentColorSet = colorSets[currentColorSetName];
// Gradient directions
const gradientDirections = [
    'to bottom',          // Default
    'to right',
    'to bottom right',
    'to bottom left'
];

// Variables for color assignments
let primeIndices = {}; // Map prime numbers to their correct indices
let assignedColors = {}; // Map numbers to their assigned colors

// Precompute primes up to a maximum limit
const MAX_PRIME = 5000000; // Adjust this limit as needed
let primesArray = [];

// Function to generate primes up to MAX_PRIME using the Sieve of Eratosthenes
function generatePrimesUpTo(max) {
    const sieve = new Uint8Array(max + 1);
    sieve.fill(1);
    sieve[0] = sieve[1] = 0;
    for (let i = 2; i * i <= max; i++) {
        if (sieve[i]) {
            for (let j = i * i; j <= max; j += i) {
                sieve[j] = 0;
            }
        }
    }
    let index = 1; // Start indexing from 1 for prime number 2
    for (let i = 2; i <= max; i++) {
        if (sieve[i]) {
            primesArray.push(i);
            primeIndices[i] = index;
            index++;
        }
    }
}

// Generate the primes and indices once
generatePrimesUpTo(MAX_PRIME);

// Function to set the current color set
function setCurrentColorSet(name) {
    currentColorSetName = name;
    currentColorSet = colorSets[currentColorSetName];
    initializeAssignedColors(); // Re-initialize colors
    const startNumber = parseInt(document.getElementById('startNumberInput').value) || 1;
    currentEndNumber = BigInt(0); // Reset current end number
    generateGrid(startNumber, 400, true); // Regenerate the grid with new colors
}

// Initialize assigned colors based on prime indices
function initializeAssignedColors() {
    assignedColors = {};
    const baseColors = currentColorSet;
    const numBaseColors = baseColors.length;
    const numDirections = gradientDirections.length;
    const totalCombinations = numBaseColors * (numBaseColors - 1);
    const totalGradients = totalCombinations * numDirections;
    const combinations = generateColorCombinations(baseColors);

    // Assign white color to 1
    assignedColors[1] = { type: 'solid', color: baseColors[0] };

    // Assign base colors to the first few primes
    for (let i = 0; i < primesArray.length; i++) {
        const prime = primesArray[i];
        const index = i + 1; // Prime index starting from 1 for prime number 2

        if (index <= numBaseColors - 1) {
            // Assign base colors starting from the second color
            assignedColors[prime] = { type: 'solid', color: baseColors[index] };
        } else if (index <= (numBaseColors - 1) + totalGradients) {
            // Assign gradients with different directions
            const gradientIndex = index - (numBaseColors - 1) - 1;
            const combinationIndex = gradientIndex % totalCombinations;
            const directionIndex = Math.floor(gradientIndex / totalCombinations);

            if (directionIndex < gradientDirections.length) {
                const [color1, color2] = combinations[combinationIndex];
                const direction = gradientDirections[directionIndex];
                assignedColors[prime] = { type: 'gradient', color1, color2, direction };
            } else {
                // Beyond available combinations and directions, assign default color
                assignedColors[prime] = { type: 'solid', color: 'black' };
            }
        } else {
            // Assign default color
            assignedColors[prime] = { type: 'solid', color: 'black' };
        }
    }
}

// Function to generate color combinations (excluding same-color pairs)
function generateColorCombinations(colors) {
    const combinations = [];
    for (let i = 0; i < colors.length; i++) {
        for (let j = 0; j < colors.length; j++) {
            if (i !== j) {
                combinations.push([colors[i], colors[j]]);
            }
        }
    }
    return combinations;
}

// Function to get prime factors
function getPrimeFactors(n) {
    const factors = [];
    let remainder = BigInt(n);
    let i = 0;

    if (remainder === BigInt(1)) {
        return [BigInt(1)];
    }

    while (remainder > BigInt(1) && i < primesArray.length) {
        const prime = BigInt(primesArray[i]);
        while (remainder % prime === BigInt(0)) {
            factors.push(prime);
            remainder /= prime;
        }
        i++;
    }

    if (remainder > BigInt(1)) {
        // Remainder is a prime larger than MAX_PRIME
        factors.push(remainder);
        // Assign default color
        if (!(remainder in assignedColors)) {
            assignedColors[remainder] = { type: 'solid', color: 'black' };
        }
    }

    return factors;
}

// Function to get the index of a prime number
function getPrimeIndex(primeNumber) {
    const primeNum = Number(primeNumber);
    if (primeIndices[primeNum]) {
        return primeIndices[primeNum];
    } else {
        // Improved approximation for the prime counting function π(x)
        const x = Number(primeNumber);
        const lnX = Math.log(x);
        const approxIndex = Math.ceil(x / (lnX - 1)) + 1891;
        return '~' + approxIndex;
    }
}

// Function to check for special numbers
function getSpecialSymbol(n) {
    let str = '';

    if (isPerfectSquare(n)) {
        str += '◻'; // Square symbol
    }
    if (isPerfectCube(n)) {
        str += '∛'; // Cube symbol
    }
    if (isTriangularNumber(n)) {
        str += '△'; // Triangle symbol
    }
    // Add more conditions for other shapes
    return str;
}

// Function to compute the integer square root of a BigInt
function integerSqrt(n) {
    if (n < 0n) throw new Error('square root of negative numbers is not supported');
    if (n < 2n) return n;

    let x0 = n / 2n;
    let x1 = (x0 + n / x0) / 2n;

    while (x1 < x0) {
        x0 = x1;
        x1 = (x0 + n / x0) / 2n;
    }
    return x0;
}// Function to compute the integer cube root of a BigInt
function integerCbrt(n) {
    if (n < 0n) throw new Error('cube root of negative numbers is not supported');
    if (n === 0n) return 0n;

    let x0 = n;
    let x1 = (2n * x0 + n / (x0 * x0)) / 3n;

    while (x1 < x0) {
        x0 = x1;
        x1 = (2n * x0 + n / (x0 * x0)) / 3n;
    }
    return x0;
}
// Function to check if a BigInt is a perfect square
function isPerfectSquare(n) {
    const sqrtN = integerSqrt(n);
    return sqrtN * sqrtN === n;
}

// Function to check if a BigInt is a perfect cube
function isPerfectCube(n) {
    const cbrtN = integerCbrt(n);
    return cbrtN * cbrtN * cbrtN === n;
}
// Function to check if a number is triangular
function isTriangularNumber(n) {
    // A number n is triangular if 8n + 1 is a perfect square
    const eightNPlusOne = 8n * n + 1n;
    return isPerfectSquare(eightNPlusOne);
}


// Function to create a ball element
function createBall(factor) {
    const factorStr = factor.toString();
    const factorNum = Number(factor); // For looking up assignedColors

    const colorObj = assignedColors[factorNum] || { type: 'solid', color: 'black' };
    const ball = document.createElement('div');
    ball.className = 'ball';

    if (colorObj.type === 'solid') {
        ball.style.backgroundColor = colorObj.color;
    } else if (colorObj.type === 'gradient') {
        ball.style.backgroundImage = `linear-gradient(${colorObj.direction}, ${colorObj.color1}, ${colorObj.color1} 30%, ${colorObj.color2} 70%, ${colorObj.color2} 100%)`;
    } else {
        ball.style.backgroundColor = '#000'; // Default to black
    }

    // Ensure the background covers the entire ball
    ball.style.backgroundClip = 'border-box';

    // Add hover event listeners
    ball.addEventListener('mouseover', function (e) {
        // Add white border using box-shadow
        ball.style.boxShadow = '0 0 0 2px white';

        // Create tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'tooltip';

        // Compute prime index
        const primeIndex = getPrimeIndex(factor);
        const primeNumber = factorStr;

        if (factor === BigInt(1)) {
            tooltip.textContent = `${primeNumber}`;
        } else {
            tooltip.textContent = `p[${primeIndex}], ${primeNumber}`;
        }

        // Position the tooltip
        document.body.appendChild(tooltip);

        // Update tooltip position
        function updateTooltipPosition(e) {
            // Temporarily position tooltip to get dimensions
            tooltip.style.left = '0px';
            tooltip.style.top = '0px';
            tooltip.style.visibility = 'hidden';
        
            const tooltipRect = tooltip.getBoundingClientRect();
            const tooltipWidth = tooltipRect.width;
            const tooltipHeight = tooltipRect.height;
        
            tooltip.style.visibility = 'visible';
        
            let left = e.pageX;
            let top = e.pageY - 30; // Position above the cursor
        
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
        
            tooltip.style.left = left + 'px';
            tooltip.style.top = top + 'px';
        }
        // Update tooltip position
        updateTooltipPosition(e);

        // Store the tooltip and handler in the ball element
        ball._tooltip = tooltip;
        ball._updateTooltipPosition = updateTooltipPosition;

        // Update position on mouse move
        ball.addEventListener('mousemove', updateTooltipPosition);
    });

    ball.addEventListener('mouseout', function () {
        // Remove box-shadow
        ball.style.boxShadow = 'none';

        // Remove tooltip
        if (ball._tooltip) {
            document.body.removeChild(ball._tooltip);
            ball._tooltip = null;
        }

        // Remove mousemove event listener
        if (ball._updateTooltipPosition) {
            ball.removeEventListener('mousemove', ball._updateTooltipPosition);
            ball._updateTooltipPosition = null;
        }
    });

    return ball;
}
// Function to format BigInt with spaces as thousand separators
function formatBigIntWithSpaces(n) {
    const nStr = n.toString();
    // Regular expression to insert space every three digits from the right
    const regex = /\B(?=(\d{3})+(?!\d))/g;
    return nStr.replace(regex, ",");
}
// Declare global variables
let currentEndNumber = BigInt(0);
let isLoading = false;

// Generate the grid
function generateGrid(startNumber, numberOfNumbers, clearGrid = true) {
    const gridContainer = document.getElementById('grid-container');
    // Only clear the grid when clearGrid is true
    if (clearGrid) {
        gridContainer.innerHTML = ''; // Clear existing content
    }

    const startNum = parseInt(startNumber) < 1 ? BigInt(1) : BigInt(startNumber);
    const endNum = startNum + BigInt(numberOfNumbers) - BigInt(1);

    for (let i = startNum; i <= endNum; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';

        // Reduce font size if number is greater than 1 million
        if (i > 999999n) {
            gridItem.classList.add('small-font');
        }

        // Display the number
        const numberDiv = document.createElement('div');
        numberDiv.className = 'number';

        // Format the number with spaces
        const formattedNumber = formatBigIntWithSpaces(i);

        // Display the number with special symbol
        const specialSymbol = getSpecialSymbol(i);
        numberDiv.textContent = specialSymbol ? `${formattedNumber} ${specialSymbol}` : formattedNumber;

        gridItem.appendChild(numberDiv);

        // Get prime factors
        const factors = getPrimeFactors(i);

        // Create ball container
        const ballContainer = document.createElement('div');
        ballContainer.className = 'ball-container';

        // Adjust layout based on the number of factors
        const numFactors = factors.length;
        if (numFactors === 3) {
            ballContainer.classList.add('two-rows-3-factors');
        } else if (numFactors === 4) {
            ballContainer.classList.add('two-rows-4-factors');
        }

        // Create balls for each factor
        factors.forEach((factor) => {
            const ball = createBall(factor);
            ballContainer.appendChild(ball);
        });

        gridItem.appendChild(ballContainer);

        // Add click event listener for future visualizations
        gridItem.addEventListener('click', () => {
            // Placeholder for visualization function
            alert(`Number clicked: ${formattedNumber}`);
        });

        gridContainer.appendChild(gridItem);
    }

    currentEndNumber = endNum; // Update the current end number

    isLoading = false; // Reset the loading flag
}

// Event listener for color set selection
document.getElementById('colorSetSelect').addEventListener('change', function () {
    setCurrentColorSet(this.value);
});

// Event listener for Generate Grid button
document.getElementById('generateButton').addEventListener('click', function () {
    const startNumber = document.getElementById('startNumberInput').value || '1';
    currentEndNumber = BigInt(0); // Reset current end number
    generateGrid(startNumber, 400, true); // Load initial 400 items
});

window.addEventListener('scroll', function() {
    if (isLoading) return;

    const scrollPosition = window.scrollY + window.innerHeight;
    const totalHeight = document.body.offsetHeight;

    if (totalHeight - scrollPosition < 500) { // Threshold can be adjusted
        isLoading = true;
        const nextStartNumber = currentEndNumber + BigInt(1);
        const numberOfNumbersToLoad = 200;
        generateGrid(nextStartNumber, numberOfNumbersToLoad, false); // Append to grid
    }
});

// Initialize assigned colors
initializeAssignedColors();

// Load initial 400 numbers
const initialStartNumber = 1;
const initialNumberOfNumbers = 400;
generateGrid(initialStartNumber, initialNumberOfNumbers);
