// para los menús en el header. Cada li de la ul llama una función  que muestra un sub-menú distinto. A su vez cada elemento del submenú llama a una función diferente.

// sub-menú donde aparece el botón para mostrar la lista completa de películas
function mostrarMenuLista() {
    tituloPagina.innerHTML = ""
    divPeliculas.innerHTML = ""
    let subMenuLista = document.getElementById("subMenu")
    subMenuLista.setAttribute("class", "subMenu")
    subMenuLista.innerHTML = `
    <div>
        Lista completa de películas
    </div>
    <section class="opciones">
        <button id="verTodas">Ver Lista completa</button>
    </section>`
    // este getElementById accede al botón con la id "verTodas"
    let botonMostrar = document.getElementById("verTodas")
    // este evento hace que al cliquear el botón llame a la función mostrarListaCompleta
    botonMostrar.addEventListener("click", mostrarListaCompleta)
}

// sub-menú con el sistema búsqueda por título, director u año. Luego de leer los inputs llama a una función utilizando los parámetros leídos.
function mostrarMenuBusqueda() {
    tituloPagina.innerHTML = ""
    divPeliculas.innerHTML = ""
    let subMenuBusqueda = document.getElementById("subMenu")
    subMenuBusqueda.setAttribute("class", "subMenu")
    subMenuBusqueda.innerHTML = `
    <div>
        Búsquedas
    </div>
    <section class="opciones">
        <article>
            <button id="enviarTitulo">Buscar por título</button>
            <input type="text" id="inputTitulo">
        </article>
        <article>
            <button id="enviarDirector">Buscar por director</button>
            <input type="text" id="inputDirector">
        </article>
        <article>
            <button id="enviarAnio">Buscar por año</button>
            <input type="text" id="inputAnio">
        </article>
    </section>`

    let titulo = document.getElementById("inputTitulo")
    let director = document.getElementById("inputDirector")
    let anio = document.getElementById("inputAnio")

    const guardarTituloBtn = document.getElementById("enviarTitulo")
    const guardarDirectorBtn = document.getElementById("enviarDirector")
    const guardarAnioBtn = document.getElementById("enviarAnio")

    guardarTituloBtn.addEventListener("click", () => guardarTitulo(titulo.value, titulo))
    guardarDirectorBtn.addEventListener("click", () => guardarDirector(director.value, director))
    guardarAnioBtn.addEventListener("click", () => guardarAnio(anio.value, anio))
}

// Esta función muestra el submenú con el botón para mostrar las películas favoritas
function mostrarMenuFavoritas() {
    tituloPagina.innerHTML = ""
    divPeliculas.innerHTML = ""
    let subMenuFavoritas = document.getElementById("subMenu")
    subMenuFavoritas.setAttribute("class", "subMenu")
    subMenuFavoritas.innerHTML = `
    <div>Ver lista de películas favoritas (Puede seleccionar las favoritas a partir de la lista completa)</div>
    <section class="opciones">
        <button id="botonMostrarFavoritas">Ver favoritas</button>
    </section>`
    let botonMostrarFavoritas = document.getElementById("botonMostrarFavoritas")
    botonMostrarFavoritas.addEventListener("click", mostrarFavoritas)
}

// A continuación están las funciones de búsqueda y presentación de resultados en caso de encontrar coincidencias utlizando fetch
function guardarTitulo(titulo, valorInput) {
    busqueda(titulo, "titulo", valorInput)
}

function guardarDirector(director, valorInput) {
    busqueda(director, "director", valorInput)
}

function guardarAnio(anio, valorInput) {
    busqueda(anio, "anio", valorInput)
}

function busqueda(termino, datoPeli, valorInput) {
    fetch("peliculas.json")
        .then((respuesta) => respuesta.json())
        .then((filmoteca) => {
            if (datoPeli == "titulo") {
                valorInput.value = ""
                const resultado = filmoteca.filter((el) => el.titulo.toUpperCase() == termino.toUpperCase())
                resultadoONo(resultado)
            }
            else if (datoPeli == "director") {
                valorInput.value = ""
                const resultado = filmoteca.filter((el) => el.director.toUpperCase() == termino.toUpperCase())
                resultadoONo(resultado)
            }
            else {
                valorInput.value = ""
                const resultado = filmoteca.filter((el) => el.anio == termino)
                resultadoONo(resultado)
            }
        })
}

function resultadoONo(resultado) {
        
    if (resultado.length == 0) {
        divPeliculas.innerHTML = ""
        tituloPagina.innerText = "Su búsqueda no arrojó resultados"
    }
    else {
        mostrarResultados(resultado)
    }
}

function mostrarResultados(resultadoBusqueda) {
        
    divPeliculas.innerHTML = ""
    tituloPagina.innerText = "Su búsqueda arrojó los siguientes resultados:"
    resultadoBusqueda.forEach((pelicula) => {
        let nuevaPelicula = document.createElement("div")
        nuevaPelicula.innerHTML = `<article class="card">
                                        <h2>${pelicula.titulo}</h2>
                                        <p>estrenada en ${pelicula.anio}</p>
                                        <p>dirigida por ${pelicula.director}</p>
                                        <img src="${pelicula.afiche}">
                                    </article>`
        divPeliculas.appendChild(nuevaPelicula)
    })
    
}


// muestra de lista completas utilizando fetch
function mostrarListaCompleta() {
    fetch("peliculas.json")
        .then((respuesta) => respuesta.json())
        .then((filmoteca) => {
            tituloPagina.innerText = "Lista completa de películas"
            divPeliculas.innerHTML = ""
            filmoteca.forEach((pelicula) => {
                let nuevaPelicula = document.createElement("div")
                nuevaPelicula.innerHTML = `<article class="card">
                                        <h2>${pelicula.titulo}</h2>
                                        <p>estrenada en ${pelicula.anio}</p>
                                        <p>dirigida por ${pelicula.director}</p>
                                        <img src="${pelicula.afiche}">
                                        <button id="agregarAFavoritas${counter}">Agregar a Favoritas</button>
                                    </article>`
                divPeliculas.appendChild(nuevaPelicula)
                let botonFavoritas = document.getElementById(`agregarAFavoritas${counter}`)
                counter++
                botonFavoritas.addEventListener("click", () => agregarAFavoritas(pelicula))
            })
        })
}

// Esta función recibe como parámetro la película sobre la que se cliqueó y la agrega al array con la lista de películas favoritas y se las guarda en texto plano en el localStorage para poder ser vistas luego
function agregarAFavoritas(pelicula) {
    let peliculaElegida = favoritas.indexOf(pelicula)
    peliculaElegida == -1 && favoritas.push(pelicula)
    localStorage.setItem("favoritas", JSON.stringify(favoritas))
}

// Esta función parsea el array en texto plano para mostrar la lista de películas favoritas
function mostrarFavoritas() {
    tituloPagina.innerText = "Lista de películas favoritas"
    divPeliculas.innerHTML = ""
    let favoritasParseadas = JSON.parse(localStorage.getItem("favoritas"))
    favoritasParseadas.forEach((pelicula) => {
        let nuevaPelicula = document.createElement("div")
        nuevaPelicula.innerHTML = `<article class="card">
                                        <h2>${pelicula.titulo}</h2>
                                        <p>estrenada en ${pelicula.anio}</p>
                                        <p>dirigida por ${pelicula.director}</p>
                                        <img src="${pelicula.afiche}">
                                    </article>`
        divPeliculas.appendChild(nuevaPelicula)
    })
}

// Definción de nodos y de eventos para el menú
let listaBtn = document.getElementById("lista")
let busquedaBtn = document.getElementById("busqueda")
let favoritasBtn = document.getElementById("favoritas")
let tituloPagina = document.getElementById("tituloPagina")

listaBtn.addEventListener("click", mostrarMenuLista)
busquedaBtn.addEventListener("click", mostrarMenuBusqueda)
favoritasBtn.addEventListener("click", mostrarMenuFavoritas)

// array de objetos con la lista de películas favoritas 
let favoritas = JSON.parse(localStorage.getItem("favoritas")) || []

let divPeliculas = document.getElementById("peliculas")

// este setAttribute() llama a la clase .estiloPeliculas en el css
divPeliculas.setAttribute("class", "estiloPeliculas")
let counter = 1

// definiciones de los nodos y eventos para los botones que cambian los modos claros y oscuros
let botonOscuro = document.getElementById("botonOscuro")
let botonClaro = document.getElementById("botonClaro")

botonClaro.addEventListener("click", ()=> {
    document.body.classList.add("modoClaro")
    localStorage.setItem("modoClaro", "claro")
})

botonOscuro.addEventListener("click", ()=> {
    document.body.classList.remove("modoClaro")
    localStorage.setItem("modoClaro", "oscuro")
})

// Para el default, se nombra la variable sin darle un valor para ver en qué situación está 
let modoClaro

if(localStorage.getItem("modoClaro")) {
    modoClaro = localStorage.getItem("modoClaro")
}
else {
    localStorage.setItem("modoClaro", "oscuro")
}

// Si el modoClaro está en claro, tal como lo hace el eventListener, entonces transformo la clase a claro
if(modoClaro == "claro") {
    document.body.classList.add("modoClaro")
}