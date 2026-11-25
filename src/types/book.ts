export interface Book {
  key: string;
  title: string;
  author_name?: string[];
  first_publish_year?: number;
  cover_i?: number;
  subject?: string[];
  price?: number;
}

export interface OpenLibraryResponse {
  docs: Book[];
}