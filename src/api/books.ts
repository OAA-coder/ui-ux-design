export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  price?: number;
}

interface OpenLibraryResponse {
  docs: Book[];
}

const BASE_URL = 'https://openlibrary.org/search.json';

export async function searchBooks(query: string = 'classic'): Promise<Book[]> {
  const url = `${BASE_URL}?q=${encodeURIComponent(query)}&limit=12`;
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error('Ошибка загрузки книг');
  }
  
  const data: OpenLibraryResponse = await response.json();
  
  return data.docs.map((book: Book) => {
    return {
      ...book,
      price: Math.floor(Math.random() * (900 - 400 + 1)) + 400 
    };
  });
}