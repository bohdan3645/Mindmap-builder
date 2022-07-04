const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const input = document.querySelector('#input');

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
    depth: 0,


    insertDestination(dest) {
        // if empty insert first
        if(!this.mindMap) {
            this.mindMap = new Node(dest.text);
            this.depth++;
            return;
        };

        let currentDest = this.mindMap;
        let currentDepth = 0;

        while(currentDepth < dest.depth) {
            current = currentDest.children;

            currentDepth++;
        };

        currentDest.children.push(new Node(dest.text));
        this.depth++;
    },

    parseText(inputText) {
        const lines = inputText.split('\n');
        const result = [];

        const getDestDepth = (line) => {
            let depth = 0
            let text = line;

            //calc depth
            while(text[0] === '-') {
                text = text.split('').slice(1).join('');
                depth++;
            };
            return depth;
        }

        const findParent = (currentLine, index) => {
            const linesAbove = JSON.parse(JSON.stringify(lines));
            linesAbove.length = index + 1;
            const reversed = linesAbove.reverse();

            const result = reversed.find(line => {
                return getDestDepth(line) === getDestDepth(currentLine) - 1;
            })
            return result;
        }

        console.log(findParent(lines[2], 2))

        lines.forEach((line, i) => {
            let found = 0;
            const res = [];
            do {
                found = findParent(line, i);
                if(found) {
                    res.push(found);
                }
            } while(found);

            result.push(res);
            console.log(res)
        });
        console.log(result);

        // const parsedLines = lines.map(line => {
        //     if(line[0] !== '-') {
        //         return new Destination(line, 0);
        //     };

        //     let depthCount = 0
        //     let indexCount = 0
        //     let text = line;

        //     //calc depth
        //     while(text[0] === '-') {
        //         text = text.split('').slice(1).join('');
        //         depthCount++;
        //     };

        //     //calc index
        //     depthTrack.forEach(depth => {
        //         if(depth === depthCount) {
        //             indexCount++;
        //         };
        //     });
        //     depthTrack.push(depthCount);

        //     return new Destination(text, depthCount, indexCount);
        // });

        // return parsedLines;
    },

    initMindMap(inputText) {
        this.parseText(inputText);
        // const parsedLines = this.parseText(inputText);
        // parsedLines.forEach(dest => {
        //     this.insertDestination(dest);
        // })
        // console.log(this.mindMap);
    }
}



input.addEventListener('change', e => {
    const value = e.target.value;
    MindMap.initMindMap(value);
});