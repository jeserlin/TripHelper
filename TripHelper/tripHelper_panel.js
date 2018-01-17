//This index is for panel
  var index = 1;
  function addPanel()  {
    //hide all the panel when add
    $(".collapse").collapse('hide');
    index ++;
    var html = ``;
    html += `<li class="ui-state-default">
              <div class="panel-heading" role="tab" id="heading${index}" data-seq="${index}">
                <h4 class="panel-title">
                  <a id="a${index}" role="button" data-toggle="collapse" data-parent="#accordion" href="#collapse${index}" aria-expanded="true" aria-controls="collapseOne" onclick="clickPanel(${index})">#</a>
                  <span style="float: right;">
                    <button class="btn btn-xs" style="background-color: transparent;" onclick="removePanel('${index}')">
                      <span class="glyphicon glyphicon-remove" aria-hidden="true"></span>
                    </button>
                  </span>
                </h4>
              </div>
              <div id="collapse${index}" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="heading${index}">
                <div class="panel-body">
                  <form style="padding:5px">
                    <div class="form-group">
                      <label for="loc${index}">Location :</label>
                      <input type="search" class="form-control" id="loc${index}" placeholder="Enter a location" onchange="changeLocation(${index})">
                    </div>
                    <div class="form-group">
                      <label>Coordinate (Latitude, Longitude) :</label>
                      <input type="text" class="form-control" id="lat${index}" placeholder="Latitude" onchange="changeCoordinate(${index})">
                      <label class="col-xs-12 col-sm-12"></label>
                      <input type="text" class="form-control" id="lng${index}" placeholder="Longitude" onchange="changeCoordinate(${index})">
                    </div>
                    <div class="form-group">
                      <label for="st${index}">Start time :</label>
                      <input type="text" class="form-control" id="st${index}" placeholder="Enter a start time">
                    </div>
                    <div class="form-group">
                      <label for="en${index}">End time :</label>
                      <input type="text" class="form-control" id="en${index}" placeholder="Enter a end time">
                    </div>
                    <div class="form-group">
                      <label for="des${index}">Description :</label>
                      <textarea type="text" class="form-control" id="des${index}" placeholder="Describe this place"></textarea>
                    </div>
                  </form>
                </div>
              </div>
            </li>`;
    $("#sortable").append(html);
    initPlace(index);
  }
  //remove panel and 
  function removePanel(seq) {
    var headingId = `#heading${seq}`;
    $(headingId).parent().remove();
    if(markerMap.size > 0) {
      //delete the panel marker from the map and also the markerMap.
      markerMap.get(`marker${seq}`).setMap(null);
      markerMap.delete(`marker${seq}`);
      drawPolyline();
    }
  }