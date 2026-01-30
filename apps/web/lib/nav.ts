import { SIDEBAR_ITEMS } from "@/constants/sidebar.constants"

type NavItem = {
  title: string
  url: string
  icon?: React.ComponentType<any>
  items?: NavItem[]
}

const normalizePathname = (value: string): string => {
  const withoutQueryOrHash = value.split("?")[0]?.split("#")[0] ?? ""
  if (!withoutQueryOrHash) return "/"
  if (withoutQueryOrHash.length > 1 && withoutQueryOrHash.endsWith("/")) {
    return withoutQueryOrHash.slice(0, -1)
  }
  return withoutQueryOrHash
}

const isRoutableUrl = (value: string): boolean => value.startsWith("/")

const matchesPathname = (itemUrl: string, pathname: string): boolean => {
  if (!isRoutableUrl(itemUrl)) return false

  const normalizedItemUrl = normalizePathname(itemUrl)
  const normalizedPathname = normalizePathname(pathname)

  if (normalizedPathname === normalizedItemUrl) return true
  return normalizedPathname.startsWith(`${normalizedItemUrl}/`)
}

const getMatchWeight = (itemUrl: string): number => normalizePathname(itemUrl).length

export const findPathInArray = (
  items: NavItem[],
  pathname: string,
  parents: NavItem[] = []
): NavItem[] | null => {
  let bestMatch: NavItem[] | null = null

  for (const item of items) {
    const currentPath = [...parents, item]

    if (matchesPathname(item.url, pathname)) {
      if (normalizePathname(item.url) === normalizePathname(pathname)) {
        return currentPath
      }

      if (
        !bestMatch ||
        getMatchWeight(item.url) > getMatchWeight(bestMatch.at(-1)?.url ?? "")
      ) {
        bestMatch = currentPath
      }
    }

    if (item.items) {
      const childPath = findPathInArray(item.items, pathname, currentPath)
      if (childPath) {
        if (
          !bestMatch ||
          getMatchWeight(childPath.at(-1)?.url ?? "") >
            getMatchWeight(bestMatch.at(-1)?.url ?? "")
        ) {
          bestMatch = childPath
        }
      }
    }
  }
  return bestMatch
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