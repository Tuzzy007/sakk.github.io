const tabla = document.getElementById('saktabla');
const ujJatekGomb = document.getElementById('ujjatekgomb');
const nyertesKijelzo = document.getElementById('nyertes');
const babuk = {
    'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚', 'p': '♟',
    'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔', 'P': '♙'
};
let kezdoTablaAllas = [
    ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
    ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['', '', '', '', '', '', '', ''],
    ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
    ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R']
];
let tablaAllas = JSON.parse(JSON.stringify(kezdoTablaAllas));
let jelenlegiKor = 'feher';
let kivalasztottBabu = null;
let kivalasztottMezo = null;
function tablaLetrehozas() {
    tabla.innerHTML = '';
    for (let sor = 0; sor < 8; sor++) {
        for (let oszlop = 0; oszlop < 8; oszlop++) {
            const mezo = document.createElement('div');
            mezo.classList.add('mezo');
            if ((sor + oszlop) % 2 === 0) {
                mezo.classList.add('feher');
            } else {
                mezo.classList.add('fekete');
            }
            mezo.setAttribute('data-sor', sor);
            mezo.setAttribute('data-oszlop', oszlop);
            const babu = tablaAllas[sor][oszlop];
            if (babu) {
                const babuElem = document.createElement('span');
                babuElem.textContent = babuk[babu];
                mezo.appendChild(babuElem);
            }
            mezo.addEventListener('click', mezoKattintas);
            tabla.appendChild(mezo);
        }
    }
}
function mezoKattintas(esemeny) {
    const mezo = esemeny.currentTarget;
    const sor = mezo.getAttribute('data-sor');
    const oszlop = mezo.getAttribute('data-oszlop');
    const babu = tablaAllas[sor][oszlop];
    if (kivalasztottBabu && kivalasztottMezo.sor === sor && kivalasztottMezo.oszlop === oszlop) {
        kivalasztottBabu = null;
        kivalasztottMezo = null;
        kiemelesTorles();
    } else if (kivalasztottBabu) {
        babuMozgatas(sor, oszlop);
    } else if (babu) {
        if (helyesKor(babu)) {
            kivalasztottBabu = babu;
            kivalasztottMezo = { sor, oszlop };
            mezoKiemeles(mezo);
        }
    }
}
function helyesKor(babu) {
    if (jelenlegiKor === 'feher') {
        return babu === babu.toUpperCase();
    } else {
        return babu === babu.toLowerCase();
    }
}
function mezoKiemeles(mezo) {
    kiemelesTorles();
    mezo.classList.add('kiemel');
}
function kiemelesTorles() {
    const kiemeltek = document.querySelectorAll('.kiemel');
    kiemeltek.forEach(m => m.classList.remove('kiemel'));
}
function babuMozgatas(celSor, celOszlop) {
    const { sor, oszlop } = kivalasztottMezo;
    const babu = kivalasztottBabu;
    const celMezo = tablaAllas[celSor][celOszlop];
    if (ervenyesLepes(babu, sor, oszlop, celSor, celOszlop, celMezo)) {
        tablaAllas[celSor][celOszlop] = babu;
        tablaAllas[sor][oszlop] = '';
        kivalasztottBabu = null;
        kivalasztottMezo = null;
        kiemelesTorles();
        kiralyEllenorzes();
        jelenlegiKor = jelenlegiKor === 'feher' ? 'fekete' : 'feher';
        tablaLetrehozas();
    }
}
function kiralyEllenorzes() {
    let feherKiraly = false;
    let feketeKiraly = false;
    for (let sor = 0; sor < 8; sor++) {
        for (let oszlop = 0; oszlop < 8; oszlop++) {
            if (tablaAllas[sor][oszlop] === 'K') {
                feherKiraly = true;
            }
            if (tablaAllas[sor][oszlop] === 'k') {
                feketeKiraly = true;
            }
        }
    }
    if (!feherKiraly) {
        nyertKihirdetes('Fekete');
    } else if (!feketeKiraly) {
        nyertKihirdetes('Fehér');
    }
}
function nyertKihirdetes(gyoztes) {
    nyertesKijelzo.textContent = `${gyoztes} nyert!`;
    nyertesKijelzo.style.display = 'block';
}
function ervenyesLepes(babu, kezdoSor, kezdoOszlop, celSor, celOszlop, celMezo) {
    if (celMezo && ((celMezo === celMezo.toUpperCase() && babu === babu.toUpperCase()) ||
        (celMezo === celMezo.toLowerCase() && babu === babu.toLowerCase()))) {
        return false;
    }
    switch (babu.toLowerCase()) {
        case 'p':
            return ervenyesGyalogLepes(babu, kezdoSor, kezdoOszlop, celSor, celOszlop, celMezo);
        case 'r':
            return ervenyesBastyaLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
        case 'n':
            return ervenyesHuszarLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
        case 'b':
            return ervenyesFutoLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
        case 'q':
            return ervenyesVezerLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
        case 'k':
            return ervenyesKiralyLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
        default:
            return false;
    }
}
function ervenyesGyalogLepes(babu, kezdoSor, kezdoOszlop, celSor, celOszlop, celMezo) {
    const irany = babu === 'P' ? -1 : 1;
    const kezdoSorInt = parseInt(kezdoSor);
    const celSorInt = parseInt(celSor);
    if (kezdoOszlop === celOszlop && !celMezo) {
        if (kezdoSorInt + irany === celSorInt) {
            return true;
        }
        if ((babu === 'P' && kezdoSorInt === 6) || (babu === 'p' && kezdoSorInt === 1)) {
            if (kezdoSorInt + irany * 2 === celSorInt && !tablaAllas[kezdoSorInt + irany][kezdoOszlop]) {
                return true;
            }
        }
    }
    if (Math.abs(kezdoOszlop - celOszlop) === 1 && kezdoSorInt + irany === celSorInt && celMezo) {
        return true;
    }
    return false;
}
function ervenyesBastyaLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) {
    if (kezdoSor === celSor || kezdoOszlop === celOszlop) {
        const sorLepes = kezdoSor === celSor ? 0 : kezdoSor < celSor ? 1 : -1;
        const oszlopLepes = kezdoOszlop === celOszlop ? 0 : kezdoOszlop < celOszlop ? 1 : -1;
        let ellenorzottSor = parseInt(kezdoSor) + sorLepes;
        let ellenorzottOszlop = parseInt(kezdoOszlop) + oszlopLepes;
        while (ellenorzottSor != celSor || ellenorzottOszlop != celOszlop) {
            if (tablaAllas[ellenorzottSor][ellenorzottOszlop]) {
                return false;
            }
            ellenorzottSor += sorLepes;
            ellenorzottOszlop += oszlopLepes;
        }
        return true;
    }
    return false;
}
function ervenyesHuszarLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) {
    const sorKulonbseg = Math.abs(kezdoSor - celSor);
    const oszlopKulonbseg = Math.abs(kezdoOszlop - celOszlop);
    return (sorKulonbseg === 2 && oszlopKulonbseg === 1) || (sorKulonbseg === 1 && oszlopKulonbseg === 2);
}
function ervenyesFutoLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) {
    const sorKulonbseg = Math.abs(kezdoSor - celSor);
    const oszlopKulonbseg = Math.abs(kezdoOszlop - celOszlop);
    if (sorKulonbseg === oszlopKulonbseg) {
        const sorLepes = kezdoSor < celSor ? 1 : -1;
        const oszlopLepes = kezdoOszlop < celOszlop ? 1 : -1;
        let ellenorzottSor = parseInt(kezdoSor) + sorLepes;
        let ellenorzottOszlop = parseInt(kezdoOszlop) + oszlopLepes;
        while (ellenorzottSor != celSor || ellenorzottOszlop != celOszlop) {
            if (tablaAllas[ellenorzottSor][ellenorzottOszlop]) {
                return false;
            }
            ellenorzottSor += sorLepes;
            ellenorzottOszlop += oszlopLepes;
        }
        return true;
    }
    return false;
}
function ervenyesVezerLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) {
    return ervenyesBastyaLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) || ervenyesFutoLepes(kezdoSor, kezdoOszlop, celSor, celOszlop);
}
function ervenyesKiralyLepes(kezdoSor, kezdoOszlop, celSor, celOszlop) {
    const sorKulonbseg = Math.abs(kezdoSor - celSor);
    const oszlopKulonbseg = Math.abs(kezdoOszlop - celOszlop);
    return sorKulonbseg <= 1 && oszlopKulonbseg <= 1;
}
ujJatekGomb.addEventListener('click', () => {
    tablaAllas = JSON.parse(JSON.stringify(kezdoTablaAllas));
    jelenlegiKor = 'feher';
    kivalasztottBabu = null;
    kivalasztottMezo = null;
    nyertesKijelzo.style.display = 'none';
    tablaLetrehozas();
});
tablaLetrehozas();