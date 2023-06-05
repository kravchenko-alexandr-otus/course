const fs = require('fs')
const mod_path = require('path')

const depth = 1000000

const DRAW_SYMBLOS = {
    EMPTY: '',
    INDENT: '    ',
    LAST_BRANCH: '|___',
    BRANCH: '|---',
    VERTICAL: '|    '
}

//Function for drawing filesystem tree structure
function picture(filename, path, currentDepth, precedingSymbols, isLast, depth){
    //Constants for function
    const isDirectory = fs.lstatSync(path).isDirectory()
    const isFile = !isDirectory
    const lines = []

    //Condition to end recursion
    if(currentDepth > depth){
        return lines
    }

    //Previous lines
    const line = [precedingSymbols]

    //Draw Last Branch
    if (currentDepth >= 1){
        line.push(isLast ? DRAW_SYMBLOS.LAST_BRANCH : DRAW_SYMBLOS.BRANCH)
    }

    line.push(filename)
    lines.push(line.join(''))


    if(isFile) return lines

    let dirContent = fs.readdirSync(path)

    dirContent.forEach((element, index) => {
        const isCurrentTheLast = index === dirContent.length - 1
        const linesForDir = picture(element, mod_path.join(path, element), currentDepth+1,
        precedingSymbols +(currentDepth >= 1 ? (isLast ? DRAW_SYMBLOS.INDENT : DRAW_SYMBLOS.VERTICAL) : DRAW_SYMBLOS.EMPTY),
        isCurrentTheLast, depth)
        lines.push.apply(lines,linesForDir)
    })
    return lines
}

function main_tree(path, depth){
    return picture(mod_path.basename(mod_path.join(process.cwd(), path)),
    path,
    0,
    '',
    true,
    depth
    ).join('\n')
}

console.log(main_tree('/home', 3))