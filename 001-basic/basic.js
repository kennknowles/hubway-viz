$(document).ready(function() {

    // Center coords, and zoomlevel 13
    var map = L.map('map');
    map.on('moveend', function(e) {
        console.log(map.getCenter());
    });
    
    L.tileLayer('http://{s}.tile.cloudmade.com/{key}/997/256/{z}/{x}/{y}.png', {
        key: 'bee4b5ce4b8e431da53d7305eead8d86',
        //key: 'f9384b303fb549cbaab26cc5a7bf4189',
        attribution: 'Foobar',
        maxZoom: 18
    }).addTo(map);

    var marker = L.marker([51.5, -0.09])
        .addTo(map)
        .bindPopup('A pretty CSS3 popup. <br> Easily customizable.').openPopup();

    var circle = L.circle([51.508, -0.11], 500, {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.5
    }).addTo(map);

    var polygon = L.polygon([
        [51.509, -0.08],
        [51.503, -0.06],
        [51.51, -0.047]
    ]).addTo(map);

    marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
    circle.bindPopup("I am a circle.");
    polygon.bindPopup("I am a polygon.");
    
    map.setView(new L.LatLng(42.35473836290108, -71.09716415405273), 13);

    _(stations).each(function(station) {
        station.marker = L.marker([station.lat, station.lng]).addTo(map).bindPopup(station.terminalName);
    });
});
