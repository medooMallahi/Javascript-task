class Solution {

  applyUpdate(obj, update) {
    this.changeArrayObjectHelper(obj, update);
}

changeArrayObjectHelper = (obj, update) => {
  for (const key in update) {
    const path = key.split('.');
    const value = update[key]; 
    
    
    let currentObj = obj;
    for (let i = 0; i < path.length; i++) {
      const segment = path[i];

      if (this.hasPattern(segment) && !path[i + 1]){ 
        const { key, value: idKey } = this.extractKeyAndValue(segment);

        if (!currentObj[key]) {
          currentObj[key] = [];
        }

        if(idKey === null){
          currentObj = currentObj[key];
          currentObj.push(value);
          break
        }
        
        if(value === null){
          currentObj = currentObj[key];
          let index = currentObj.findIndex(obj => obj["_id"] === idKey);
          if (index !== -1) {
            currentObj.splice(index, 1);
          }
          return obj;
        }
       
        currentObj = currentObj[key];
        for (let i = 0; i < currentObj.length; i++) {
          if(currentObj[i]["_id"] === idKey){
            const { name, ...rest } = currentObj[i];
            const title = value.title;
            currentObj[i] = { ...rest, title }
            break
          }
        }
      } else if (this.hasPattern(segment) && path[i + 1]){
        const { key, value: idKey } = this.extractKeyAndValue(segment);
        currentObj = currentObj[key];
        for (let i = 0; i < currentObj.length; i++) {
          if(currentObj[i]["_id"] === idKey){
            currentObj[i].titleValue = value;
            break
           
          }
        }
      }
      else { 
        if (!currentObj[segment]) {
          currentObj[segment] = {};
        }

        if (i === path.length - 1) {
          if (value === null || value === undefined) {
            delete currentObj[segment];
          } else {
            currentObj[segment] = value;
          }
        } else {
          currentObj = currentObj[segment];
        }
      }
      
    } 
    
  } 
}

hasPattern = (str) => {
  const pattern = /^[a-zA-Z]+\[[^\]]*\]$/;
  return pattern.test(str);
}

extractKeyAndValue = (str) => {
  const pattern = /^(.*?)\[(.*?)\]$/;
  const match = str.match(pattern);

  if (match) {
    const key = match[1]; // Extract the captured key
    const value = match[2] || null; // Extract the captured value (or set it to null if it's not present)
    return { key, value };
  } else {
    return null;
  }
} 

getValueAtPath = (obj, path) => {
  const properties = path.split('.');
  let currentObj = obj;

  for (let i = 0; i < properties.length; i++) {
    if (typeof currentObj[properties[i]] === 'undefined') {
      return undefined;
    }

    currentObj = currentObj[properties[i]];
  }

  return currentObj;
}


 }
  

  
module.exports = Solution;