import { SIDEBAR_ITEMS } from "@/constants/sidebar.constants"

type NavItem = {
  title: string
  url: string
  icon?: React.ComponentType<any>
  items?: NavItem[]
}

export const findPathInArray = (
  items: NavItem[],
  pathname: string,
  parents: NavItem[] = []
): NavItem[] | null => {
  for (const item of items) {
    const currentPath = [...parents, item]

    if (item.url === pathname) {
      return currentPath
    }

    if (item.items) {
      const childPath = findPathInArray(item.items, pathname, currentPath)
      if (childPath) return childPath
    }
  }
  return null
}

export const findPathInSidebar = (
  sidebar: typeof SIDEBAR_ITEMS,
  pathname: string
): NavItem[] | null =>{
  for (const sectionItems of Object.values(sidebar)) {
    const path = findPathInArray(sectionItems as NavItem[], pathname)
    if (path) return path
  }
  return null
}