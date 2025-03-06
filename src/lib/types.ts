export interface ArticleData {
  title: string;
  description: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  link: string;
  tags: string[];
  data: ArticleData[];
}

export interface Category {
  id: number;
  title: string;
  key: string;
}