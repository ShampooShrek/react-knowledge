import { TreeType } from "@/models/category"

export const toTree = (filtredTree: TreeType[], data: TreeType[]): TreeType[] => {
  const getParent = (parentId: number | null, items: TreeType[]): TreeType | null => {
    if (!parentId) return null
    let parent: TreeType | null = null
    items.map(item => {
      if (item.id === parentId) {
        parent = { ...item }
        parent.parentNode = item.parentNode.filter(children => filtredTree.some(s => s!.id === children.id))
      } else if (item.parentNode.length > 0) {
        const getedParent = getParent(parentId, item.parentNode)
        if (getedParent) {
          parent = getedParent
          parent.parentNode = parent.parentNode.filter(children => filtredTree.some(s => s!.id === children.id))
        }
      }
    })
    return parent
  }

  const filtredToTree = filtredTree.filter(f => f.parentId !== null).map(t => {
    let parent: null | TreeType = getParent(t.parentId, data)!
    if (!parent) { return t }
    while (parent!.parentId !== null) {
      parent = getParent(parent!.parentId, data)
    }
    return parent
  }) as TreeType[]

  const aa = filtredToTree.filter((f, i) => filtredToTree.findIndex(j => j.id === f.id) === i)

  return aa
}

export const filterTree = (parents: TreeType[] | null, filter: string, data: TreeType[]) => {
  const treeMatching: TreeType[] = []

  const mathFilter = (tree: TreeType): boolean => tree.name.toLowerCase().replaceAll(" ", "")
    .includes(filter.toLowerCase().replaceAll(" ", ""))

  if (!parents) parents = data.filter(f => f.parentId === null)

  parents.forEach(node => {
    const childrensMatching: TreeType[] = []
    if (mathFilter(node)) {
      childrensMatching.push(node)
    }
    if (node.parentNode && node.parentNode.length > 0) {
      const matching = filterTree(node.parentNode, filter, data);
      if (matching && matching.length > 0) {
        childrensMatching.push(...matching)
      }
    }
    treeMatching.push(...childrensMatching)
  })
  return treeMatching
}
