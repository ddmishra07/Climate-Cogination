
document.addEventListener('DOMContentLoaded', () => {
    const registrationForm = document.getElementById('registrationForm');
    const habitForm = document.getElementById('habitForm');
    const impactChartCtx = document.getElementById('impactChart').getContext('2d');
    const tipsDiv = document.getElementById('tips');

    registrationForm.addEventListener('submit', registerUser);
    habitForm.addEventListener('submit', logHabits);

    let userData = JSON.parse(localStorage.getItem('userData')) || {};
    let habitData = JSON.parse(localStorage.getItem('habitData')) || [];

    function registerUser(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;

        userData = { name, email };
        localStorage.setItem('userData', JSON.stringify(userData));
        alert('Registration Successful!');
    }

    function logHabits(event) {
        event.preventDefault();
        const water = document.getElementById('water').value;
        const energy = document.getElementById('energy').value;
        const recycling = document.getElementById('recycling').value;
        const exercise = document.getElementById('exercise').value;

        const newHabit = { water, energy, recycling, exercise, date: new Date().toISOString() };
        habitData.push(newHabit);
        localStorage.setItem('habitData', JSON.stringify(habitData));
        updateImpactDashboard();
        updateTips();
    }

    function updateImpactDashboard() {
        const labels = habitData.map(habit => new Date(habit.date).toLocaleDateString());
        const waterData = habitData.map(habit => habit.water);
        const energyData = habitData.map(habit => habit.energy);
        const recyclingData = habitData.map(habit => habit.recycling);
        const exerciseData = habitData.map(habit => habit.exercise);

        new Chart(impactChartCtx, {
            type: 'line',
            data: {
                labels,
                datasets: [
                    {
                        label: 'Water Usage (liters)',
                        data: waterData,
                        borderColor: 'blue',
                        fill: false
                    },
                    {
                        label: 'Energy Usage (kWh)',
                        data: energyData,
                        borderColor: 'green',
                        fill: false
                    },
                    {
                        label: 'Recycling (kg)',
                        data: recyclingData,
                        borderColor: 'orange',
                        fill: false
                    },
                    {
                        label: 'Exercise (minutes)',
                        data: exerciseData,
                        borderColor: 'red',
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Values'
                        }
                    }
                }
            }
        });
    }

    function updateTips() {
        tipsDiv.innerHTML = '';
        if (habitData.length > 0) {
            const lastEntry = habitData[habitData.length - 1];
            if (lastEntry.water > 100) {
                tipsDiv.innerHTML += '<p>Consider reducing your water usage. Small steps like fixing leaks and using water-saving appliances can make a big difference.</p>';
            }
            if (lastEntry.energy > 10) {
                tipsDiv.innerHTML += '<p>Reduce energy consumption by using energy-efficient appliances and turning off lights when not in use.</p>';
            }
            if (lastEntry.recycling < 1) {
                tipsDiv.innerHTML += '<p>Increase your recycling efforts. Segregate waste and recycle as much as possible.</p>';
            }
            if (lastEntry.exercise < 30) {
                tipsDiv.innerHTML += '<p>Try to get at least 30 minutes of exercise daily for better health and well-being.</p>';
            }
        }
    }

    updateImpactDashboard();
    updateTips();
});
