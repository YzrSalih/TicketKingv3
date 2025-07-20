let userEmail = '';

// Kod gönderme işlemi
document.getElementById('login-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    userEmail = document.getElementById('email').value;

    try {
        const response = await fetch('http://localhost:3002/api/send-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Verification code sent to your email.');

            document.getElementById('login-form').style.display = 'none';
            document.getElementById('code-form').style.display = 'block';
        } else {
            alert(data.message || 'Failed to send code.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Something went wrong while sending the code!');
    }
});

// Kod doğrulama işlemi
document.getElementById('code-form').addEventListener('submit', async function (e) {
    e.preventDefault();

    const code = document.getElementById('verification-code').value;

    try {
        const response = await fetch('http://localhost:3002/api/verify-code', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userEmail, code })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Login successful!');
            // Email bilgisini localStorage'a kaydet
            localStorage.setItem('userEmail', userEmail);

            // Close only the login modal
            document.getElementById('login-modal').style.display = 'none';

            // Navbar'ı güncelle
            if (typeof updateNavbar === 'function') updateNavbar();
        } else {
            alert(data.message || 'Invalid or expired code.');
        }
    } catch (err) {
        console.error('Error:', err);
        alert('Verification failed!');
    }
});

// Example event data (with multiple locations)
const events = [
    { name: "Chopin Salon", places: ["Przedmiescie, Warsaw", "Main Hall, Krakow"] },
    { name: "Nouvelle Vague", places: ["Niebo, Warsaw"] },
    { name: "Natalia Sikora", places: ["Stodola, Warsaw", "Opera House, Gdansk"] },
    { name: "Agnes Obel", places: ["Palladium, Warsaw"] },
    { name: "Metronomy", places: ["Progresja, Warsaw"] },
    { name: "Little dragon", places: ["Niebo, Warsaw"] }
];

// Only open login modal for login
// (No need to change if you use the above HTML)

// When search is triggered, only open search modal
function handleSearch() {
    const eventSelect = document.getElementById('event-select');
    eventSelect.innerHTML = '';
    events.slice(0, 5).forEach(event => {
        const option = document.createElement('option');
        option.value = event.name;
        option.textContent = event.name;
        eventSelect.appendChild(option);
    });
    // Only open the search modal
    document.getElementById('search-modal').style.display = 'flex';
    document.getElementById('search-step1').style.display = 'block';
    document.getElementById('search-step2').style.display = 'none';
    document.getElementById('search-step3').style.display = 'none';
    document.getElementById('search-step4').style.display = 'none';
}

document.getElementById('search-input').addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
});

// Step 2: After event selection, show location selection
document.getElementById('event-next-btn').addEventListener('click', function () {
    const selectedEventName = document.getElementById('event-select').value;
    const selectedEvent = events.find(e => e.name === selectedEventName);
    const placeSelect = document.getElementById('place-select');
    placeSelect.innerHTML = '';
    selectedEvent.places.forEach(place => {
        const option = document.createElement('option');
        option.value = place;
        option.textContent = place;
        placeSelect.appendChild(option);
    });
    document.getElementById('search-step1').style.display = 'none';
    document.getElementById('search-step2').style.display = 'block';
    document.getElementById('search-step3').style.display = 'none';
    document.getElementById('search-step4').style.display = 'none';
});

// Step 3: After location selection, show date selection
document.getElementById('place-next-btn').addEventListener('click', function () {
    document.getElementById('search-step2').style.display = 'none';
    document.getElementById('search-step3').style.display = 'block';
    document.getElementById('search-step4').style.display = 'none';
});

// Step 4: After date selection, show confirmation
document.getElementById('date-next-btn').addEventListener('click', function () {
    const eventName = document.getElementById('event-select').value;
    const place = document.getElementById('place-select').value;
    const date = document.getElementById('date-input').value;
    if (!date) {
        alert('Please choose a date.');
        return;
    }
    document.getElementById('search-step3').style.display = 'none';
    document.getElementById('search-step4').style.display = 'block';
    document.getElementById('confirm-message').textContent =
        `Event: ${eventName}\nLocation: ${place}\nDate: ${date}\nSuccessfully selected!`;
});
