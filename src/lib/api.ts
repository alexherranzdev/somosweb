import { apiFetch } from "./fetchClient";
import type { Project, Category, CriteriaBuilder, Award } from "./types";

const BASE_IMAGE_URL = import.meta.env.BASE_IMAGE_URL;
const PROJECTS_CATEGORY_ID = 1;
const TTL = 1200;
const projectsCache = new Map();
const categoriesCache = new Map();

export const mapProject = (item: any): Project => ({
  id: item.id,
  title: item.description?.title || "Untitled",
  description: item.description?.fulldescription || "",
  shortDescription: item.description?.short_description || "",
  image: item.image_url || `${BASE_IMAGE_URL}${item.image || "default.png"}`,
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

export const getProject = async (id: number): Promise<Project | null> => {
  try {
    const { items } = await apiFetch(`/articles/all?filter_id=${id}&limit=1`);
    const item = items[0];
    return mapProject(item);
  } catch (error) {
    console.error(`Error fetching project: ${id}`, error);
    return null;
  }
};

const getCachedDataIfAvailableOrNull = (cache: Map<string, any>, key: string, ttl: number = 1200) => {
  if (!cache.has(key)) {
    return null;
  }

  let now = Date.now();
  const { timestamp, data } = cache.get(key);
  if (now - timestamp > ttl * 1000) {
    cache.delete(key);
    return null;
  }

  return data;
}

export const getProjects = async (criteria: CriteriaBuilder): Promise<Project[]> => {
  try {
    let url = '/articles/all'
    const params = []
    params.push(`category_id=${PROJECTS_CATEGORY_ID}`)
    params.push(`filter_status=1`)
    params.push(`limit=${criteria.pageSize}`)
    params.push(`page=${criteria.pageNumber}`)
    params.push(`sort=${criteria.orderBy}`)
    params.push(`order=${criteria.order}`)

    if (params.length > 0) {
      url += `?${params.join('&')}`
    }

    const key = btoa(url);
    const data = getCachedDataIfAvailableOrNull(projectsCache, key, TTL);
    if (data !== null) {
      return data;
    }

    const { items } = await apiFetch(url);
    const itemsMap = items.map(mapProject);
    projectsCache.set(key, { timestamp: Date.now(), data: itemsMap });
    return itemsMap;
  } catch (error) {
    console.error("Error fetching projects", error);
    return [];
  }
};

export const mapCategory = (item: any): Category => ({
  id: item.id,
  title: item.title || "Untitled",
  key: item.key,
});

export const getCategories = async (): Promise<Category[]> => {
  try {
    const url = `/article_category/all?filter_parent_id=${PROJECTS_CATEGORY_ID}`
    const key = btoa(url)
    const data = getCachedDataIfAvailableOrNull(categoriesCache, key, TTL);
    if (data !== null) {
      return data;
    }

    const { items } = await apiFetch(url);
    const categoriesMap = items.map(mapCategory)
    categoriesCache.set(key, { timestamp: Date.now(), data: categoriesMap });
    return categoriesMap;
  } catch (error) {
    console.error("Error fetching categories", error);
    return [];
  }
};

export const getAwards = async (): Promise<Award[]> => {
  try {
    const response = await fetch('http://localhost:4321/api/awards')
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error fetching awards", error);
    return [];
  }
}
    


