
define([], function() {
    return {
        createTrees: function(obj, parentElement) {
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    const div = document.createElement('calcite-tree-item');
                    div.textContent = `${key}: ${obj[key]}`;
                    parentElement.appendChild(div);
                    if (typeof obj[key] === 'object' && obj[key] !== null) {
                        createDivs(obj[key], div);
                    }
                }
            }
        },
        renderCategories: (cats,parent) => {
            const trunk = document.createElement('calcite-tree');
            createTrees(cats,trunk)
            parent.appendChild(trunk);
        }
    };
});

