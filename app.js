document.getElementById("heure").value = "";
document.getElementById("jour").value = "";
document.getElementById("doneToday").checked = false;

let doneToday = document.getElementById("doneToday").checked;
let doneMinutes;
let HPDTxt;
let MPDTxt;

// Elmt recuperes
let ignoredDays = 0;

// Elmt de reponse
let totalMonth = document.getElementById("totalMonth");
let totalToday = document.getElementById("totalToday");

// variables de reponse
let totalDaysInMonth = 0;
let remainingDays = 0;
let workingDaysPast = 0;
let waitedTimeForTonight = 0;
let totalHoursInMonth = 0;

// Elmt de date
const now = new Date();
const openDay = now.getDay() != 0 && now.getDay() != 6;
const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

// Calcul des valeurs
for (let date = new Date(firstOfMonth);
    date < firstOfNextMonth;
    date.setDate(date.getDate() + 1)) {
    if (date.getDay() !== 0 && date.getDay() !== 6) {
        if (date.getDate() < now.getDate()) {
            workingDaysPast++;
        } else {
            remainingDays++;
        }
        totalDaysInMonth++;
    }
}

let buff = remainingDays;

totalHoursInMonth = totalDaysInMonth * 7;
totalMonth.innerHTML = totalHoursInMonth + "h";

async function Start() {

    if (typeof (document.getElementById("jour").value) != null &&
        typeof (Number(document.getElementById("jour").value)) == "number") {
        ignoredDays = Number(document.getElementById("jour").value);
    } else {
        ignoredDays = 0;
    }

    waitedTimeForTonight = workingDaysPast * 7 - ignoredDays * 7;

    if (openDay) {
        waitedTimeForTonight += 7;
    }

    // Retour des valeurs
    totalToday.innerHTML = waitedTimeForTonight + "h";
    calculate()

}

async function DoneTime(arg) {
    let hoursTxt = "";
    let minutesTxt = "";
    let hoursParsed = false;

    for (let k of arg) {
        if (k === '.' ||
            k === ',' ||
            k === ':' ||
            k === 'H' ||
            k === 'h') {
            hoursParsed = true;
            continue;
        }
        if (hoursParsed) {
            minutesTxt += k;
        } else {
            hoursTxt += k;
        }
    }
    return [hoursTxt, minutesTxt];
}

async function calculate() {

    doneToday = document.getElementById("doneToday").checked;
    let totalRem = document.getElementById("totalRem");
    let difference = document.getElementById("difference");
    let nature = document.getElementById("nature");

    // Calcul du retard/avance
    // Elmt recuperes
    let doneTime = "";
    if (typeof (document.getElementById("heure").value) != null &&
        typeof (Number(document.getElementById("heure").value)) == "number") {
        doneTime = document.getElementById("heure").value;
    }

    let timeTxt = await DoneTime(doneTime);
    let doneHours = Number(timeTxt[0]);

    doneMinutes = Number(timeTxt[1]) + doneHours * 60;

    let diffValue = waitedTimeForTonight * 60 - doneMinutes - 420;

    if (doneToday
        || !openDay) {
        diffValue += 420;
    }

    let diffNature = "de retard.";


    if (doneMinutes + ignoredDays * 7 * 60 < totalHoursInMonth * 60
        && document.getElementById("heure").value != ""
    ) {
        console.log(doneMinutes)
        console.log(totalHoursInMonth * 60)
        let totalRemaining = totalHoursInMonth * 60 - doneMinutes - ignoredDays * 7 * 60;
        let totalHoursRemaining = Math.floor(totalRemaining / 60) - ignoredDays * 7;
        let totalMnRemaining = totalRemaining % 60;
        let totalTimeRemaining;
        if (totalHoursRemaining > 0) {
            totalTimeRemaining = totalHoursRemaining + "h";
        }
        if (totalMnRemaining > 0) {
            if (totalMnRemaining < 10) {
                totalTimeRemaining = totalTimeRemaining + "0";
            }
            totalTimeRemaining = totalTimeRemaining + totalMnRemaining + "mn";
        }
        totalRem.innerHTML = "Il me reste " + totalTimeRemaining + " à faire dans le mois."
    } else {
        totalRem.innerHTML = "";
    }

    if (diffValue < 0) {
        diffValue = - diffValue;
        diffNature = "d'avance .";
    }

    nature.innerHTML = diffNature;
    let diffHour;
    diffHour = Math.floor(diffValue / 60);
    let diffMn = (diffValue % 60);

    if (diffHour > 0) {
        diffHour = diffHour + "h";
    } else {
        diffHour = "";
    }
    if (diffMn > 0) {
        if (diffMn < 10) {
            diffMn = "0" + diffMn;
        }
        diffMn = diffMn + "mn";

    } else {
        diffMn = "";
    }
    if (doneTime != "") {
        difference.innerHTML = "J'ai " + diffHour + diffMn;
    } else {
        difference.innerHTML = "";
        nature.innerHTML = "";
    }
    if (diffMn == "" && diffHour == "") {
        difference.innerHTML = "Je suis à jour.";
        nature.innerHTML = "";
    }
    let rythme = document.getElementById("rythme");

    timePerDay()
    let finish = HPDTxt + MPDTxt;
    rythme.innerHTML = "Je dois faire " + finish + "/j.";
    if (totalHoursInMonth <= doneMinutes / 60 + ignoredDays * 7) {
        difference.innerHTML = "J'ai fini mes heures ce mois-ci.";
        nature.innerHTML = "";
        rythme.innerHTML = "Je suis à jour.";
    }
    if (document.getElementById("heure").value == ""
        && document.getElementById("jour").value == "") {
        difference.innerHTML = "";
        nature.innerHTML = "";
        rythme.innerHTML = "";
    }
}

async function timePerDay() {

    let tmp = doneMinutes;
    if (tmp == undefined) {
        tmp = 0;
    }
    tmp += ignoredDays * 7 * 60
    let remainingMn = totalHoursInMonth * 60 - tmp;

    if (doneToday
        && openDay) {
        buff = remainingDays - 1;
    } else if (!doneToday
        && openDay) {
        buff = remainingDays;
    }
    remainingMn /= buff

    let tmpHr = Math.floor(remainingMn / 60);

    let tmpMn = remainingMn - tmpHr * 60;
    let mnt = Math.ceil(tmpMn);
    if (mnt < 10) {
        MPDTxt = "0" + mnt + "mn";
    } else {
        MPDTxt = mnt + "mn";
    }

    let hourPerD = Math.floor(tmpHr);
    HPDTxt = hourPerD + "h";

    MPDTxt = mnt + "mn";
}

Start()

// Fonction pour afficher le loader
function showLoader() {
    document.getElementById("modal_load").style.display = "flex";
}

// Fonction pour cacher le loader
function hideLoader() {
    document.getElementById("modal_load").style.display = "none";
}

document.getElementById("heure").addEventListener('input', Start);
document.getElementById("jour").addEventListener('input', Start);
document.getElementById("doneToday").addEventListener('click', Start)

document.addEventListener("keydown", function(event) {
    // Vérifier si la touche appuyée est "Entrée" (keyCode 13)
    if (event.key === "Enter") {
        event.preventDefault();  // Empêche le comportement par défaut de "Entrée"

        // Récupérer les valeurs des champs et les nettoyer
        let p1 = document.getElementById("p1").value.trim();
        let p2 = document.getElementById("p2").value.trim();

        // Vérifier les conditions des champs
        if (p1.length > 5 && p2.length > 5) {
            // Si les conditions sont remplies, simuler un clic sur le bouton
            document.getElementById("submitBtn").click();
        }
    }
});
document.getElementById("submitBtn").addEventListener("click", async function(event) {
    event.preventDefault();
    let p1 = document.getElementById("p1").value.trim();
    let p2 = document.getElementById("p2").value.trim();

    if (p1.length > 5 && p2.length > 5) {
        document.getElementById("modal_load").style.display = "flex";
        try {
            let response = await fetch("https://puppeteer-backend-idsn.onrender.com/fetch-data", {  // Use Render URL
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: p1, password: p2 })
            });
            
            let result = await response.json();
            if (result.data) {
                document.getElementById("result").textContent = "Valeur récupérée: " + result.data;
                const timeString = result.data;
                const formattedTime = timeString.split(':').slice(0, 2).join(':');
                document.getElementById("heure").value = formattedTime;
                
                Start();

            } else {
                document.getElementById("result").textContent = "Aucune donnée trouvée.";
            }
            document.getElementById("modal_load").style.display = "none";
        } catch (error) {
            console.error("Error:", error);
            document.getElementById("result").textContent = "Erreur lors de la récupération.";
            document.getElementById("modal_load").style.display = "none";
        }
    } else {
        alert("Both fields must be filled and contain more than 5 characters.");
    }
});

document.addEventListener("DOMContentLoaded", () => {
    const zone = document.querySelector(".zone01Emp");
    const handle = document.querySelector(".drag-handle");

    let isDragging = false;
    let offsetX, offsetY;

    handle.addEventListener("mousedown", (e) => {
        isDragging = true;
        offsetX = e.clientX - zone.getBoundingClientRect().left;
        offsetY = e.clientY - zone.getBoundingClientRect().top;
        zone.style.transition = "none"; // Désactiver les transitions pendant le drag
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        let x = e.clientX - offsetX;
        let y = e.clientY - offsetY;

        // Empêcher que la div sorte de l'écran
        const maxX = window.innerWidth - zone.clientWidth;
        const maxY = window.innerHeight - zone.clientHeight;

        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));

        zone.style.left = `${x}px`;
        zone.style.top = `${y}px`;
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
    });
});

