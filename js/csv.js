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

    const rows = text.trim().split(/\r?\n/);

    if (rows.length < 2) {

        throw new Error("CSV file is empty.");

    }

    const headers = rows.shift().split(delimiter);

    const data = [];

    rows.forEach((row) => {

        if (!row.trim()) return;

        const values = row.split(delimiter);

        data.push({

            date: values[0]?.trim(),

            open: Number(values[1]),

            high: Number(values[2]),

            low: Number(values[3]),

            close: Number(values[4]),

            volume: Number(values[5] ?? 0)

        });

    });

    return data;

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
