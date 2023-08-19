
const authCheck = require(`../_lib/auth`);
const moment = require(`moment-timezone`);
const { google } = require('googleapis');
const fetch = require(`node-fetch`);
const fs = require('fs');
const path = require('path');

const GOOGLE_APPLICATION_CREDENTIALS = 'google-secret.json';

const handler = async (req, res) => {
  let data;
  try {
    const auth = new google.auth.GoogleAuth({
      keyFile: path.join(__dirname, '..', '..', GOOGLE_APPLICATION_CREDENTIALS),
      scopes: 'https://www.googleapis.com/auth/spreadsheets',
    });

    const client = await auth.getClient();

    // Create a new instance of the Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Read data from the specified Google Sheets spreadsheet and sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: req.query.sheetId,
      range: 'A1:ZZ1000',
    });

    const rows = response.data.values;

    // Assuming the first row contains the column headers
    const headers = rows[0];


    // Loop through the rows and convert them into objects with keys as column names and values as row values
    data = rows.slice(1).map((row) => {
      const obj = {};
      headers.forEach((header, index) => {
        obj[toCapitalCase(header)] = row[index];
      });
      return obj;
    });
  } catch (e) {
    console.log(`failed to get data from Google Sheets`, e);
    return res.status(500).send();
  }

  return res.json(data);
};

const toCapitalCase = (str) => {
  const words = str.split(' ')

  const firstWord = words[0].toLowerCase()

  const otherWords = words.slice(1).map((word) => {
    return word[0].toUpperCase() + word.slice(1).toLowerCase()
  })

  return `${firstWord}${otherWords}`
}

module.exports = (req, res) => {
  return handler(req, res)
}
