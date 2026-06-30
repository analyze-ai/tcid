/* ==========================================
   Analyze-AI
   CSV Engine
   Version : v1.0.0
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

        reader.onload = (event) => {

            try {

                const csvText = event.target.result;

                marketData = parseCSV(csvText);

                resolve(marketData);

            } catch (error) {

                reject(error);

            }

        };

        reader.onerror = () => {

            reject(new Error("Failed to read CSV file."));

        };

        reader.readAsText(file, "UTF-8");

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

    validateColumns(columns);

    const data = [];

    rows.forEach((row, index) => {

        const values = row.split(delimiter);

        if (values.length < headers.length) {

            console.warn(`Skipping invalid row ${index + 2}`);

            return;

        }

        const candle = normalizeRow(values, columns);

        if (candle) {

            data.push(candle);

        }

    });

    return validateData(data);

}

/* ==========================================
   DETECT COLUMN
========================================== */

function detectColumns(headers) {

    const find = (...names) =>
        headers.findIndex(h => names.includes(h));

    return {

        date: find(
            "date",
            "datetime",
            "timestamp"
        ),

        time: find(
            "time"
        ),

        open: find(
            "open",
            "o"
        ),

        high: find(
            "high",
            "h"
        ),

        low: find(
            "low",
            "l"
        ),

        close: find(
            "close",
            "c"
        ),

        volume: find(
            "volume",
            "tick volume",
            "vol",
            "v"
        )

    };

}

/* ==========================================
   VALIDATE COLUMN
========================================== */

function validateColumns(columns) {

    const required = [

        "open",
        "high",
        "low",
        "close"

    ];

    required.forEach(column => {

        if (columns[column] === -1) {

            throw new Error(`Missing required column: ${column}`);

        }

    });

}

/* ==========================================
   NORMALIZE ROW
========================================== */

function normalizeRow(values, columns) {

    const get = (index) => {

        if (index < 0) return "";

        return values[index].trim();

    };

    let date = "";

    if (columns.date >= 0) {

        date = get(columns.date);

    }

    if (columns.time >= 0) {

        date += " " + get(columns.time);

    }

    return {

        date: date.trim(),

        open: Number(get(columns.open)),

        high: Number(get(columns.high)),

        low: Number(get(columns.low)),

        close: Number(get(columns.close)),

        volume: columns.volume >= 0
            ? Number(get(columns.volume))
            : 0

    };

}

/* ==========================================
   VALIDATE DATA
========================================== */

function validateData(data) {

    return data.filter(candle => {

        if (

            isNaN(candle.open) ||
            isNaN(candle.high) ||
            isNaN(candle.low) ||
            isNaN(candle.close)

        ) {

            return false;

        }

        if (candle.high < candle.low) {

            return false;

        }

        if (candle.high < candle.open) {

            return false;

        }

        if (candle.high < candle.close) {

            return false;

        }

        if (candle.low > candle.open) {

            return false;

        }

        if (candle.low > candle.close) {

            return false;

        }

        return true;

    });

}

/* ==========================================
   MARKET INFORMATION
========================================== */

function getMarketInfo() {

    if (marketData.length === 0) {

        return null;

    }

    const first = marketData[0];
    const last = marketData[marketData.length - 1];

    return {

        candles: marketData.length,

        startDate: first.date,

        endDate: last.date,

        lastPrice: last.close,

        volume: last.volume

    };

}

/* ==========================================
   GET MARKET DATA
========================================== */

function getMarketData() {

    return [...marketData];

}

/* ==========================================
   CLEAR DATA
========================================== */

function clearMarketData() {

    marketData = [];

}
