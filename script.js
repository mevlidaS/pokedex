let currentPokemon;
let statsnumber = [0, 1, 2, 3, 4, 5];
let pokemonamount = 41;
let pokemonBaseStats= [];
let pokemonNames=[];
let currentPokemonIndex = 0;
let isFiltered = false;

const colours = {normal: '#A8A77A', fire: '#EE8130', water: '#6390F0', electric: '#F7D02C', grass: '#7AC74C', ice: '#96D9D6',
	            fighting: '#C22E28', poison: '#A33EA1', ground: '#E2BF65', flying: '#A98FF3', psychic: '#F95587', bug: '#A6B91A',
	            rock: '#B6A136', ghost: '#735797', dragon: '#6F35FC', dark: '#705746', steel: '#B7B7CE', fairy: '#D685AD',
};

async function init(){
    await loadPokemon();  
}

async function loadPokemon() {
    for (let i = 1; i < pokemonamount; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        let name=currentPokemon['name'];
        pokemonNames.push(name);
        renderPokemon(i, currentPokemon);
    }
}

async function loadPokemonStats(i) {
    let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let pokemonStats = responseAsJson['stats'];
    pokemonBaseStats = []; 
    for (let i = 0; i < statsnumber.length; i++) {
        const stat = pokemonStats[statsnumber[i]]['base_stat'];
        pokemonBaseStats.push(stat);
    }
    return pokemonBaseStats; 
}

function renderPokemon(i,currentPokemon) {
    let pokemonImg = currentPokemon['sprites']['other']['official-artwork']['front_default'];
    let pokemonName = currentPokemon['name'];
    let pokemonType0= currentPokemon['types'][0]['type']['name'];
    let backgroundColor = colours[pokemonType0];
    document.getElementById('pokemonCard').innerHTML += /*HTML*/ `
    <div id='pokemon${i}' class='card'style="background-color: ${backgroundColor};" onclick="openPokemonInfo('${pokemonName}','${pokemonImg}','${pokemonType0}',${i})">
        <div class="pokemon_info">
            <h3>${pokemonName}</h3>
            <div class="id"><b>${i}</b></div>
        </div>
        <div class="image_container">
            <img class="pokemon_img" src='${pokemonImg}'>
        </div>
    </div>`;
    checkTypes(i,currentPokemon);
}


function checkTypes(i, currentPokemon) {
    let pokemonType0 = currentPokemon['types'][0];
    let pokemonType1 = currentPokemon['types'][1];
    if (pokemonType0) {
        document.getElementById(`pokemon${i}`).innerHTML += `
        <span class="type"><b>${pokemonType0['type']['name']}</b></span>`;
    }
    if (pokemonType1) {
        document.getElementById(`pokemon${i}`).innerHTML += `
        <span class="type"><b>${pokemonType1['type']['name']}</b></span>`;
    }
}

function openPokemonInfo(pokemonName,pokemonImg,pokemonType0,i) {
    document.getElementById('pokemonCard').classList.add('d_none');
    document.getElementById('header').classList.add('d_none');
    document.getElementById('button').classList.add('d_none');
    document.getElementById('bigImg').classList.remove('d_none');
    currentPokemonIndex = i; 
    loadPokemonStats(i).then(function(pokemonBaseStats){
        document.getElementById('bigImg').innerHTML = showPokemonInfo(pokemonName, pokemonImg, pokemonType0, i);
        renderChart(i,pokemonBaseStats);
    });
}

function showPokemonInfo(pokemonName,pokemonImg,pokemonType0,i){
    let backgroundColor = colours[pokemonType0];
    let arrowsDisplayStyle = 'block';
    if (isFiltered) {
        arrowsDisplayStyle = 'none';
    }
    return  /*HTML*/`
    <div class="pokemon_info_container">
        <div class="info_container" style="background-color: ${backgroundColor};">
            <h1>${pokemonName}</h1>
            <img class="pokemon_info_img" src="${pokemonImg}">
            <span class="text"><b>${pokemonType0}</b></span>
            <div class="arrow_container">
                <img onclick="previousPokemon(event)" id="previousArrow" class="icon_img" src="./img/linker-chevron.png" style="display: ${arrowsDisplayStyle};">
                <img onclick="nextPokemon(event)" id="nextArrow" class="icon_img" src="./img/richtiger-chevron.png" style="display: ${arrowsDisplayStyle};">
            </div>
        </div>
        <div class="pokemon_stats">
            <div class="chart_container">
                <canvas id="myChart${i}"></canvas>
            </div>
        </div>
    </div>`;
}

function closePokemonInfo() {
    document.getElementById('pokemonCard').classList.remove('d_none');
    document.getElementById('header').classList.remove('d_none');
    document.getElementById('button').classList.remove('d_none');
    document.getElementById('bigImg').classList.add('d_none');
}

async function loadMorePokemons() {
    let loadMoreButton = document.getElementById('loadbutton');
    loadMoreButton.disabled = true;
    let offsetnumber = pokemonamount + 20;
    for (let i = pokemonamount; i < offsetnumber; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        let name=currentPokemon['name'];
        pokemonNames.push(name);
        renderPokemon(i, currentPokemon);
    }
    pokemonamount =offsetnumber ;  
    loadMoreButton.disabled = false; 
}

function filterPokemons(){
    let search = document.getElementById('search').value;
    search= search.toLowerCase(); 
    let cards = document.getElementsByClassName('card');
    for (let i= 0; i< cards.length; i++) {
        let pokemonName = pokemonNames[i];
        if (pokemonName.toLowerCase().includes(search)) {
            cards[i].style.display = 'block';
        } else {
            cards[i].style.display = 'none';
        }
    }
    isFiltered = true;
    document.getElementById('loadbutton').style.display = 'none';
}

function nextPokemon(event) {
    event.stopPropagation(onclick);
    currentPokemonIndex++;
    if (currentPokemonIndex >= pokemonamount) {
        currentPokemonIndex = 1;
    }
    showPokemon(currentPokemonIndex);
}

function previousPokemon(event) {
    event.stopPropagation(onclick);
    currentPokemonIndex--;
    if (currentPokemonIndex < 1) {
        currentPokemonIndex = pokemonamount - 1;
    }
    showPokemon(currentPokemonIndex);
}

async function showPokemon(index) {
    if (index <= 0) {
        index = pokemonamount - 1;
    }
    let pokemonName = pokemonNames[index - 1];
    let url = `https://pokeapi.co/api/v2/pokemon/${index}/`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    let pokemonImg = responseAsJson['sprites']['other']['official-artwork']['front_default'];
    let pokemonType = responseAsJson['types'][0]['type']['name'];
    document.getElementById('bigImg').innerHTML = showPokemonInfo(pokemonName, pokemonImg, pokemonType, index);
    loadPokemonStats(index).then(function (pokemonBaseStats) {
        renderChart(index, pokemonBaseStats);
    });
}







