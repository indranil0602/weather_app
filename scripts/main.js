/********************************************
    DEVELOPER:  INDRANIL PAL
    E-MAIL:     indranil.pal.0602@gmail.com
*********************************************/

function makeDispNone() {
    var i, formcontent, tablinks;
    formcontent = document.getElementsByClassName("formcontent");
    for (i = 0; i < formcontent.length; i++) {
        formcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
}
function openCity(evt, cityName) {
    makeDispNone();
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function getLocation() {
    makeDispNone();
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showDetails, errorHandle);
    } else {
        x.innerHTML="Geolocation is not supported by this browser.";
    }
}

function errorHandle(err) {
    document.getElementById("container").style.visibility = "hidden";     
    document.getElementById("err_msg").style.visibility = "visible";      
    var msg = "<h2>Give permission to access device location</h2>";       
    document.getElementById("err_msg").innerHTML = msg;                    
}

var preLatitude, preLongitude;

var baseCoordURL = config.API_URL + "lat=";
var baseLocURL = config.API_URL + "q=";
var APIkey = config.SECRET_API_KEY;

const iconUrl = "http://openweathermap.org/img/wn/";
const iconType = ".png";

function showDetails(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var finalUrl = baseCoordURL + lat + "&lon=" + lon + APIkey;
    sendRequest(finalUrl);
}

function fetchLocation() {
    var loc = document.getElementById("loc").value;
    var finalUrl = baseLocURL + loc + APIkey;
    sendRequest(finalUrl);
}

function fetchCoordinate() {
    var lat = document.getElementById("co-lat").value;
    var lon = document.getElementById("co-lon").value;
    var finalUrl = baseCoordURL + lat + "&lon=" + lon + APIkey;
    sendRequest(finalUrl);
}

function refreshData() {
    makeDispNone();
    var lat = preLatitude;
    var lon = preLongitude;
    var finalUrl = baseCoordURL + lat + "&lon=" + lon + APIkey;
    sendRequest(finalUrl);
}

function sendRequest(finalUrl) {
    document.getElementById("err_msg").style.visibility = "hidden";
    document.getElementById("container").style.visibility = "visible";               

    var xhr = new XMLHttpRequest();
    xhr.open('POST', finalUrl, true);
    xhr.send();
    xhr.onreadystatechange = processRequest;

    function processRequest(e) {
        if (xhr.status == 404) {
            alert("location not found");
        }
        if (xhr.readyState == 4 && xhr.status == 200) {
            var res = JSON.parse(xhr.responseText);
            
            //Place card
            document.getElementById("place").innerHTML = res.name;
            getCountryName(res.sys.country);
            
            var month = (new Date(res.dt * 1000)).getMonth();
            var options = {month: 'long'};
            var mon = new Intl.DateTimeFormat('en-US', options).format(new Date(res.dt * 1000));
            
            document.getElementById("dt").innerHTML = ((new Date(res.dt * 1000)).toLocaleTimeString()).substring(0, 5)
                                                    + ", " + mon + " " + (new Date(res.dt * 1000)).getUTCDate();

            document.getElementById("lat").innerHTML = "Latitude ";
            preLatitude = res.coord.lat;
            document.getElementById("lat_val").innerHTML = res.coord.lat;
            document.getElementById("lon").innerHTML = "Longitude ";
            preLongitude = res.coord.lon;
            document.getElementById("lon_val").innerHTML = res.coord.lon;
            document.getElementById("main").innerHTML = res.weather[0].main;
            document.getElementById("description").innerHTML = res.weather[0].description;
            var img = document.createElement('img');
            img.src = iconUrl + res.weather[0].icon + iconType;
            document.getElementById("image_icon").src = img.src;
            document.getElementById("clouds_all").innerHTML = "Cloudiness ";
            document.getElementById("clouds_all_val").innerHTML = res.clouds.all + "%";

            //Temp card
            var celciousIcon = "<span>&#8451;</span>";
            document.getElementById("temp").innerHTML = 
                "<span class=\"iconify\" data-icon=\"wi:thermometer\" data-inline=\"false\"></span>" + 
                " " + (Math.round(res.main.temp) - 273) + celciousIcon;
            document.getElementById("feels_like").innerHTML = "Feels like ";
            document.getElementById("feels_like_val").innerHTML = (Math.round(res.main.feels_like) -273)  + celciousIcon;
            document.getElementById("temp_min").innerHTML = "Min " + (Math.round(res.main.temp_min) - 273)  + celciousIcon;
            document.getElementById("temp_max").innerHTML = "Max " + (Math.round(res.main.temp_max) - 273)  + celciousIcon;
            document.getElementById("humidity").innerHTML = "Humidity ";
            document.getElementById("humidity_val").innerHTML = res.main.humidity + " " +
                "<span class=\"iconify\" data-icon=\"wi:humidity\" data-inline=\"false\"></span>";
            if (res.rain != null) {
                if (res.rain['1h'] != null) {
                    document.getElementById("rain_1hr").innerHTML = "Rain " +
                        "<span class=\"iconify\" data-icon=\"wi:raindrops\" data-inline=\"false\"></span>";
                    document.getElementById("rain_1hr_val").innerHTML = res.rain['1h'] + " mm";
                }
                if (res.rain['3h'] != null) {
                    document.getElementById("rain_3hr").innerHTML = "Rain " + 
                        "<span class=\"iconify\" data-icon=\"wi:raindrops\" data-inline=\"false\"></span>";
                    document.getElementById("rain_3hr_val").innerHTML = res.rain['3h'] + " mm";   
                }
            }
            if (res.snow != null) {
                if (res.snow['1h'] != null) {
                    document.getElementById("snow_1hr").innerHTML = "Snow [1 hour]";
                    document.getElementById("snow_1hr_val").innerHTML = res.snow['1h'] + " mm";
                }
                if (res.snow['3h'] != null) {
                    document.getElementById("snow_3hr").innerHTML = "Snow [3 hour]";
                    document.getElementById("snow_3hr_val").innerHTML = res.snow['3h'] + " mm";
                }
            }
            document.getElementById("visibility").innerHTML = "Visibility"
            document.getElementById("visibility_val").innerHTML = (res.visibility / 1000) + " km";
            document.getElementById("sunrise").innerHTML = 
                "<span class=\"iconify\" data-icon=\"wi:sunrise\" data-inline=\"false\"></span>" + " " + 
                (new Date(res.sys.sunrise * 1000)).toLocaleTimeString();
            document.getElementById("sunset").innerHTML = 
                "<span class=\"iconify\" data-icon=\"wi:sunset\" data-inline=\"false\"></span>" + " " + 
                (new Date(res.sys.sunset * 1000)).toLocaleTimeString();

            //Wind card
            document.getElementById("wind").innerHTML = 
                "<span class=\"iconify\" data-icon=\"wi:windy\" data-inline=\"false\"></span>";         //wind logo
            document.getElementById("speed").innerHTML = 
                "Speed";   //speed
            document.getElementById("speed_val").innerHTML = res.wind.speed + " m/s";                   //speed value
            
            var dirIcon = getDirIcon(res.wind.deg);  
            document.getElementById("deg").innerHTML = "Direction ";                                    //Direction
            document.getElementById("deg_val").innerHTML = dirIcon;                                     //direction value and icon
            
            if (res.wind.gust != null) {
                document.getElementById("gust").innerHTML = "Gust ";
                document.getElementById("gust_val").innerHTML = res.wind.gust + " m/s";
            }
            document.getElementById("pressure").innerHTML = "ATM <span class=\"iconify\" data-icon=\"wi:barometer\" data-inline=\"false\"></span> ";                                     //Atmospheric pressure
            document.getElementById("pressure_val").innerHTML = res.main.pressure + " hPa";             //atmospheric pressure value
            if (res.main.sea_level != null) {
                document.getElementById("sea_level").innerHTML = "Sea level ";                          //Sea level
                document.getElementById("sea_level_val").innerHTML = res.main.sea_level + " hPa";       //sea level atm val
            }
            if (res.main.grnd_level != null) {
                document.getElementById("grnd_level").innerHTML = "Ground level ";                      //Ground level 
                document.getElementById("grnd_level_val").innerHTML = res.main.grnd_level + " hPa";     //Ground level atm val
            }
        }
    }
}

function getCountryName(con) {
    fetch("./src/country.json")
        .then(response => response.json())
        .then(countries => {
            for (c in countries) {
                if (countries[c].code == con) {
                    document.getElementById("country").innerHTML = countries[c].name
                    break
                }
            }
        })
}

function getDirIcon(deg) {
    if (deg == 350 || deg == 360 || deg == 10)
        return "N " + "<iconify-icon data-icon=\"wi:wind-direction-n\"></iconify-icon>";
    else if (deg == 20 || deg == 30)
        return "N/NE " + "<iconify-icon data-icon=\"wi:wind-direction-ne\"></iconify-icon>";
    else if (deg == 40 || deg == 50)
        return "NE" + "<iconify-icon data-icon=\"wi:wind-direction-ne\"></iconify-icon>";
    else if (deg == 60 || deg == 70)
        return "E/NE " + "<iconify-icon data-icon=\"wi:wind-direction-ne\"></iconify-icon>";
    else if (deg == 330 || deg == 340)
        return "N/NW" + "<iconify-icon data-icon=\"wi:wind-direction-nw\"></iconify-icon>";
    else if (deg == 310 || deg == 320) 
        return "NW " + "<iconify-icon data-icon=\"wi:wind-direction-nw\"></iconify-icon>";
    else if (deg == 290 || deg == 300) 
        return "W/NW " + "<iconify-icon data-icon=\"wi:wind-direction-nw\"></iconify-icon>";
    else if (deg == 260 || deg == 270 || deg == 280) 
        return "W " + "<iconify-icon data-icon=\"wi:wind-direction-w\"></iconify-icon>";
    else if (deg == 240 || deg == 250) 
        return  "W/SW " + "<iconify-icon data-icon=\"wi:wind-direction-sw\"></iconify-icon>";
    else if (deg == 220 || deg == 230) 
        return "SW " + "<iconify-icon data-icon=\"wi:wind-direction-sw\"></iconify-icon>";
    else if (deg == 200 || deg == 210) 
        return "S/SW " + "<iconify-icon data-icon=\"wi:wind-direction-sw\"></iconify-icon>";
    else if (deg == 170 || deg == 180 || deg == 190) 
        return "S " + "<iconify-icon data-icon=\"wi:wind-direction-s\"></iconify-icon>";
    else if (deg == 150 || deg == 160)
        return "S/SE " + "<iconify-icon data-icon=\"wi:wind-direction-se\"></iconify-icon>";
    else if (deg == 130 || deg == 140) 
        return "SE " + "<iconify-icon data-icon=\"wi:wind-direction-se\"></iconify-icon>";
    else if (deg == 110 || deg == 120)
        return "E/SE " + "<iconify-icon data-icon=\"wi:wind-direction-se\"></iconify-icon>";
    else 
        return "E " + "<iconify-icon data-icon=\"wi:wind-direction-e\"></iconify-icon>";
}
