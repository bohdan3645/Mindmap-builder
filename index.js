const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const input = document.querySelector('#input');

input.value = `1
-11
-12
--21
---31
---32
-13
--231`

class Node {
    constructor(text, children = []) {
        this.text = text;
        this.children = children;
    }
}

class Destination {
    constructor(text, path) {
        this.text = text;
        this.path = path;
    }
}

const MindMap = {
    mindMap: null,


    insertDestination(dest) {
        // if empty insert first
        if(!this.mindMap) {
            this.mindMap = new Node(dest.text);
            return;
        };

        let currentDest = this.mindMap;
        let currentStep = 0;
        console.log(currentDest.children);

        dest.path.forEach((step) => {
            let exist = currentDest.children[step];
            console.log(exist)
            if(!exist) {
                currentDest.children.push(new Node(dest.text));
                
            }
            currentDest = currentDest.children[step];
        });

        // currentDest.children.push(new Node(dest.text));
        
        // dest.path.forEach(step => {
        //     console.log(currentDest.children);
        //     const nodeExist = currentDest.children.some(child => {
        //         return child.id === step.id;
        //     });
        //     if(!nodeExist) {
        //         currentDest.children.push(new Node(dest.text, dest.id));
        //     };
        //     currentDest = currentDest.children[step];
        // });

    },

    parseText(inputText) {
        const lines = inputText.split('\n');
        const linesArr = lines.map(line => {
            //get depth
            let depthCount = 0;
            let text = line;
            while(text[0] === '-') {
                text = text.split('').slice(1).join('');
                depthCount++;
            };
            return { 
                text: text, 
                depth: depthCount, 
                id: Date.now() + Math.random() 
            };
        });

        //find own parent
        const findOwnParent = (index) => {
            let parent;
            const linesArrCopy = [...linesArr];
            linesArrCopy.length = index + 1;

            const reversedLinesArrCopy = [...linesArrCopy];
            reversedLinesArrCopy.reverse();

            parent = reversedLinesArrCopy.find(line => {
                return line.depth === linesArrCopy[index].depth - 1;
            });

            return parent;
        };

        //find next parent
        const findNextParent = (index) => {
            let parent;
            parent = linesArr.find((line, i) => {
                return (i > index) && (line.depth < linesArr[index].depth);
            });

            return parent;
        };
        
        //find siblings
        const findSiblings = (index) => {
            let siblings;
            const ownParent = findOwnParent(index);
            const nextParent = findNextParent(index);
            const ownParentIndex = () => {
                if(!ownParent) { return 0 };
                return linesArr.findIndex(line => {
                    return line.id === ownParent.id;
                });
            };
            const nextParentIndex = () => {
                if(!nextParent) { return linesArr.length };
                return linesArr.findIndex(line => {
                    return line.id === nextParent.id;
                });    
            };

            siblings = linesArr.filter((line, i) => {
                return (i > ownParentIndex()) && (i < nextParentIndex()) && (line.depth === linesArr[index].depth);
            });

            return siblings;
        };


        //find path
        const findPath = (index) => {
            const path = [];
            let currentIndex = index;

            while(currentIndex) {
                const siblings = findSiblings(currentIndex);
                const stepIndex = siblings.findIndex(sibling => {
                    return sibling.id === linesArr[currentIndex].id;
                });
                path.push(stepIndex);
                const parent = findOwnParent(currentIndex);
                const parentIndex = linesArr.findIndex(line => {
                    return line.id === parent.id;
                });
                currentIndex = parentIndex;
            };

            return path;
        };

        const parsedText = linesArr.map((line, i) => {
            return { ...line, path: findPath(i) };
        });

        console.log(parsedText)
        return parsedText;
    },

    initMindMap(inputText) {
        const arr = this.parseText(inputText);
        arr.forEach(line => {
            this.insertDestination(line);
        });
        console.log(this.mindMap);
    }
}



input.addEventListener('change', e => {
    const value = e.target.value;
    MindMap.initMindMap(value);
});