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

    // bounds for color interpolation
    var min_flow = _.chain(stations).map(function(station) { return station.flow.out - station.flow.in; }).min().value();
    var max_flow = _.chain(stations).map(function(station) { return station.flow.out - station.flow.in; }).max().value();
    var flow_range = min_flow - max_flow;
    
    // vector stuff
    function add(v1, v2) { return _(_.zip(v1, v2)).map(function(x1_x2) { return x1_x2[0] + x1_x2[1]; }); };
    function scale(k, v) { return _(v).map(function(x) { return k * x; }); };

    var max_out_color = [1.0, 0, 0];
    var min_in_color = [0, 0, 1.0];
    var white = [1.0, 1.0, 1.0];
    var out_direction = add(max_out_color, scale(-1, white)); // max_out_color - white; so at white + direction = max_out_color
    var in_direction = add(min_in_color, scale(-1, white));

    console.log(white, scale(-1, white), _.zip(white, white));
    console.log(out_direction, in_direction);

    var out_interpolation_degree = 1.0;
    var in_interpolation_degree = 1.0;

    // Interpolate positive and negative flow separately, leaving white as zero
    _(stations_by_id).each(function(station) {
        var flow = station.flow.out - station.flow.in;
        var color_direction = (flow > 0) ? out_direction : in_direction;
        var proportion = (flow > 0) ? (flow / max_flow) : (flow / min_flow);

        var color = add(white, scale(proportion, color_direction));
        var radius = Math.sqrt(station.flow.in + station.flow.out) * 0.9;

        console.log(flow, color_direction, proportion, color);

        var color_string = '#' 
            + Math.round(color[0] * 0xFF).toString(16) 
            + Math.round(color[1] * 0xFF).toString(16) 
            + Math.round(color[2] * 0xFF).toString(16);
        
        station.circle = L.circle([station.lat, station.lng], radius, {color: 'black', weight: 1, fillColor: color_string, fillOpacity: 1.0, opacity: 0.7})
            .addTo(map)
            .bindPopup(station.name + ': ' + (station.flow.out - station.flow.in));
    });
});
