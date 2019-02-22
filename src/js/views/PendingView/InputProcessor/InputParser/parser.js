/**
 *  Parses text file adhereing to standard pending list format.
 *  NOT guaranteed to work with any other format.
 */

// import { Specimen } from '../../models/Specimen'

let exp = {
    regex: {
        specID: /\d\d\d-\d\d\d-\d\d\d\d-\d/,
        res: />(.+\n*.*)(<.+$)?/,
        wks: /^\d\d\d\d(?!-|\d)/,
        specBreak: /(?=(?:N,* +)*\d\d\d-\d\d\d-\d\d\d\d-\d)/g,
        line: /.+\w\/\d+>?/,
        wksBreak: /.+WS #/,
    }
}

/**
 * 
 * @param {string} text Standard format pending list 
 */
const buildPending = (text) => {
    let wksList = splitWS(text);
    wksList.forEach((list) => {

        const wks = list[0].match(exp.regex.wks)[0];
        list.forEach((line) => {
            const specParams = parseLine(line);
            if (specParams) {
                addSpecs(wks, specParams, type);
            }
        });
    })

}

/** Splits raw text into WS's
 * Text => [ [wks], [wks], [wks] ]
 */
const splitWS = (text) => {
    text = text.split(exp.regex.wksBreak).slice(1)
    .map((ws) => 
         ws.split(exp.regex.specBreak)
        .map((line) => line.trim())
    )
    return text;
    };


const addSpecs = (wks, specParams, type) => {
    console.log(specParams);
    if (!(wks in pendings[type])) {
        pendings[type][wks] = [];
    }
    if (!pendings[type][wks].find((spec) => specParams[0] === spec.specID)) {
        pendings[type][wks].push(new Specimen(specParams.line, specParams.specID, specParams.jul, specParams.res , wks));
    }
}

/** Returns Specimen Parameters as [specID, jul, resolution, line] */
const parseLine = (line) => {
    if (!line.match(exp.regex.specID)) {
        return null;
    }

    const specID = line.match(exp.regex.specID)[0]
    .replace(/-/g, '');

    const jul = parseInt(specID.substring(0,3));
    let res = line.match(exp.regex.res);
    res = res ? res[1] : null;

    line = line.match(exp.regex.line) ? line.match(exp.regex.line) : line;

    return {specID: specID, jul: jul, res: res, line: line};
}

const clearPendings = () => {
    pendings.current = {};
    pendings.previous = {};
}

export default buildPending;