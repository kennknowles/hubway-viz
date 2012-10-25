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

    var stations_by_id = {};
    _(stations).each(function(station) {
        station.flow = { in: 0, out: 0 };
        stations_by_id[station.id] = station;
    });

    _(trip_counts).each(function(count, start_and_end_string) {
        var start_and_end = start_and_end_string.split(",");
        var start = start_and_end[0];
        var end = start_and_end[1];

        stations_by_id[start].flow.out += count;
        stations_by_id[end].flow.in += count;
    });

    var in_color = '#ff0000';
    var out_color = '#0000ff';
    var scale_factor = 0.013;
    var rect_width = 10;

    function rect_top_lat(map, base_latLng, height_pixels) {
        return map.layerPointToLatLng(map.latLngToLayerPoint(base_latLng).add(L.point(0, height_pixels))).lat;
    }

    function init_rects() {
        _.chain(stations_by_id)
            .sortBy(function(station) { return -station.lat; })
            .each(function(station) {
                station.out_rect = L.rectangle([[station.lat, station.lng], [station.lat, station.lng]],
                                               {color: 'black', weight: 1, fillColor: out_color, fillOpacity: 1.0, opacity: 1.0})
                    .addTo(map)
                    .bindPopup(station.name + ' outflow: ' + station.flow.out);
                
                station.in_rect = L.rectangle([[station.lat, station.lng], [station.lat, station.lng]],
                                              {color: 'black', weight: 1, fillColor: in_color, fillOpacity: 1.0, opacity: 1.0})
                    .addTo(map)
                    .bindPopup(station.name + ' inflow: ' + station.flow.in);
            })
            .value();
    }

    function resize_rects() {
        console.log('Resize');
        _(stations_by_id).each(function(station) {
            var origin = L.latLng(station.lat, station.lng);

            station.out_rect.setBounds([origin,
                                        map.layerPointToLatLng(map.latLngToLayerPoint(origin).add(L.point(-rect_width, -scale_factor * station.flow.out)))]);
            
            station.in_rect.setBounds([origin,
                                       map.layerPointToLatLng(map.latLngToLayerPoint(origin).add(L.point(rect_width, -scale_factor * station.flow.in)))]);
        });
    }

    init_rects();
    resize_rects();
    map.on('viewreset', resize_rects);
});
