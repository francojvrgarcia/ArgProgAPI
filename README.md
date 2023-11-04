Weather Dashboard App
La Weather Dashboard App es una aplicación web que proporciona información meteorológica en tiempo real y datos de seguimiento de rutas de transporte público en Buenos Aires. Esta aplicación utiliza datos de fuentes externas y ofrece una interfaz de usuario intuitiva para obtener información actualizada.

Funcionalidades
Visualiza datos meteorológicos en tiempo real, incluyendo la temperatura, la humedad, la velocidad del viento, la visibilidad, el índice UV y más.
Muestra la temperatura máxima y mínima del día, así como la hora de salida y puesta del sol.
Rastrea la ubicación en tiempo real de los autobuses en rutas específicas de Buenos Aires en un mapa interactivo.
Filtra y selecciona una ruta de autobús específica.
Actualiza automáticamente los datos de clima y transporte cada 31 segundos.
Tecnologías Utilizadas
React
Chart.js y Moment.js para la representación gráfica de datos.
Leaflet para la visualización de mapas y marcadores de autobuses.
Fetch API para obtener datos de fuentes externas.
Instalación
Clona el repositorio:

bash
Copy code
git clone <URL del repositorio>
cd weather-dashboard-app
Instala las dependencias:

bash
Copy code
npm install
Inicia la aplicación:

bash
Copy code
npm start
Abre tu navegador y visita http://localhost:3000 para ver la aplicación en funcionamiento.

Uso
Al abrir la aplicación, verás un campo de búsqueda que te permite filtrar y seleccionar una ruta de autobús específica en Buenos Aires.

Después de seleccionar una ruta, la aplicación mostrará un mapa interactivo con la ubicación en tiempo real de los autobuses en esa ruta.

En la parte superior, encontrarás información meteorológica en tiempo real, incluyendo la temperatura actual, la hora actual, y otros detalles relacionados con el clima.

La parte inferior derecha muestra datos detallados como el índice UV, la velocidad del viento, la humedad, la visibilidad y más.

La aplicación se actualiza automáticamente cada 31 segundos para garantizar que siempre tengas datos actualizados.

