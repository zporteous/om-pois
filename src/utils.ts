import { NestedObject } from "./types";
import "@esri/calcite-components";
/** 
 * functions
 */

export function createTrees(obj: NestedObject, trunk:HTMLElement): void {
  // get the value (text to input), and create this levels tree-item
  if (obj == undefined) {
    return 
  } else{
    // current level of iteration
    let i =0;
    const currentLevels=Object.keys(obj)
    while (i<currentLevels.length) {
      const currentKey = currentLevels[i]
      const nextLevelTrunk = document.createElement("calcite-tree")
      nextLevelTrunk.slot="children"
      const currentLvlSubLevels=Object.keys(obj[currentKey])
      const currentLvlElm = document.createElement("calcite-tree-item")
      // append next level to current level item because we know it has values
      currentLvlElm.innerHTML=currentKey
      currentLvlElm.appendChild(nextLevelTrunk)
      trunk.appendChild(currentLvlElm)
      // if the value of the current key is an non-empty object, recursively call this function
      if (currentLvlSubLevels.length !== 0) {
        currentLvlSubLevels.forEach(key=>{
          // get key from original object
          // tree item that belongs to base tree
          const nextObj:NestedObject=obj[currentKey][key] as NestedObject
          createTrees(nextObj,nextLevelTrunk)
        })
      }
      i++;
    }
    
  }
  
}

export function createTreesFromObject(obj: NestedObject, elm:HTMLElement): void {
  // create root
  const trunk = document.createElement("calcite-tree")
  // function that creates a tree structure from the root structure recursively
  const start=Object.keys(obj)
  createTrees(obj,trunk)
  // Append the root div to the body or any other container element
  elm.appendChild(trunk);
}
  
