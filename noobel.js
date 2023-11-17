document.addEventListener('DOMContentLoaded', function () {
    fetchPrizes();
});

function fetchPrizes() {
    const apiUrl = 'https://api.nobelprize.org/v1/prize.json';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            window.prizes = data.prizes;
            handlePrizes(window.prizes);
        })
        .catch(error => {
            console.error('Error fetching prizes:', error);
        });
}

function handlePrizes(prizes) {
    populateDropdowns(prizes);
    displayMultipleWinners(prizes);
    displayWinners(prizes); // Display all winners initially
}

function populateDropdowns(prizes) {
    const categoryDropdown = document.getElementById('category');
    const yearDropdown = document.getElementById('year');

    // Get unique categories and years
    const categories = [...new Set(prizes.map(prize => prize.category))];
    const years = [...new Set(prizes.map(prize => prize.year))];

    categories.unshift('All'); // Add an option for all categories

    // Populate category dropdown
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categoryDropdown.appendChild(option);
    });

    // Populate year dropdown
    years.forEach(year => {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = year;
        yearDropdown.appendChild(option);
    });
}

function displayFilteredWinners() {
    const selectedCategory = document.getElementById('category').value;
    const selectedYear = parseInt(document.getElementById('year').value);

    const filteredPrizes = window.prizes.filter(prize => {
        const isCategoryMatch = selectedCategory === 'All' || prize.category === selectedCategory;
        const isYearMatch = isNaN(selectedYear) || prize.year === selectedYear;
        return isCategoryMatch && isYearMatch;
    });

    displayWinners(filteredPrizes);
}

function displayWinners(prizes) {
    const winnersList = document.getElementById('winners-list');
    winnersList.innerHTML = '';

    if (!prizes || prizes.length === 0) {
        const noResultsElement = document.createElement('div');
        noResultsElement.textContent = 'No prizes found.';
        winnersList.appendChild(noResultsElement);
    } else {
        prizes.forEach(prize => {
            const prizeElement = document.createElement('div');
            prizeElement.className = 'prize';
            prizeElement.innerHTML = `<strong>${prize.category}</strong> (${prize.year}): ${prize.motivation}`;

            if (prize.laureates && prize.laureates.length > 0) {
                const laureateList = document.createElement('ul');
                prize.laureates.forEach(laureate => {
                    const laureateItem = document.createElement('li');
                    laureateItem.textContent = `Winner: ${laureate.firstname} ${laureate.surname}`;
                    laureateList.appendChild(laureateItem);
                });
                prizeElement.appendChild(laureateList);
            }

            winnersList.appendChild(prizeElement);
        });
    }
}

function displayMultipleWinners(prizes) {
    const multipleWinnersSection = document.getElementById('multiple-winners');
    multipleWinnersSection.innerHTML = '';

    const laureateCounts = {};

    prizes.forEach(prize => {
        if (prize.laureates && Array.isArray(prize.laureates)) {
            prize.laureates.forEach(laureate => {
                const fullName = `${laureate.firstname} ${laureate.surname}`;
                if (laureateCounts[fullName]) {
                    laureateCounts[fullName]++;
                } else {
                    laureateCounts[fullName] = 1;
                }
            });
        }
    });

    Object.keys(laureateCounts).forEach(name => {
        if (laureateCounts[name] > 1) {
            const winnerElement = document.createElement('div');
            winnerElement.textContent = `${name}: ${laureateCounts[name]} times`;
            multipleWinnersSection.appendChild(winnerElement);
        }
    });
}
