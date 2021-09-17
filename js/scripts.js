window.onload = () => {
    'use strict';
  
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }
}
  
  const horarioObj = {
	"days": [
		{
            "Monday": ["pt", "ae", "ae",  "mu", "af", "en"]
		}, {
            "Tuesday": ["pt", "pt", "em", "mt", "mt", "ea"]
		}, {
            "Wednesday": ["mt", "mt", "pt", "pt", "em", "ef"]
		}, {
            "Thursday": ["pt", "oc", "em", "mt", "mt", "mu"]
		}, {
            "Friday": ["pt", "pt", "ea", "mt", "mt", "en"]
		}
	]
};

/*
// Já não é necessário pedir novo horário a cada chamada...
async function getHorarioJson(path, callback) {
    return callback(await fetch(path).then(r => r.json()));
}
let changeDay = day => getHorarioJson('data/json/horario.json', (json) => {
    // ...
});
*/

let changeDay = day => {
    const weekDays = ["Sunday" , "Monday" , "Tuesday" , "Wednesday" , "Thursday" , "Friday" , "Saturday"];
    const optionsDiv = document.getElementById("options");
    let horarioDoDia = horarioObj.days.filter(
        (item) => {
            if (day % 6 !== 0) {
                return item[weekDays[day]];
            }
        }
    );

    if (horarioDoDia[0]) {
        renderTable(horarioDoDia[0][weekDays[day]])
        optionsDiv.style.display = "block";
    } else {
        renderEmptyTable();
        optionsDiv.style.display = "none";
    }
};

let renderTable = data => {
    const table = document.getElementsByTagName("table")[0];
    const fimDeSemana  = document.getElementById("fimDeSemana");

    if (table.style.display === "none") {
        table.style.display = "table";
    }

    if (fimDeSemana.style.display !== "none") {
        fimDeSemana.style.display = "none";
    }

    const rows = Array.from(table.rows);
    rows.forEach(elem => {
        if (elem.cells[1].dataset.periodo) {
            const val = data[elem.cells[1].dataset.periodo - 1];
            let aec = false;
            if (val === "mu" || val === "en" || val === "af") {
                aec = true;
            }
            const className = renderName(val);

            if (aec) {
                elem.cells[1].innerHTML = '<div class="aec"><img alt="" src="img/icones/' + val + '.svg"><span>' + className + '</span></div>'
            } else {
                elem.cells[1].innerHTML = '<div><img alt="" src="img/icones/' + val + '.svg"><span>' + className + '</span><div>'
            }

        }
    });

    if (localStorage.getItem("hideLabels")) {
        const check = Boolean(localStorage.getItem("hideLabels"))
        const inputHideLabels =  document.getElementById("hideLabels").getElementsByTagName('input')[0];
        inputHideLabels.checked = check;
        hideLabels(inputHideLabels);
    }
    
    if (localStorage.getItem("hideAECs")) {
        const check =  Boolean(localStorage.getItem("hideAECs"))
        const inputHideAECs =  document.getElementById("hideAECs").getElementsByTagName('input')[0];
        inputHideAECs.checked = check;
        hideAECs(inputHideAECs);
    }
}

let renderName = (abr) => {
    let result; 

    switch (abr) {
        case 'mt': result = 'Matemática'; break;
        case 'pt': result = 'Português'; break;
        case 'em': result = 'Estudo do Meio'; break;
        case 'ae': result = 'Apoio Estudo'; break;
        case 'ea': result = 'Ed. Artística'; break;
        case 'ef': result = 'Ed. Física'; break;
        case 'oc': result = 'Oferta Complementar'; break;
        case 'af': result = 'AEC Act. Física'; break;
        case 'en': result = 'AEC Inglês'; break;
        case 'mu': result = 'AEC Música'; break;
        default: resutlt = ''; 
    }
    return result;
}

let hideAECs = (self) => {
    let  elems = document.getElementsByClassName("aec");
    
    Array.from(elems).forEach(function(elem) {
        if (self.checked) {
            elem.style.display = 'none';
        } else {
            elem.style.display = 'block';
        }
    });

    localStorage.setItem('hideAECs', self.checked ? self.checked : '');    
}

hideLabels = (self) => {
    let  elems = document.querySelectorAll('[data-periodo]');

    Array.from(elems).forEach(function(elem) {
        var span = elem.getElementsByTagName('span')[0]
        if (self.checked) {
            span.style.display = 'none';
        } else {
            span.style.display = 'inline';
        }
    });
    localStorage.setItem('hideLabels', self.checked ? self.checked : '');
}

let renderEmptyTable = () => {
    const table = document.getElementsByTagName("table")[0];
    const fimDeSemana  = document.getElementById("fimDeSemana");

    if (table.style.display !== "none") {
        table.style.display = "none";
    }
    
    if (fimDeSemana.style.display === "none") {
        fimDeSemana.style.display = "block";
    }    
}

let changeTheme = (event) => {
    const newTheme = event.explicitOriginalTarget.dataset.tema;
    const oldTheme = newTheme === 'azul' ? 'rosa' : 'azul';

    document.body.classList.remove(oldTheme),
    document.body.classList.add(newTheme);

    localStorage.setItem('theme', newTheme);
}

document.getElementById('selectDay').addEventListener('change', function () {
    changeDay(this.value);
});

let themes = document.getElementsByClassName('temas');

Array.from(themes).forEach(function(elem) {
    elem.addEventListener('click', changeTheme);
});

(init = () => {
    if (localStorage.getItem("theme")) {
        document.body.classList.add(localStorage.getItem("theme"));
    } else {
        document.body.classList.add('rosa')
    }

    const currentDate = new Date();
    const todayNumeric = currentDate.getDay();

    let optionsIndex;
    if (todayNumeric === 0) {
        optionsIndex = 6;
    } else {
        optionsIndex = todayNumeric - 1;
    }

    var selectDay = document.getElementById('selectDay');
    selectDay.options[optionsIndex].selected = true;
    selectDay.options[optionsIndex].prepend('[HOJE] ');
    changeDay(todayNumeric);
})();