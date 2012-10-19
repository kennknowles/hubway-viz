This file contains metadata for both the Trips and Stations table.
For more information, see the contest page.


Metadata for Trips Table:

Variables:

- id: trip id
- status: trip status; "closed" indicates a trip has terminated
- duration: time of trip in seconds
- start_date: start date of trip with date and time, in EST
- start_station: station id of start station
- end_date: end date of trip with date and time, in EST
- end_station_id: station id of end station
- bike_nr: id of bicycle used
- subscription_type: "Registered" is user with membership; "Casual" is user without membership
- zip_code: zipcode of user 
- birth_date: birth year of user
- gender: gender of user


Notes
* first row contains column names
* Total records = 552,030
* Trips that did not include a start or end date were removed from original table.
  This resulted in the removal of 12,562 trips.
* zip_code, birth_date, gender are only available for Registered users
* characater columns are quoted in double quotes



Metadata for Stations table:

Variables:

- id: station id
- terminalName
 name: station name
- installed: logical, indicates whether station has been installed
- locked: logical
- temporary: logical, indicates whether station is temporary
- lat: station latitude
- lng: station longitude

Notes:
* installDate and removalDate were removed from original table due to quality assurance concerns



Metadata for Station Capacity table:

Variables:
- id: unique id
- station_id: station id
- day: date (yyyy-mm-dd)
- capacity: capacity of station (the number of bikes that a station can hold)

Notes:
* Data is aggregated from data found at: http://thehubway.com/data/stations/bikeStations.xml
* Data collection started at 8/22/2011
* Data for 9/21/2011 to 11/9/2011 is missing






