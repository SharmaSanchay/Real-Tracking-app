const socket = io();
if (navigator.geolocation) {
  navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;
      socket.emit("send-location", { latitude, longitude });
    },
    (error) => {
      console.log(error);
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    }
  );
}
const map = L.map("map").setView([0, 0], 16);
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "Sanchay Sharma",
}).addTo(map);
let marker = {};
socket.on("receive-location", (data) => {
  const { id, latitude, longitude } = data;
  map.setView([latitude, longitude]);
  if (marker[id]) {
    marker[id].setLatLng([latitude, longitude]);
  } else {
    marker[id] = L.marker([latitude, longitude]).addTo(map);
    // In case you want to add avatar rather than a normal marker you can you below code rather than above else part code
    /* 
    marker[id] = L.marker([latitude,longitude],{
        icon: L.icon({
        iconUrl: "https://imgs.search.brave.com/rtljEjrUi0OIgV2xHJVfkO1t5htkfM30Y4-Tl2khfbo/rs:fit:500:0:0:0/g:ce/aHR0cHM6Ly9pbWcu/ZnJlZXBpay5jb20v/cHJlbWl1bS12ZWN0/b3IvYXZhdGFyLWZs/YXQtaWNvbjJfODA2/MzEzLTE4LmpwZz9z/aXplPTYyNiZleHQ9/anBn", 
        iconSize: [50, 50],
        iconAnchor: [25, 50], 
        popupAnchor: [0, -50]
    })
}).addTo(map);*/
  }
});

socket.on("user-disconnect", (id) => {
  if (marker[id]) {
    map.removeLayer(marker[id]);
    delete marker[id];
  }
});
