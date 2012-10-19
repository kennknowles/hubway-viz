
import csv
from collections import defaultdict

trip_counts = defaultdict(lambda: 0)

with open('../stations_trips/trips.csv', 'r') as csvfile:
    tripreader = csv.DictReader(csvfile)
    for row in tripreader:
        trip_counts[(row['start_station_id'], row['end_station_id'])] = 1 + trip_counts[(row['start_station_id'], row['end_station_id'])]
        
# See http://stackoverflow.com/questions/1425186/javascript-using-tuples-as-dictionary-keys for why we cannot use tuples as keys #wtfjs
with open('trip_counts.js', 'w') as output_js:
    output_js.write('trip_counts = {};\n')

    for (start_station_id, end_station_id), count in sorted(trip_counts.items(), key=lambda ((start_station_id, end_station_id), count): (start_station_id, end_station_id)):
        if not start_station_id or not end_station_id:
            continue
        
        output_js.write('trip_counts["%s,%s"] = %s;\n' % (start_station_id, end_station_id, count))
