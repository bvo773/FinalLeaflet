// Map panes requires Leaflet 1.x
// See Leaflet tutorial http://leafletjs.com/examples/map-panes.html
// template by http://github.com/jackdougherty/leaflet-map/
var tabnum = "0";
// set up the map center and zoom level
var map = L.map('map', {
  center: [41.5, -72.7], // [41.5, -72.7] for Connecticut; [41.76, -72.67] for Hartford county or city
  zoom: 9, // zoom 9 for Connecticut; 10 for Hartford county, 12 for Hartford city
});

// customize link to view source code; add your own GitHub repository
map.attributionControl
.setPrefix('View <a href="http://github.com/jackdougherty/leaflet-map-polygon-click">open-source code on GitHub</a>, created with <a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census</a>');

// Basemap layer
new L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
}).addTo(map);

// This pane is above markers but below popups
// see default pane z-index levels: https://github.com/Leaflet/Leaflet/blob/master/dist/leaflet.css#L73
map.createPane('labels');
map.getPane('labels').style.zIndex = 650;

// Layers in this pane are non-interactive and do not obscure mouse/touch events
map.getPane('labels').style.pointerEvents = 'none';

// optional: add legend to toggle any baselayers and/or overlays
// global variable with (null, null) allows indiv layers to be added inside functions below
var controlLayers = L.control.layers( null, null, {
  position: "topright", // suggested: bottomright for CT (in Long Island Sound); topleft for Hartford region
  collapsed: false // false = open by default
});

// optional: reposition zoom control other than default topleft
//L.control.zoom({position: "topright"}).addTo(map);




// ArcGIS Online tile layer, hosted on subscription service http://trincoll.maps.arcgis.com
//controlLayers.addBaseLayer(arcGISLabelsCWP, 'ArcGIS CWP Labels'); // replaced addOverlay with addBaseLayer for radio buttons

//Reset the reference each time the user changes tab
function resetAttribute (tabnum){
  map.attributionControl.removeAttribution ("Reference");
  if (tabnum.localeCompare("1") == 0) {
    map.attributionControl
    .setPrefix('Reference:' + '<br />' + 'Capital Workforce Partners 2014-15 Program Year' + '<br />' + 'View <a href="http://github.com/ngocdo67/leaflet-map-panes">code on GitHub</a>, created with' + '<br />' +  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
  } else if (tabnum.localeCompare("2") == 0) {
    map.attributionControl
    .setPrefix('Reference:' + '<br />' + '2010-2014 American Community Survey 5-Year Estimates' + '<br />' + 'View <a href="http://github.com/ngocdo67/leaflet-map-panes">code on GitHub</a>, created with' + '<br />' +  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
  } else if (tabnum.localeCompare("3") == 0) {
    map.attributionControl
    .setPrefix('Reference:' + '<br />' + '2009-2013 American Community Survey 5-Year Estimates' + '<br />' + 'View <a href="http://github.com/ngocdo67/leaflet-map-panes">code on GitHub</a>, created with' + '<br />' +  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
  } else if (tabnum.localeCompare("4") == 0) {
    map.attributionControl
    .setPrefix('Reference:' + '<br />' + '2009-2013 American Community Survey 5-Year Estimates' + '<br />' + 'View <a href="http://github.com/ngocdo67/leaflet-map-panes">code on GitHub</a>, created with' + '<br />' +  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
  } else if (tabnum.localeCompare("5") == 0) {
    map.attributionControl
    .setPrefix('Reference:' + '<br />' + '2015 CT Dept. of Labor	' + '<br />' + 'View <a href="http://github.com/ngocdo67/leaflet-map-panes">code on GitHub</a>, created with' + '<br />' +  '<a href="http://leafletjs.com" title="A JS library for interactive maps">Leaflet</a>');
  }
}

//Decide the color for the polygons for each tab
function getColor(d) {
  console.log(d);
  if(tabnum.localeCompare("2") == 0){
    if (d > -1) {
      return d > 12.5  ? '#F6AA00' :
      d > .65  ? '#F8B824' :
      d > .2   ? '#FFD54F' :
      d > 0.1   ? '#FDD976' :
      '#FFE699';
    } else {
      return "#ffffff";
    }
  } else if(tabnum.localeCompare("3") == 0){
    if (d > -1) {
      return d > 5.8  ? '#F6AA00' :
      d > .57  ? '#F8D824' :
      d > .33   ? '#FFD54F' :
      d > 0.1   ? '#FDD976' :
      '#FFE699';
    } else {
      return "#ffffff";
    }
  } else if(tabnum.localeCompare("4") == 0){
    if (d > -1) {
      return d > 12  ? '#F6AA00' :
      d > .62  ? '#F8B824' :
      d > .37   ? '#FFD54F' :
      d > 0.1  ? '#FDD976' :
      '#FFE699';
    } else {
      return "#ffffff";
    }
  } else if(tabnum.localeCompare("5") == 0){
    if (d > -1) {
      return d > 36  ? '#F6AA00' :
      d > 5  ? '#F8B824' :
      d > 2   ? '#FFD54F' :
      d > 1   ? '#FDD976' :
      '#FFE699';
    } else {
      return "#ffffff";
    }
  } else {
    return '#fdd017';
  }
}

//Set style for the map
function style (feature) {
  var color = '';
  return {
    fillColor: getColor(feature.properties[tabnum]),
    weight: 1,
    opacity: 1,
    color: '#000000',
    dashArray: '1',
    fillOpacity: 0.7
  }
}

//Set up the information window
var info = L.control();

info.onAdd = function (map) {
    this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
  if(tabnum.localeCompare("2") == 0){
    var pAsian = props.properties[tabnum];
    this._div.innerHTML = '<h4>Statistics</h4>' +  (props ?
       'Town: ' + checkNull(props.properties.town) + '<br />' + 'Count: ' + checkNull(props.properties.Asian) + '<br />' + '% of Asian Arrested: ' + checkNull(props.properties.AP) +'<br />' +
        'PerCapita: ' + checkNull(props.properties[tabnum]) + '<br />' + 'Asian Population: ' + checkNull(props.properties.AsianAlone) + '<br />' + 'Average bond: ' + checkNull(props.properties.TotalAbond) + '<br />' + 'White Pop.: ' + checkNull(props.properties.WhiteAlone) + '<br />' + 'Black Pop.: ' + checkNull(props.properties.BlackAlone) +'<br />' + 'Hispanic Pop.: ' + checkNull(props.properties.Hispanicalone) 
        : 'Hover over a town');
  } else if(tabnum.localeCompare("3") == 0){
    var pHispanic = props.properties[tabnum];
    this._div.innerHTML = '<h4>Statistics</h4>' +  (props ?
        'Town: ' + checkNull(props.properties.town) + '<br />' + 'Count: ' + checkNull(props.properties.Hispanic) + '<br />' + '% of Hispanic Arrested: ' + checkNull(props.properties.AP) +'<br />' +
        'PerCapita: ' + checkNull(props.properties[tabnum]) + '<br />' + 'Hispanic Population: ' + checkNull(props.properties.Hispanicalone) + '<br />' + 'Average bond: ' + checkNull(props.properties.TotalHBond) + '<br />' + 'White Pop.: ' + checkNull(props.properties.WhiteAlone) + '<br />' + 'Black Pop.: ' + checkNull(props.properties.BlackAlone) +'<br />' + 'Asian Pop.: ' + checkNull(props.properties.AsianAlone) 
        : 'Hover over a town');
  } else if(tabnum.localeCompare("4") == 0){
    var pWhite = props.properties[tabnum];
    this._div.innerHTML = '<h4>Statistics</h4>' +  (props ?
        'Town: ' + checkNull(props.properties.town) + '<br />' + 'Count: ' + checkNull(props.properties.White) + '<br />' + '% of White Arrested: ' + checkNull(props.properties.WP) +'<br />' +
        'PerCapita: ' + checkNull(props.properties[tabnum]) + '<br />' + 'White Population: ' + checkNull(props.properties.WhiteAlone) + '<br />' + 'Average bond: ' + checkNull(props.properties.TotalWBond) + '<br />' + 'Asian Pop.: ' + checkNull(props.properties.AsianAlone) + '<br />' + 'Black Pop.: ' + checkNull(props.properties.BlackAlone) +'<br />' + 'Hispanic Pop.: ' + checkNull(props.properties.Hispanicalone) 
        : 'Hover over a town');
  } else if(tabnum.localeCompare("5") == 0){
    var pBlack = props.properties[tabnum];
    this._div.innerHTML = '<h4>Statistics</h4>' +  (props ?
        'Town: ' + checkNull(props.properties.town) + '<br />' + 'Count: ' + checkNull(props.properties.Black) + '<br />' + '% of Black Arrested: ' + checkNull(props.properties.BP) +'<br />' +
        'PerCapita: ' + checkNull(props.properties[tabnum]) + '<br />' + 'Black Population: ' + checkNull(props.properties.BlackAlone) + '<br />' + 'Average bond: ' + checkNull(props.properties.TotalBbond) + '<br />' + 'White Pop.: ' + checkNull(props.properties.WhiteAlone) + '<br />' + 'Asian Pop.: ' + checkNull(props.properties.AsianAlone) +'<br />' + 'Hispanic Pop.: ' + checkNull(props.properties.Hispanicalone) 
        : 'Hover over a town');
  } else {
    this._div.innerHTML = '<h4>Number of People Arrest</h4>' +  (props ?
        'Town: ' + checkNull(props.properties.town) + '<br />' + 'Count: ' + checkNull(props.properties.Count)
         + '<br />' + 'Asian Arrested: ' + checkNull(props.properties.Asian) + '<br />' + 'Black Arrested: ' + checkNull(props.properties.Black) + '<br />'+ 'Hispanic Arrested: ' + checkNull(props.properties.Hispanic) + '<br />'+ 'Population: ' + checkNull(props.properties.Population) + '<br />'+'Bond Average: ' + checkNull(props.properties.TotalAveB)
        : 'Hover over a town');
  }
};

info.addTo(map);

//Set up the legend
var legend = L.control({position: "bottomright"});

legend.onAdd = function (map) {
  this._div = L.DomUtil.create('div', 'info legend');
  this.update();
  return this._div;
}

//Customize the legend for each tab
legend.update = function (props) {
  var length = 4,
    grades2 = [0.1, .2, .65, 12.5],
    grades3 = [0.1, .33, .57, 5.8],
    grades4 = [0.1, .37, .62, 12],
    grades5 = [1, 2, 5, 36],
    labels = [],
    from, to;
  for (var i = 0; i < length; i++) {
    if (tabnum.localeCompare("2") == 0) {
      from = grades2[i];
      to = grades2[i + 1];
      labels.push(
      '<i style="background:' + getColor(from) + '"></i> ' +
      checkNull(from) + (to ? '&ndash;' + checkNull(to) : '+'));
    } else if (tabnum.localeCompare("3") == 0){
      from = grades3[i];
      to = grades3[i + 1];
      labels.push(
      '<i style="background:' + getColor(from) + '"></i> ' +
      checkNull(from) + (to ? '&ndash;' + checkNull(to) : '+'));
    } else if (tabnum.localeCompare("4") == 0){
      from = grades4[i];
      to = grades4[i + 1];
      labels.push(
      '<i style="background:' + getColor(from) + '"></i> ' +
      checkNull(from) + (to ? '&ndash;' + checkNull(to) : '+'));
    } else if (tabnum.localeCompare("5") == 0){
      from = grades5[i];
      to = grades5[i + 1];
      labels.push(
      '<i style="background:' + getColor(from) + '"></i> ' +
      checkNull(from) + (to ? '&ndash;' + checkNull(to) : '+'));
    } else {
      from = 0;
      to = 0;
    }
  }
  this._div.innerHTML = labels.join('<br>');
  return this._div;
}

legend.addTo(map);

function highlightFeature (e){
  var layer = e.target;
  var popupText = "<b>" + layer.feature.properties.name + "</b>"   // Popup text: link to town profile
 + "<br><a href='" + layer.feature.properties.profile + "'>Town Profile</a>";
  layer.bindPopup(popupText);
  layer.setStyle({
    weight: 5,
    color: '#666',
    dashArray: '',
    fillOpacity: 0.7
  });

  if (!L.Browser.ie && !L.Browser.opera) {
    layer.bringToFront();
  }
  info.update(feature);
 
}
var geoJsonLayer = 0;
/* POLYGON OVERLAY */
// load polygon geojson, using data to define fillColor, from local directory
$.getJSON("NBond.geojson", function (data) {   
  geoJsonLayer = L.geoJson(data, {
    style: style,
    onEachFeature: function( feature, layer) {
      layer.on({
        mouseover: function (e) {
          var layer = e.target;
          var popupText = "<b>" + feature.properties.name + "</b>";   // Popup text: link to town profile
         + "<br><a href='" + feature.properties.profile + "'>Town Profile</a>";
          layer.bindPopup(popupText);
          layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
          });

          if (!L.Browser.ie && !L.Browser.opera) {
            layer.bringToFront();
          }
          info.update(feature);
        },
        mouseout: function (e) {
          geoJsonLayer.resetStyle(e.target);
          info.update();
        }
      });
    }
  }).addTo(map);
});

//Display -- if the value is null or 0
function checkNull(val) {
  if (val == 0) {
    return "--";
  }
  if (val != null || val == "NaN") {
    return comma(val);
  } else {
    return "--";
  }
}

//Display numbers as comma separated
function comma(val){
  while (/(\d+)(\d{3})/.test(val.toString())){
    val = val.toString().replace(/(\d+)(\d{3})/, '$1'+','+'$2');
  }
  return val;
}

//Reset the map, legend, attribute when the tab is changed
$(".toolItem").click(function() {
  $(".toolItem").removeClass("selected");
  $(this).addClass("selected");
  tabnum = $(this).html().split(".")[0];
  geoJsonLayer.setStyle(style);
  legend.update(tabnum);
  resetAttribute(tabnum);
});
