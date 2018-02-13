# TripHelper
You can also see here:
https://jeserlin.github.io/TripHelper/tripHelper.html <br>
Trip Helper is a site that you can easily arrange your trip.（Base on google map）

## I'm using:

* Java 8
* Google Map API - Places API
* Google Map API - Directions Service
* Javascript ES6
* Jquery
* Bootstrap 3.3.7

## Features:

### 1.Travel Arrangements
  You can arrange your trip here.
  Each panel respresents a location, by filling the location input in the panel there will be a marker showing on the map.
  When you have more than one panel, the markers on the map will be connected with polyline in order.
  You can also change the order of locations by just dragging the panel.
  
### 2.Direction Service
  Once you have finished your travel arrangement, you can go to the Direction Service tab to see the transportation info.
  The origin, waypoints and the destination will be in the order of the travel arrangements that you made. 
  Also on the left part of the page - the map will show the route of direction service for you!
  The information is provided by Google map.
  
  *Direction Service 
  -Transit mode
  Due to that google direction service doesn't support transit mode with waypoints,
  to solve this problem, when choosing transit mode, it will send request to google diresction service for multiple times.
  For exemple, if you have a route with 3 locations(A,B,C) then i will seperate it to 2 routes（[A,B],[B,C]）.
