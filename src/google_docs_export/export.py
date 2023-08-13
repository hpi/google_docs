#!/usr/bin/env python3
import argparse
import json
from typing import NamedTuple, List, Any

import requests

# Not currently... great. TODO change this to be local-first rather than rely on API
google_docs_sheets_route = ''
class Exporter:
    def __init__(self, access_token, sheet_id) -> None:
        self.access_token = access_token
        self.sheet_id = sheet_id

    def get_google_sheets_data(self):
        headers = {
            "access-token": self.access_token,
        }

        response = requests.post(google_docs_api, headers=headers, json={"sheetId": self.sheet_id})

        if response.status_code == 200:
            return response.json()
        else:
            raise Exception("Failed to get data from Google Sheets API.")

    def export_json(self) -> Any:
        # Get data from Google Sheets using the provided access token and sheet ID
        data_from_google_sheets = self.get_google_sheets_data()

        # Modify this section to process the data_from_google_sheets and convert it to the desired format
        # Assuming the data_from_google_sheets is already in the desired JSON format
        # Replace the following line with your data processing logic:
        processed_data = data_from_google_sheets

        # Return the processed data
        return processed_data


def get_json(access_token, sheet_id):
    return Exporter(access_token, sheet_id).export_json()


def main():
    parser = make_parser()
    args = parser.parse_args()

    access_token = args.access_token
    sheet_id = args.sheet_id

    j = get_json(access_token, sheet_id)
    js = json.dumps(j, ensure_ascii=False, indent=1)

    output_filename = f"{sheet_id}.json"

    # Save the JSON data to a file (e.g., data.json)
    with open(output_filename, "w") as f:
        f.write(js)


def make_parser():
    parser = argparse.ArgumentParser(description='Export data from Google Sheets and store it in a JSON file.')
    parser.add_argument('--access-token', type=str, required=True, help='Google Sheets API access token')
    parser.add_argument('--sheet-id', type=str, required=True, help='ID of the Google Sheets spreadsheet')
    return parser


if __name__ == '__main__':
    main()

