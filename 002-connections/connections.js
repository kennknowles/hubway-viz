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

    map.setView(new L.LatLng(42.35473836290108, -71.09716415405273), 13);

    _(stations).each(function(station) {
        station.marker = L.circle([station.lat, station.lng], 80, {color: '#00FF5E', weight: 2, fillOpacity: 0.4, opacity: 1.0})
            .addTo(map)
            .bindPopup(station.name);
    });

    var stations_by_id = {};
    _(stations).each(function(station) {
        stations_by_id[station.id] = station;
    });

    var lines_by_count = {};

    // Lines indexed by how many trips, so we can turn them on/off
    _(trip_counts).each(function(count, start_and_end_string) {
        var start_and_end = start_and_end_string.split(",");

        var count_string = '' + count;
                
        var line = L.polyline([stations_by_id[start_and_end[0]].marker.getLatLng(),
                               stations_by_id[start_and_end[1]].marker.getLatLng()],
                              {color: 'red', weight: 1});
            //.bindPopup(count + ' rides')

        if (count_string in lines_by_count) {
            lines_by_count[count_string].push(line)
        } else {
            lines_by_count[count_string] = [line];
        }
    });

    var old_value = parseInt($('input#count-threshold').val());
        
    $('input#count-threshold').change(function() {
        var new_value = parseInt($(this).val());
        console.log('Count threshold:', new_value);

        if (new_value < old_value) {
            for(var i = old_value; i>=new_value; i--) {
                console.log('Revealing ', (lines_by_count[i] || []).length, ' lines with ', i, ' rides.');
                _(lines_by_count[i]).each(function(line) {
                    line.addTo(map).bringToBack();
                });
            }
        } else {
            for(var i = old_value; i<=new_value; i++) {
                console.log('Hiding ', (lines_by_count[i] || []).length, ' lines with ', i, ' rides.');
                _(lines_by_count[i]).each(function(line) {
                    console.log(line);
                    map.removeLayer(line);
                });
            }
        }

        old_value = new_value;
        $('#count-threshold-label').text(new_value);
    });
});
