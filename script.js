const apiKey = '03f127032b97464093dd754372d2d62e';  // Reemplaza con tu clave de NewsAPI
const newsContainer = document.getElementById('news-container');
const categorySelect = document.getElementById('category');
const prevButton = document.getElementById('prev-page');
const nextButton = document.getElementById('next-page');
const searchInput = document.getElementById('search');
const searchButton = document.getElementById('search-button');
const resetButton = document.getElementById('reset-search');

let currentPage = 1;
const pageSize = 5;  // Noticias por página
let totalResults = 0;
let currentCategory = 'general';
let searchTerm = '';  // Almacena la búsqueda por palabra clave

// Evento cuando se selecciona una nueva categoría
categorySelect.addEventListener('change', () => {
  currentCategory = categorySelect.value;
  searchTerm = '';  // Limpiar el término de búsqueda cuando cambie la categoría
  currentPage = 1;  // Reinicia la página al cambiar de categoría
  resetButton.classList.remove('active');  // Oculta el botón de reset
  fetchNews();
});

// Evento para ejecutar la búsqueda con el botón de búsqueda o al presionar Enter
searchButton.addEventListener('click', () => performSearch());

searchInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();  // Evitar el comportamiento por defecto del enter
    performSearch();
  }
});

// Evento para resetear la búsqueda
resetButton.addEventListener('click', () => {
  searchInput.value = '';
  searchTerm = '';
  currentPage = 1;  // Volver a la página inicial
  fetchNews();
  resetButton.classList.remove('active');  // Ocultar el botón de reset
});

// Evento para botones de paginación
prevButton.addEventListener('click', () => {
  if (currentPage > 1) {
    currentPage--;
    fetchNews();
  }
});

nextButton.addEventListener('click', () => {
  if (currentPage < Math.ceil(totalResults / pageSize)) {
    currentPage++;
    fetchNews();
  }
});

async function fetchNews() {
  let url = `https://newsapi.org/v2/top-headlines?country=us&category=${currentCategory}&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
  
  if (searchTerm) {
    // Si hay un término de búsqueda, usa el endpoint de búsqueda
    url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(searchTerm)}&pageSize=${pageSize}&page=${currentPage}&apiKey=${apiKey}`;
  }

  try {
    newsContainer.classList.add('news-hidden');  // Añade clase para ocultar con animación
    const response = await fetch(url);
    const data = await response.json();
    totalResults = data.totalResults;
    displayNews(data.articles);
    updatePagination();
    setTimeout(() => {
      newsContainer.classList.remove('news-hidden');  // Muestra las noticias con efecto
    }, 300);  // Tiempo de la animación
  } catch (error) {
    console.error('Error al obtener las noticias:', error);
    newsContainer.innerHTML = '<p>Error al obtener las noticias.</p>';
  }
}

function displayNews(articles) {
  newsContainer.innerHTML = '';

  if (articles.length === 0) {
    newsContainer.innerHTML = '<p>No hay noticias disponibles.</p>';
    return;
  }

  articles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.classList.add('col-md-4', 'mb-4', 'article');

    const articleImage = article.urlToImage
      ? `<img src="${article.urlToImage}" alt="Imagen de la noticia" class="img-fluid rounded">`
      : '';

    articleDiv.innerHTML = `
      <div class="card h-100">
        ${articleImage}
        <div class="card-body d-flex flex-column">
          <h2 class="card-title">${article.title}</h2>
          <p class="card-text">${article.description || 'Descripción no disponible.'}</p>
          <a href="${article.url}" class="btn btn-primary mt-auto" target="_blank">Leer más</a>
        </div>
      </div>
    `;

    newsContainer.appendChild(articleDiv);
  });
}

function updatePagination() {
  prevButton.disabled = currentPage === 1;
  nextButton.disabled = currentPage >= Math.ceil(totalResults / pageSize);
}

function performSearch() {
  searchTerm = searchInput.value.trim();  // Obtiene la palabra clave del input
  if (searchTerm) {
    currentPage = 1;  // Reiniciar a la página 1 para la nueva búsqueda
    fetchNews();
    resetButton.classList.add('active');  // Mostrar el botón de reset después de una búsqueda
  }
}

// Cargar noticias iniciales
fetchNews();
