#!/usr/bin/env python3
import argparse
import json
from typing import NamedTuple, List, Any

from .exporthelpers.export_helper import Json

import requests

# Not currently... great. TODO change this to be local-first rather than rely on API
google_sheets_route = 'https://google-docs-pearl.vercel.app/api/sheets/pull'
class Exporter:
    def __init__(self, *args, **kwargs) -> None:
        self.access_token = kwargs.get("access_token")
        self.sheet_id = kwargs.get("sheet_id")

    def get_google_sheets_data(self):
        headers = {
            "access-token": self.access_token,
        }

        response = requests.post(google_sheets_route, headers=headers, json={"sheetId": self.sheet_id})

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

def get_json(**params) -> Json:
    return Exporter(**params).export_json()

def main() -> None:
    parser = make_parser()
    args = parser.parse_args()

    params = args.params
    dumper = args.dumper

    j = get_json(**params)
    js = json.dumps(j, ensure_ascii=False, indent=1)
    dumper(js)


def make_parser():
    from .exporthelpers.export_helper import setup_parser, Parser
    parser = Parser('''
      Export your Google Docs data
    '''.strip())

    setup_parser(
        parser=parser,
        params=['access_token', 'sheet_id'],
        extra_usage='',
    )
    return parser



if __name__ == '__main__':
    main()
