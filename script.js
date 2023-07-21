function addInputFields() {
    const inputContainer = document.getElementById('inputContainer');

    const inputDiv = document.createElement('div');
    inputDiv.className = 'inputDiv'; // Add the 'inputDiv' class to the new div

    inputDiv.innerHTML = `
        <label for="x">X:</label>
        <input type="number" name="x" required>
        <label for="y">Y:</label>
        <input type="number" name="y" required>
        <input type="button" value="X" onclick="removeInputField(this)">
    `;

    inputContainer.appendChild(inputDiv);
}

function removeInputField(button) {
    const inputContainer = document.getElementById('inputContainer');
    inputContainer.removeChild(button.parentNode);
}

document.getElementById('coordinateForm').addEventListener('submit', function (event) {
    event.preventDefault();
    const formElements = document.querySelectorAll('.inputDiv input[type="number"]');
    const points = [];

    formElements.forEach((inputElement, index) => {
        if (index % 2 === 0) {
            const x = inputElement.value;
            const y = formElements[index + 1].value;
            if (x !== '' && y !== '') {
                points.push({ x: Number(x), y: Number(y) });
            }
        }
    });
    console.log(points);
    // Call your function with the array of points

    GeometricMedianCalculator.findCenter(points);
    console.log(points);
    // Reset the form
    event.target.reset();
});

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        return "(x=" + this.x + ",y=" + this.y + ")";
    }

    equals(other) {
        return this.x === other.x && this.y === other.y;
    }
}

class GeometricMedianCalculator {
    static calculateMamanhattanDistance(p1, p2) {
        return Math.abs(p1.x - p2.x) + Math.abs(p1.y - p2.y);
    }

    static findRoundTripDistance(p, factoriesLocation) {
        let d = 0;
        for (const location of factoriesLocation) {
            if (p.equals(location)) {
                console.log("called");
                return Number.MAX_VALUE;
            }
            d += GeometricMedianCalculator.calculateMamanhattanDistance(p, location);
        }
        return d;
    }

    static findCenter(factoriesLocation) {
        let minX = Number.MAX_VALUE;
        let minY = Number.MAX_VALUE;
        let maxX = Number.MIN_VALUE;
        let maxY = Number.MIN_VALUE;

        for (const location of factoriesLocation) {
            minX = Math.min(minX, location.x);
            minY = Math.min(minY, location.y);
            maxX = Math.max(maxX, location.x);
            maxY = Math.max(maxY, location.y);
        }

        const grid = new Array(maxY - minY + 1).fill(null).map(() => new Array(maxX - minX + 1).fill(0));
        let center = new Point(-1, -1);
        let minimumRoundTripDistance = Number.MAX_VALUE;

        for (let i = minY; i <= maxY; i++) {
            for (let j = minX; j <= maxX; j++) {
                const res = GeometricMedianCalculator.findRoundTripDistance(new Point(j, i), factoriesLocation);
                if (res !== Number.MAX_VALUE) {
                    grid[i - minY][j - minX] = res;
                }
                else
                    grid[i - minY][j - minX] = '🏭';
                if (res <= minimumRoundTripDistance) {
                    minimumRoundTripDistance = res;
                    center = new Point(j, i);
                }
            }
        }

        // Call the function to display the grid as an HTML table
        this.displayGridAsTable(grid, minX, minY, center, minimumRoundTripDistance);

        return center;
    }

    // Function to display the grid as an HTML table
    // Function to display the grid as an HTML table
    static displayGridAsTable(grid, minX, minY, center, minimumRoundTripDistance) {

        const table = document.createElement('table');
        const tbody = document.createElement('tbody');

        // Table header
        const headerRow = document.createElement('tr');
        const headerCellCount = grid[0].length;
        for (let i = 0; i < headerCellCount; i++) {
            const th = document.createElement('th');
            th.textContent = `${minX + i}`;
            headerRow.appendChild(th);
        }

        headerRow.insertAdjacentHTML('afterbegin', '<th>Y/X</th>');
        tbody.appendChild(headerRow);

        let possibleCenterList = [];


        for (let i = 0; i < grid.length; i++) {
            const row = document.createElement('tr');
            const rowCellCount = grid[i].length;
            for (let j = 0; j < rowCellCount; j++) {
                const cell = document.createElement('td');
                cell.textContent = grid[i][j];
                if (grid[i][j] === minimumRoundTripDistance) {
                    possibleCenterList.push(new Point(minX + j , minY + i))
                    cell.classList.add('possibleCenter');
                }
                row.appendChild(cell);
            }
            const th = document.createElement('th');
            th.textContent = `${minY + i}`;
            row.insertAdjacentElement('afterbegin', th);
            tbody.appendChild(row);
        }

        table.appendChild(tbody);
        document.body.appendChild(table);

        // Display the information about the center and minimum round trip distance
        const infoDiv = document.createElement('div');

        infoDiv.innerHTML = `Possible Centers: [${Array.from(possibleCenterList).join(', ')}]<br>Minimum Round Trip Distance: ${minimumRoundTripDistance}`;
        document.body.appendChild(infoDiv);
    }


}