# game-trileros
🕹️TRILEROS🕹️

El objetivo del proyecto es recrear una pagina web en la que este implementado el juego de los trileros.

## Requisitos funcionales generales
    - La aplicación DEBE permitir al usuario jugar un juego seleccionado
    - La aplicación PUEDE obtener la ubicación del usuario mediante geolocalización del navegador.
    - La aplicación PUEDE identificar el país del usuario y mostrar la bandera correspondiente (API REST Countries o Country Flags).
    - La aplicación DEBERÍA mostrar el estado actual del clima, utilizando la localización del usuario para consultar una API de clima (OpenWeatherMap o WeatherAPI).
    - La aplicación DEBE mostrar un banner lateral con las noticias más recientes o relevantes del país del usuario, utilizando una API pública de noticias (NewsAPI o Mediastack).
    - La aplicación DEBERÍA manejar de forma responsable los errores o bloqueos de permisos de geolocalización, mostrando mensajes amigables al usuario.

## Requisitos funcionales juegos

**Minimos** 

- La aplicación DEBE tener tres vasos que oculten la bolita,
- La aplicación DEBE permitir mezclar aleatoriamente la bolita entre los 3 vasos,
- La aplicación DEBE tener animaciones de movimiento de la bolita,
- La aplicación DEBE permitir al usuario seleccionar un vaso,
- La aplicación DEBE tener mostrar un temporizador,
- La aplicación DEBE generar una alerta que le diga al usuario si acertó o erró,
- En el caso de que el usuario falle, la aplicación DEBE mostrar el vaso en el que estaba realmente la
bolita

**Extras**

- La aplicación DEBE tener niveles de dificultad crecientes,
- la aplicación DEBE almacenar en el localstorage los puntajes.


## Estructura del proyecto

```text
game-trileros/
├── index.html
├── assets/
│   ├── icons/          # Iconos y avatar de usuario
│   ├── img/            # Imágenes de las copas (azul, naranja, morada)
│   └── sounds/         # Sonidos de acierto y fallo (hit.mp3, miss.mp3)
├── scripts/
│   ├── config/
│   │   ├── apis.js        # Endpoints de NewsAPI, OpenMeteo y Nominatim
│   │   ├── audio.js       # Rutas a los archivos de sonido
│   │   └── difficulty.js  # Configuración de los niveles de dificultad
│   ├── logic/
│   │   ├── game.js        # Mecánicas del juego (colocación, barajeo, selección)
│   │   └── state.js       # Estado centralizado (fase, puntos, rondas, timer)
│   ├── services/
│   │   ├── audio.js       # Reproducción de sonidos
│   │   ├── http.js        # Wrapper de fetch con manejo de errores
│   │   ├── news.js        # Integración con NewsAPI (noticias deportivas)
│   │   └── weather.js     # Geolocalización + clima (OpenMeteo + Nominatim)
│   ├── ui/
│   │   ├── ball.js        # Inicialización del juego y event listeners
│   │   ├── counters.js    # UI del timer, marcador y selector de dificultad
│   │   └── menu.js        # Toggle del menú móvil
│   └── main.js            # Punto de entrada de la app
└── styles/
├── main.css            # Estilos principales (tema cyber/neón, layout responsive)
└── bannerNoticias.css  # Estilos del panel lateral de noticias
```

## Tecnologias

- ![HTML5](https://img.shields.io/badge/-HTML5-%23E44D27?style=flat-square&logo=html5&logoColor=ffffff)
- ![CSS3](https://img.shields.io/badge/-CSS3-%231572B6?style=flat-square&logo=css3)
- ![JavaScript](https://img.shields.io/badge/-JavaScript-%23F7DF1C?style=flat-square&logo=javascript&logoColor=000000&labelColor=%23F7DF1C&color=%23FFCE5A)
- Web APIs — Geolocation, localStorage, Audio
- APIs externas
    - NewsAPI — noticias deportivas en tiempo real
    - Open-Meteo — datos meteorológicos (sin clave)
    - Nominatim — geocodificación inversa (OpenStreetMap)

## 🔗 Enlaces del Proyecto

- Notion
https://www.notion.so/AZARgame-Trileros-345bac833ef680d59097d1febb3035f2?source=copy_link


## Autoras
- [Irina Diaz](https://github.com/irinadiaz22)
- [Dorien Llanes](https://github.com/Dorienbyte)
- [Maria de Benito](https://github.com/mariaromerodb-bit)
- [Yasira Gonzalez](https://github.com/yasirag)
- [Lexy Arreaz](https://github.com/LexyArraez)
