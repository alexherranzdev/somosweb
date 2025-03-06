import { apiFetch } from "./fetchClient";
import type { Project, Category } from "./types";

const BASE_IMAGE_URL = "https://somosexperiences.com/static/image/";
const PROJECTS_CATEGORY_ID = 1;

const mapProject = (item: any): Project => ({
  id: item.id,
  title: item.description?.title || "Untitled",
  description: item.description?.fulldescription || "",
  shortDescription: item.description?.short_description || "",
  image: `${BASE_IMAGE_URL}${item.image || "default.png"}`,
  link: item.metas?.description?.slug || "#",
  tags: ["Branding", "Interaction Design", "Website"],
  data: [
    {
      title: "10M",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "120+",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "8M",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "535$",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    },
    {
      title: "436+",
      description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor."
    }
  ]
});

export const getProject = async (slug: string): Promise<Project | null> => {
  try {
    const { items } = await apiFetch(`/articles/all?filter_id=${slug}&limit=1`);
    const item = items[0];
    return mapProject(item);
  } catch (error) {
    console.error(`Error fetching project: ${slug}`, error);
    return null;
  }
};

export const getProjects = async (): Promise<Project[]> => {
  try {
    const { items } = await apiFetch(`/articles/all?category_id=${PROJECTS_CATEGORY_ID}&limit=5`);
    return items.map(mapProject);
  } catch (error) {
    console.error("Error fetching projects", error);
    return [];
  }
};

const mapCategory = (item: any): Category => ({
  id: item.id,
  title: item.title || "Untitled",
  key: item.key,
});

export const getCategories = async (): Promise<Category[]> => {
  try {
    const { items } = await apiFetch(`/article_category/all?filter_parent_id=${PROJECTS_CATEGORY_ID}`);
    return items.map(mapCategory)
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};