countdown();
getLiveGames();
getGames();
getStandings();

function countdown() {
    const start = new Date('2022-11-20T17:00:00+01:00');
    let cnt = document.getElementById("countdown"),
    cntCon = document.getElementById("countdown-con"),
    now = new Date();

    if(now > start) {
        cnt.parentElement.remove();
        cntCon.remove();
    }
    else{
        setInterval(() => {
            let date = new Date(),
            time = start - date,
            millisDay = 24*60*60*1000,
            millisHour = 60*60*1000,
            millisMinute = 60*1000,
            millisSecond = 1000,
            days = Math.floor(time/millisDay),
            hours = Math.floor((time - days*millisDay)/millisHour),
            minutes = Math.floor((time - days*millisDay - hours*millisHour)/millisMinute),
            seconds = Math.floor((time - days*millisDay - hours*millisHour - minutes*millisMinute)/millisSecond);
            cntCon.innerText = `${days} Tage ${hours} Stunden ${minutes} Minuten ${seconds} Sekunden`;
        }, 1000);
    }
}

function getLiveGames() {
    fetch('http://bruhhh.de/api/matchdate', {
        method: 'POST', 
        headers: { 'Authorization': guic929 }
    }).then((res) => res.json())
    .then((json) => {
        let con =  document.getElementById("live-con");
        if(json.data.length == 0){
            con.innerText = "Keine Spiele live!";
        }
        else {
            json.data.forEach((game) => {
                let time = game.local_date.substr(game.local_date - 5);
                let team1 = game.home_team_en;
                let team2 = game.away_team_en;
                
                let newDiv = document.createElement("div");
                newDiv.innerText = time+"  "+team1+" - "+team2;

                con.appendChild(newDiv);
            })
        }
    });

}

function getGames() {
    let groups = [];
    fetch('http://bruhhh.de/api/match', {
        method: 'POST', 
        headers: { 'Authorization': vi3uk3g }
    }).then((res) => res.json())
    .then((json) => {
        console.log(json);
        json.data.forEach(game => {
            if(!groups.includes(game.group)){
                groups.push(game.group);
            }
        });
        groups.sort();

        groups.forEach(group => {
            let games = [];
            json.data.forEach(game => {
                if(group === game.group){
                    games.push(game);
                }
            });

            sortedGames = [];

            for(let i=0; i < games.length; i++){
                if(i == 0){
                    sortedGames.push(games[i]);
                }
                else{
                    if(Number(sortedGames[i-1].matchday) > Number(games[i].matchday)){
                        let save = sortedGames[i-1];
                        sortedGames[i-1] = games[i];
                        sortedGames[i] = save;
                    }
                    else{
                        sortedGames.push(games[i]);
                    }
                }
            }

            let html = document.getElementById("group-template").cloneNode(true);
            
            html.childNodes[1].innerText = "Gruppe "+group;
            html.childNodes[1].classList.add(group);
            
            sortedGames.forEach((game) => {
                let match = html.childNodes[3].cloneNode(true);
                let dateStr = game.local_date.split("/");
                
                let year = dateStr[2].split(" ")[0];
                let time = dateStr[2].split(" ")[1];
                let firstNum = Number(time.split(":")[0])-2;
                let date = dateStr[1]+"."+dateStr[0]+"."+year+" "+firstNum+":00";

                match.classList.add(getGermanName(game.home_team_en).replace(" ", ""));
                match.classList.add(getGermanName(game.away_team_en).replace(" ", "")); 
                match.childNodes[1].innerText = date;
                match.childNodes[3].innerText = getGermanName(game.home_team_en)+" - "+getGermanName(game.away_team_en);
                match.childNodes[5].innerText = game.home_score+" - "+game.away_score;
                
                html.appendChild(match);
            });
            html.childNodes[3].remove();
            document.getElementById("group-con").appendChild(html);
        });
        document.getElementById("group-template").remove();
    });

}

function getStandings() {
    fetch('http://bruhhh.de/api/standings', {
        method: 'POST', 
        headers: { 'Authorization': f928fhuh9 }
    }).then((res) => res.json())
    .then((json) => {
        json.data.forEach((group) => {

            let html = document.getElementById("standing-template").cloneNode(true);
            html.childNodes[1].innerText = "Gruppe "+group.group;
            html.childNodes[1].classList.add(group.group.replace(" ", "")); 

            sortedTeams = [];

            for(let i=0; i < group.teams.length; i++){
                if(i == 0){
                    sortedTeams.push(group.teams[i]);
                }
                else{
                    if(Number(sortedTeams[i-1].pts) > Number(group.teams[i].pts)){
                        let save = sortedTeams[i-1];
                        sortedTeams[i-1] = group.teams[i];
                        sortedTeams[i] = save;
                    }
                    else{
                        sortedTeams.push(group.teams[i]);
                    }
                }
            }

            sortedTeams.forEach((t) => {
                let div = document.getElementById("team").cloneNode(true);
                div.id = t.name_en;
                div.childNodes[1].innerText = getGermanName(t.name_en);
                div.childNodes[1].classList.add(getGermanName(t.name_en).replace(" ", ""));
                div.childNodes[3].innerText = t.w + "S " + t.l + "N - " + t.pts + "P";
                html.childNodes[3].appendChild(div);
            });


            document.getElementById("standings-con").appendChild(html);
        });

        document.getElementById("standing-template").remove();

    });

}

window.onscroll = function() {myFunction()};

var header = document.getElementById("ankers");
let cont = document.getElementById("countdown-con");
var sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
    document.getElementById("divider").style.height = header.offsetHeight+"px";   
  } else {
    header.classList.remove("sticky");
    document.getElementById("divider").style.height = "0px";   
  }
}

function getGermanName(name) {
    switch(name){
        case "Qatar":
            return "Katar";
        case "Nederlands":
            return "Niederlande";
        case "United States":
            return "USA";
        case "Argentina":
            return "Argentinien";
        case "Saudi Arabia":
            return "Saudi Arabien";
        case "Mexico":
            return "Mexiko";
        case "Poland":
            return "Polen";
        case "France":
            return "Frankreich";
        case "Australia":
            return "Australien";
        case "Denmark":
            return "Dänemark";
        case "Tunisia":
            return "Tunesien";
        case "Spain":
            return "Spanien";
        case "Germany":
            return "Deutschland";
        case "Morocco":
            return "Marokko";
        case "Croatia":
            return "Kroatien";
        case "Belgium":
            return "Belgien";
        case "Canada":
            return "Kanada";
        case "Brazil":
            return "Brasilien";
        case "Serbia":
            return "Serbien";
        case "Switzerland":
            return "Schweiz";  
        case "Cameroon":
            return "Kamerun";  
        case "South Korea":
            return "Südkorea";
        default:
            return name;
    }
}