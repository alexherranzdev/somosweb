const domain = import.meta.env.API_URL

export const getProjects = async () => {
  const projectsCategory = 1
  const data: any[] = []
  
  try {
    const response = await fetch(`${domain}/articles/all?category_id=${projectsCategory}&limit=5`,
      {
        signal: AbortSignal.timeout(3000),
        mode: 'no-cors',
        redirect: 'error',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + import.meta.env.API_TOKEN
        }
      }
    )
    if (!response.ok) {
      throw new Error('Failed to fetch projects')
    }

    const { items } = await response.json()
    
    items.forEach((item: any) => {
      data.push({
        title: item.description.title,
        description: item.description.fulldescription,
        shortDescription: item.description.short_description,
        image: `https://somosexperiences.com/static/image/${item.image}`,
        link: item.metas.description.slug,
        tags: ["Branding", "Interaction Design", "Website"]
      })
    })
  } catch (error) {
    // console.error(error)
  }

  return data
}