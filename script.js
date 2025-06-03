let latitudeContainer = document.getElementById('latitude')
let longitudeContainer = document.getElementById('longitude')
let velociteContainer = document.getElementById('velocite')
const map = L.map('map').setView([0, 0], 3);

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
}).addTo(map);

const satelliteIcon = L.icon({
    iconUrl: '/Ressources/iss.png',
    iconSize: [100, 100],
    iconAnchor: [50, 50]
});
async function findPosition() {
    try {
        const response = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        if (!response.ok) throw new Error('Erreur réseau');

        const data = await response.json();
        const { latitude, longitude, velocity } = data;

        latitudeContainer.innerText = latitude;
        longitudeContainer.innerText = longitude;
        velociteContainer.innerText = Math.round(velocity, 0)+' km/h'

        return { latitude, longitude };
    } catch (error) {
        console.error('Erreur :', error);
        return null;
    }
}

let marker;

setInterval(async () => {
    const pos = await findPosition();
    if (pos) {
        const { latitude, longitude } = pos;

        if (!marker) {
            marker = L.marker([latitude, longitude], { icon: satelliteIcon }).addTo(map);
        } else {
            marker.setLatLng([latitude, longitude]);
        }

        map.setView([latitude, longitude]);
    }
}, 1000);


