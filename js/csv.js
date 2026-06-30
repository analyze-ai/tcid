/* ==========================================
   Analyze-AI
   CSV Engine
   Version : v0.2.0
========================================== */

/* ==========================================
   GLOBAL DATA
========================================== */

let marketData = [];

/* ==========================================
   READ CSV FILE
========================================== */

function readCSV(file) {

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = function (event) {

            try {

                const csvText = event.target.result;

                marketData = parseCSV(csvText);

                resolve(marketData);

            } catch (error) {

                reject(error);

            }

        };

        reader.onerror = () => reject("Failed to read CSV file.");

        reader.readAsText(file);

    });

}

/* ==========================================
   DETECT DELIMITER
========================================== */

function detectDelimiter(text) {

    const firstLine = text.split(/\r?\n/)[0];

    if (firstLine.includes(";")) {

        return ";";

    }

    return ",";

}

/* ==========================================
   PARSE CSV
========================================== */

function parseCSV(text) {

    const delimiter = detectDelimiter(text);

    const rows = text
        .trim()
        .split(/\r?\n/)
        .filter(row => row.trim() !== "");

    if (rows.length < 2) {
        throw new Error("CSV contains no data.");
    }

    const headers = rows.shift()
        .split(delimiter)
        .map(h => h.trim().toLowerCase());

    const columns = detectColumns(headers);

    const data = [];

    rows.forEach(row => {

        const values = row.split(delimiter);

        const candle = normalizeRow(values, columns);

        if (candle) {
            data.push(candle);
        }

    });

    return validateData(data);

}

function detectColumns(headers){

    const find = (...names)=>{

        return headers.findIndex(h=>names.includes(h));

    };

    return{

        date:find(
            "date",
            "datetime",
            "timestamp",
            "time"
        ),

        open:find(
            "open",
            "o"
        ),

        high:find(
            "high",
            "h"
        ),

        low:find(
            "low",
            "l"
        ),

        close:find(
            "close",
            "c"
        ),

        volume:find(
            "volume",
            "tick volume",
            "vol",
            "v"
        )

    };

}

function normalizeRow(values, columns){

    if(
        columns.open===-1||
        columns.high===-1||
        columns.low===-1||
        columns.close===-1
    ){

        return null;

    }

    return{

        date:
            columns.date>=0
                ? values[columns.date].trim()
                : "",

        open:Number(values[columns.open]),

        high:Number(values[columns.high]),

        low:Number(values[columns.low]),

        close:Number(values[columns.close]),

        volume:
            columns.volume>=0
                ? Number(values[columns.volume])
                : 0

    };

}

function validateData(data){

    return data.filter(candle=>{

        return(

            !isNaN(candle.open)&&
            !isNaN(candle.high)&&
            !isNaN(candle.low)&&
            !isNaN(candle.close)

        );

    });

}



/* ==========================================
   MARKET INFO
========================================== */

function getMarketInfo() {

    if (marketData.length === 0) return null;

    return {

        candles: marketData.length,

        startDate: marketData[0].date,

        endDate: marketData[marketData.length - 1].date,

        lastPrice: marketData[marketData.length - 1].close,

        volume: marketData[marketData.length - 1].volume

    };

}

/* ==========================================
   GET DATA
========================================== */

function getMarketData() {

    return marketData;

}
