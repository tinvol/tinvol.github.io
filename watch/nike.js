let ringColor = "#ffffff",
activeRingColor = "#800080",
backgroundColor = "#000000",
faceColor = "#808080",
fontColor = "#000000",
hour = 0,
minute = 0,
load = true;

function update() {

    if(load){
        getCookies();
        load = false;
    }
    
    let dt = new Date(),
    millis = dt.getMilliseconds(),
    sec = dt.getSeconds();

    if(hour != dt.getHours() || minute != dt.getMinutes()){
        hour = dt.getHours();
        minute = dt.getMinutes();

        let hr = Number(hour) < 10 ? '0'+hour : hour,
        min = Number(minute) < 10 ? '0'+minute : minute;

        document.getElementById("hour").innerText = hr;
        document.getElementById("min").innerText = min;
    }

    let percent = (sec/60*100 + (millis/1000)*100*(1/60));

    document.getElementById("ring").style.backgroundImage = percentToGradient(percent);
}

function percentToGradient(percent) {
    let grad = "";
    
    if(percent <= 50){
        let angle = 90 + 3.6*percent;
        grad = "linear-gradient("+angle+"deg, transparent 50%,"+ringColor+" 50%), linear-gradient(90deg,"+ringColor+" 50%, transparent 50%)";
    }
    else{
        let angle = 270 + 3.6*(percent-50);
        grad = "linear-gradient(270deg, "+activeRingColor+" 50%, transparent 50%), linear-gradient("+angle+"deg, "+activeRingColor+" 50%, "+ringColor+" 50%)";
    }

    return grad;
}

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
            color.style.display = "none";
        }, 3500);
        
        el.setAttribute("timer", t);
        el.style.cursor = "auto";
        color.style.display = "inline";
    });
}

document.getElementById('colorBg').addEventListener('change', (e) => {
    setBackgroundColor(e.target.value);
});

document.getElementById('colorFace').addEventListener('change', (e) => {
    setFaceColor(e.target.value);
});

document.getElementById('colorFont').addEventListener('change', (e) => {
    setFontColor(e.target.value);
});

document.getElementById('colorShadow').addEventListener('change', (e) => {
    setRingColor(e.target.value);
});

document.getElementById('colorRingAct').addEventListener('change', (e) => {
    setActiveRingColor(e.target.value);
});

function setFontColor(color){
    fontColor = color;
    document.getElementById("face").style.color = fontColor;
    document.getElementById("colorFont").value = fontColor;
    setCookies();
}

function setFaceColor(color){
    faceColor = color;
    document.getElementById("ringInner").style.backgroundColor = faceColor;
    document.getElementById("colorFace").value = faceColor;
    setCookies();
}

function setBackgroundColor(color){
    backgroundColor = color;
    document.getElementById("bdy").style.backgroundColor = backgroundColor;
    document.getElementById("colorBg").value = backgroundColor;
    setCookies();
}

function setActiveRingColor(color){
    activeRingColor = color;
    document.getElementById("ring").style.backgroundColor = activeRingColor;
    document.getElementById("colorRingAct").value = activeRingColor;
    setCookies();
}

function setRingColor(color){
    ringColor = color;
    document.getElementById("face").style.boxShadow = "0 0 25px "+ringColor;
    document.getElementById("colorShadow").value = ringColor;
    setCookies();
}

function setCookies(){
    setCookie("conf", ringColor+":"+activeRingColor+":"+backgroundColor+":"+faceColor+":"+fontColor, 30);
}

function getCookies(){
    if(document.cookie.includes("conf")){
        let cookieArr = document.cookie.split("=")[1].split(":"),
        ringColorCookie = cookieArr[0],
        activeRingColorCookie = cookieArr[1],
        backgroundColorCookie = cookieArr[2],
        faceColorCookie = cookieArr[3],
        fontColorCookie = cookieArr[4];
    
        setRingColor(ringColorCookie);
        setActiveRingColor(activeRingColorCookie);
        setBackgroundColor(backgroundColorCookie);
        setFaceColor(faceColorCookie);
        setFontColor(fontColorCookie);
    }
   
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

update();
hideCursor();
setInterval(update, 40);