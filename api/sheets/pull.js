const authCheck = require(`../_lib/auth`);
const moment = require(`moment-timezone`);
const { google } = require('googleapis');
const fetch = require(`node-fetch`);

const {
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_REDIRECT_URL,
} = process.env

const handler = async (req, res) => {
  let data;
  try {
    const client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URL,
    )

    const access_token = req.headers[`access-token`]

    client.setCredentials({
      access_token,
    })

    // Create a new instance of the Google Sheets API client
    const sheets = google.sheets({ version: 'v4', auth: client });

    // Read data from the specified Google Sheets spreadsheet and sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: req.body.sheetId,
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
  const { sheetId } = req.body

  return handler(req, res)
}

