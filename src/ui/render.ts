import { favorites } from '../utils/favorites';

export function renderBookCard(book: any) {
  const imageId = book.cover_i;
  const imageUrl = imageId 
    ? `https://covers.openlibrary.org/b/id/${imageId}-L.jpg` 
    : 'https://via.placeholder.com/200x300?text=No+Cover';

  const category = book.subject ? book.subject[0] : 'Художественная литература';
  const author = book.author_name ? book.author_name.join(', ') : 'Неизвестный автор';
  
  // Проверяем, в избранном ли книга
  const isFav = favorites.has(book.key);

  return `
    <article class="card" data-id="${book.key}">
      <button class="card__fav ${isFav ? 'is-active' : ''}" data-fav="${book.key}">
        ${isFav ? '♥' : '♡'}
      </button>
      <div class="card__image-wrapper">
        <img src="${imageUrl}" alt="Обложка книги ${book.title}" loading="lazy">
      </div>
      <div class="card__content">
        <span class="card__category">${category}</span>
        <h3 class="card__title">${book.title}</h3>
        <p class="card__author">${author}</p>
        <div class="card__footer">
          <span class="card__price">${book.price || 500} ₽</span>
          <!-- Добавили вызов showPage('book') вместо пустого действия -->
          <a href="#" class="card__link" onclick="showPage('book'); return false;">Подробнее →</a>
        </div>
      </div>
    </article>
  `;
}

export function renderLoading(count: number = 8) {
  return Array(count).fill('<div class="skeleton"></div>').join('');
}

export function renderError(message: string) {
  return `
    <div style="grid-column: 1 / -1; text-align: center; padding: 40px;">
      <h3>Упс! Что-то пошло не так 😔</h3>
      <p style="color: #666; margin-bottom: 20px;">${message}</p>
      <button class="hero__btn" onclick="window.location.reload()">Попробовать снова</button>
    </div>
  `;
}