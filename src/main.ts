import './styles/main.scss';
import { searchBooks } from './api/books';
import { renderBookCard, renderLoading, renderError } from './ui/render';
import { favorites } from './utils/favorites';

let allBooks: any[] = [];

const searchInput = document.getElementById('search-input') as HTMLInputElement;
const favFilterBtn = document.getElementById('fav-filter-btn') as HTMLButtonElement;
const favCount = document.getElementById('fav-count') as HTMLSpanElement;

// Обновляем счетчик избранного при загрузке
function updateFavCount() {
  if (favCount) favCount.textContent = favorites.count().toString();
}

// Функция рендера списка (поиск + фильтр избранного)
function renderList(books: any[], gridId: string) {
  const grid = document.getElementById(gridId) as HTMLDivElement;
  if (!grid) return;

  const query = searchInput?.value.toLowerCase() || '';
  let filtered = books.filter(book => 
    book.title.toLowerCase().includes(query) || 
    (book.author_name && book.author_name.join(' ').toLowerCase().includes(query))
  );

  // Фильтр "Только избранные"
  if (favFilterBtn?.classList.contains('active')) {
    filtered = filtered.filter(book => favorites.has(book.key));
  }

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 20px;">Ничего не найдено</p>';
    return;
  }

  grid.innerHTML = filtered.map(book => renderBookCard(book)).join('');
  bindCardEvents(); // Перевешиваем события на сердечки
}

// Вешаем события на сердечки (избранное)
function bindCardEvents() {
  document.querySelectorAll('[data-fav]').forEach(btn => {
    const newBtn = btn.cloneNode(true) as HTMLButtonElement;
    btn.parentNode?.replaceChild(newBtn, btn);

    newBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const id = newBtn.dataset.fav!;
      const isNowFav = favorites.toggle(id);
      
      newBtn.classList.toggle('is-active', isNowFav);
      newBtn.textContent = isNowFav ? '♥' : '♡';
      updateFavCount();
    });
  });
}

// Загрузка данных
async function loadBooks() {
  const gridHome = document.getElementById('books-grid-home') as HTMLDivElement;
  const gridCatalog = document.getElementById('books-grid-catalog') as HTMLDivElement;

  if (gridHome) gridHome.innerHTML = renderLoading(4);
  if (gridCatalog) gridCatalog.innerHTML = renderLoading(8);

  try {
    allBooks = await searchBooks('classic fiction'); // Загружаем книги
    
    // Рендерим главную
    if (gridHome) renderList(allBooks.slice(0, 4), 'books-grid-home');
    
    updateFavCount();
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Ошибка';
    if (gridHome) gridHome.innerHTML = renderError(msg);
    if (gridCatalog) gridCatalog.innerHTML = renderError(msg);
  }
}

// Поиск при вводе текста
searchInput?.addEventListener('input', () => {
  // Если мы в каталоге — ищем в каталоге, если на главной — на главной
  if (document.getElementById('page-catalog')?.style.display === 'block') {
    renderList(allBooks, 'books-grid-catalog');
  } else {
    renderList(allBooks.slice(0, 4), 'books-grid-home');
  }
});

// Кнопка "Только избранные"
favFilterBtn?.addEventListener('click', () => {
  favFilterBtn.classList.toggle('active');
  favFilterBtn.style.color = favFilterBtn.classList.contains('active') ? '#E50914' : '';
  
  if (document.getElementById('page-catalog')?.style.display === 'block') {
    renderList(allBooks, 'books-grid-catalog');
  } else {
    renderList(allBooks.slice(0, 4), 'books-grid-home');
  }
});

// Слушаем событие перехода в каталог (из HTML)
window.addEventListener('renderCatalog', () => {
  renderList(allBooks, 'books-grid-catalog');
});

// Запуск
loadBooks();