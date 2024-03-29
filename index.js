 //default
 let lat = 48.69122,
 lon = 10.16650;

 function hideCursor() {
   const el = document.documentElement;

   el.addEventListener("mousemove", e => {
     const timer = el.getAttribute("timer");
     if (timer) {
       clearTimeout(timer);
       el.setAttribute("timer", "");
     }
     const t = setTimeout(() => {
       el.setAttribute("timer", "");
       el.style.cursor = "none";
     }, 3500);
     el.setAttribute("timer", t);
     el.style.cursor = "auto";
   });
 }

 function getDate() {
   let dt = new Date(),
   d = dt.getDate(),
   mon = dt.getMonth()+1,
   j = String(dt.getFullYear()).slice(-2),
   h = dt.getHours(),
   min = dt.getMinutes() < 10 ? '0'+dt.getMinutes() : dt.getMinutes(); 

   document.getElementById('clock').innerText = h + ":" + min;
   document.getElementById('date').innerText = d + "." + mon + "." + j;
 }

 function getIcon(icon) {
   console.log(icon);
   switch(icon){
       case 'cloudy':
         return '☁️';
       case 'partly-cloudy-day':
         return '🌥️';
       case 'clear-day':
         return '☀️';
       case 'partly-cloudy-night':
         return '🌥️';
       case 'clear-night':
         return '🌑';
       case 'rain':
         return '🌧️';
       case 'snow':
         return '❄️';
       default:
         return '❌';
     }
 }

 function getWeather() {
   let dt = new Date(),
   d = dt.getDate() < 10 ? '0'+dt.getDate() : dt.getDate(),
   mon = (dt.getMonth() + 1) < 10 ? '0'+(dt.getMonth()+1) : (dt.getMonth()+1),
   j = dt.getFullYear(),
   h = dt.getHours(),
   url_date = j + "-" + mon + "-" + d;

   console.log(url_date);
   console.log(mon);

   fetch('https://api.brightsky.dev/weather?lat=' + lat + '&lon=' + lon + '&date=' + url_date)
   .then((res) => res.json())
   .then((data) => {

     let emote = document.getElementById('emote'),
     icon = data.weather[h].icon,
     emoteEmoji = getIcon(icon);

     emote.innerText = emoteEmoji;
     emote.addEventListener("click", (e) => {
         if(e.target.innerText.length > 5){
           e.target.innerText = emoteEmoji;
         }
         else {
           e.target.innerText += " "+icon;
         }

         
     });

     let place = data.sources[0].station_name,
     temp = data.weather[h].temperature;

     document.getElementById('place').innerText = place;
     document.getElementById('temp').innerText = temp + " °C";

     let arr = [];
     data.weather.forEach(element => {
       arr.push(element.temperature);
     });

     let minus = false;
     
     for(let l=0; l<arr.length; l++){
       if(arr[l] < 0){
         minus = true;
         break;
       }
     }

     if(minus){
       for(let k=0; k<arr.length; k++){
         arr[k] += 25;
       }
     }

     let canvas = document.getElementById('can'),
     context = canvas.getContext('2d');  

     const canW = canvas.offsetWidth,
     canH = canvas.offsetHeight,
     step = canW/arr.length;

     context.clearRect(0, 0, canW, canH);
     context.strokeStyle = 'red';

     for(let i=0; i<arr.length; i++){
       if(h == i){
         context.strokeStyle = 'white';
       }
       context.beginPath();  
       context.moveTo(step*i, canH-arr[i]);  
       context.lineTo(step*(i+1), canH-arr[i+1]);  
       context.stroke();  
     }
     
     getDate();
   });
 }

 function getBattery() {
   navigator.getBattery().then((battery) => {
     let chrg = battery.charging,
     lvl = battery.level;
     
     document.getElementById('battery-emote').innerText = chrg ? "⚡" : "";
     document.getElementById('battery-charge-tooltip').title = lvl*100 + '%';

     let canvas = document.getElementById('battery-charge'),
     context = canvas.getContext('2d');

     const canW = canvas.offsetWidth,
     canH = canvas.offsetHeight,
     radius = canW/2-2;
     x = canH/2,
     y = canH/2,
     percent = 70;

     context.strokeStyle = chrg ? 'white' : 'red';
     context.lineWidth = 1;
     context.clearRect(0, 0, canW, canH);
     context.beginPath();
     context.moveTo(x + radius, y);
     context.arc(x, y, radius, 0, 2 * Math.PI * lvl);
     context.stroke();

     if(lvl > 1.0) {
       context.strokeStyle = '#696969';
       context.beginPath();
       context.arc(x, y, radius, 2 * Math.PI * lvl, 2 * Math.PI);
       context.stroke();
     }
   });
 }
 
 function locate() {
   fetch('https://ipapi.co/json/')
   .then((res) => res.json())
   .then((data) => {
     lat = data.latitude;
     lon = data.longitude;
     getWeather();
     sunEvents(lat, lon);
   })
 }


 function solar_event(date, latitude, longitude, rising, zenith) {
   var year = date.getUTCFullYear(),
       month = date.getUTCMonth() + 1,
       day = date.getUTCDate();

   var floor = Math.floor,
       degtorad = function(deg) {
           return Math.PI * deg / 180;
       },
       radtodeg = function(rad) {
           return 180 * rad / Math.PI;
       },
       sin = function(deg) {
           return Math.sin(degtorad(deg));
       },
       cos = function(deg) {
           return Math.cos(degtorad(deg));
       },
       tan = function(deg) {
           return Math.tan(degtorad(deg));
       },
       asin = function(x) {
           return radtodeg(Math.asin(x));
       },
       acos = function(x) {
           return radtodeg(Math.acos(x));
       },
       atan = function(x) {
           return radtodeg(Math.atan(x));
       },
       modpos = function(x, m) {
           return ((x % m) + m) % m;
       };

   // 1. first calculate the day of the year
   var N1 = floor(275 * month / 9),
       N2 = floor((month + 9) / 12),
       N3 = (1 + floor((year - 4 * floor(year / 4) + 2) / 3)),
       N = N1 - (N2 * N3) + day - 30;

   // 2. convert the longitude to hour value and calculate an approximate time
   var lngHour = longitude / 15,
       t = N + (((rising ? 6 : 18) - lngHour) / 24);

   // 3. calculate the Sun's mean anomaly
   var M = (0.9856 * t) - 3.289;

   // 4. calculate the Sun's true longitude
   var L = M + (1.916 * sin(M)) + (0.020 * sin(2 * M)) + 282.634;
   L = modpos(L, 360); // NOTE: L potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
   // 5a. calculate the Sun's right ascension
   var RA = atan(0.91764 * tan(L));
   RA = modpos(RA, 360); // NOTE: RA potentially needs to be adjusted into the range [0,360) by adding/subtracting 360
   // 5b. right ascension value needs to be in the same quadrant as L
   var Lquadrant = (floor(L / 90)) * 90,
       RAquadrant = (floor(RA / 90)) * 90;
   RA = RA + (Lquadrant - RAquadrant);

   // 5c. right ascension value needs to be converted into hours
   RA = RA / 15;

   // 6. calculate the Sun's declination
   var sinDec = 0.39782 * sin(L),
       cosDec = cos(asin(sinDec));

   // 7a. calculate the Sun's local hour angle
   var cosH = (cos(zenith) - (sinDec * sin(latitude))) / (cosDec * cos(latitude));
   var H;

   if (cosH > 1) {
       return undefined; // the sun never rises on this location (on the specified date)
   } else if (cosH < -1) {
       return undefined; // the sun never sets on this location (on the specified date)
   }

   // 7b. finish calculating H and convert into hours
   if (rising) {
       H = 360 - acos(cosH);
   } else {
       H = acos(cosH);
   }
   H = H / 15;

   // 8. calculate local mean time of rising/setting
   var T = H + RA - (0.06571 * t) - 6.622;

   // 9. adjust back to UTC
   var UT = T - lngHour;
   UT = modpos(UT, 24); // NOTE: UT potentially needs to be adjusted into the range [0,24) by adding/subtracting 24

   var hours = floor(UT),
       minutes = Math.round(60 * (UT - hours));
   var result = new Date(Date.UTC(year, month - 1, day, hours, minutes))
   return result;
}

var zeniths = {
   'official': 90.833333,
   'civil': 96,
   'nautical': 102,
   'astronomical': 108
};

function sunrise(date, latitude, longitude, type) {
   var zenith = zeniths[type] || zeniths['official'];
   return solar_event(date, latitude, longitude, true, zenith);
}

function sunset(date, latitude, longitude, type) {
   var zenith = zeniths[type] || zeniths['official'];
   return solar_event(date, latitude, longitude, false, zenith);
}

function solar_events(date, latitude, longitude) {
   return {
       'dawn': sunrise(date, latitude, longitude, 'civil'),
       'sunrise': sunrise(date, latitude, longitude, 'official'),
       'sunset': sunset(date, latitude, longitude, 'official'),
       'dusk': sunset(date, latitude, longitude, 'civil')
   };
}

Date.prototype.time = function() {
 let h = this.getHours(),
 m = this.getMinutes();

 return [h, ":", m].join('');
};


function sunEvents(lat, long) {
 
 let now = new Date(),
 events = solar_events(now, lat, long),
 sunriseSplit = events.sunrise.time().split(":"),
 sunsetSplit = events.sunset.time().split(":"),
 sunset = sunsetSplit[0] + ":" + sunsetSplit[1],
 sunrise = sunriseSplit[0] + ":" + sunriseSplit[1];

 if(Number(sunriseSplit[1]) < 10){
   sunrise = sunriseSplit[0] + ":0" + sunriseSplit[1];
 } 

 if(Number(sunsetSplit[1]) < 10){
   sunset = sunsetSplit[0] + ":0" + sunsetSplit[1];  
 } 

 document.getElementById("sun-emote").innerText = (events.sunset > now) ? "🌅" : "🌗";
 document.getElementById("sun-emote").addEventListener("click", (e)=> {
   if(e.target.innerText.length < 10){
     
     e.target.innerText += " ▲ " + sunrise + "  ▼ " + sunset;
   }
   else{
     e.target.innerText = (events.sunset > now) ? "🌅" : "🌗";
   }
   
 });

} 

locate();
hideCursor();
setInterval(getDate, 1000);
setInterval(getBattery, 1000);
setInterval(getWeather, 1000*60*30);