const searhButtonPokemon = document.querySelector("#searhButtonPokemon")
const divNoFound = document.querySelector("#divNoFound")
const contPokemons = document.querySelector("#contPokemons")
const pageCurrent = document.querySelector("#pageCurrent")
const pageTotal = document.querySelector("#pageTotal")
const nextPage = document.querySelector("#nextPage")
const prevPage = document.querySelector("#prevPage")
const inputSearchPokemon = document.querySelector("#inputSearchPokemon")
const divPageContent = document.querySelector("#divPageContent");
const paginadorPokemons = document.querySelector("#paginadorPokemons");

const apiUrl = 'https://pokeapi.co/api/v2/pokemon/';

let OFFSET = 0;
let paginasTotal = 0;
let paginaActual = 1;

window.addEventListener('DOMContentLoaded', () => {
    inputSearchPokemon.value = '';
    load(true);
    getPagePokemon();
})

nextPage.addEventListener('click', () => {
    if (OFFSET <= paginasTotal) {
        OFFSET += 20;
        paginaActual += 1;
        pageCurrent.textContent = paginaActual;
        getPagePokemon();
    }
})

const load = (isEnable = false) => {
    let divLoading = document.querySelector("#divLoading");
    isEnable ? divLoading.classList.remove("hidden") : divLoading.classList.add("hidden");
    isEnable = !isEnable;
}


const getPokemon = async (urlPokemon) => {
    try {
        const res = await fetch(urlPokemon);
        const data = await res.json();

        load(false);

        return {
            'img': data.sprites.front_default,
            'name': data.name,
            'id': data.id
        }
    } catch (error) {
        alert(error);
    }

}

searhButtonPokemon.addEventListener('click', async () => {

    load(true);
    if (inputSearchPokemon.value === "") {
        divNoFound.classList.add("hidden");
        divPageContent.classList.remove("hidden");
        paginadorPokemons.classList.remove("hidden")
        getPagePokemon();
        return;
    } else {
        try {
            const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputSearchPokemon.value}`);
            const data = await res.json();


            contPokemons.innerHTML = "";

            let div = document.createElement("div");

            div.innerHTML = `<a
                href="#"
                class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
                >
                <img
                    class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                    src="${data.sprites.front_default}"
                    alt=""
                />
                <div class="flex flex-col justify-between p-4 leading-normal">
                    <h5
                    class="mb-2 text-xl line-clamp-1 font-normal tracking-tight text-gray-900 dark:text-white"
                    >
                    ${data.name}
                    </h5>
                    <p class="mb-3 line-clamp-1 text-center font-bold text-white">
                    N°${data.id}
                    </p>
                </div>
            </a>`;

            load(false);

            contPokemons.appendChild(div);
            paginadorPokemons.classList.add("hidden");


        } catch (error) {
            // alert("No hay resultados");
            divNoFound.classList.remove("hidden")
            paginadorPokemons.classList.remove("hidden");
            divPageContent.classList.add("hidden")

        }
    }

})


const getPagePokemon = async () => {

    try {

        const res = await fetch(`${apiUrl}/?offset=${OFFSET}&limit=20`);
        const data = await res.json();

        contPokemons.innerHTML = '';

        data.results.forEach(async pokemon => {
            let dataPokemon = await getPokemon(pokemon.url);

            let div = document.createElement('div');
            div.innerHTML = `<a
            href="#"
            class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700"
          >
            <img
              class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
              src="${dataPokemon.img}"
              alt=""
            />
            <div class="flex flex-col justify-between p-4 leading-normal">
              <h5
                class="mb-2 text-xl line-clamp-1 font-normal tracking-tight text-gray-900 dark:text-white"
              >
                ${dataPokemon.name}
              </h5>
              <p class="mb-3 line-clamp-1 text-center font-bold text-white">
                N°${dataPokemon.id}
              </p>
            </div>
          </a>`;

            contPokemons.appendChild(div)
        });

        paginasTotal = data.count;
        pageTotal.textContent = Math.floor(data.count / 20);
        pageCurrent.textContent = paginaActual;
        load(false);

    } catch (error) {
        alert(error);
        load(false);
    }

}