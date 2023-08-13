#!/usr/bin/env python3
import json
from pathlib import Path
from typing import Iterator, Dict

from .exporthelpers import dal_helper, logging_helper
from .exporthelpers.dal_helper import PathIsh, Json

logger = logging_helper.logger('google_docs_export')


class DAL:
    def __init__(self, sources: Sequence[PathIsh]) -> None:
        self.sources = [p if isinstance(p, Path) else Path(p) for p in sources]

    def rows(self, sheet_id: str) -> Iterator[Json]:
      source = next((p for p in self.sources if p.name.endswith(f"{sheet_id}.json")), None)

      if not source:
          raise ValueError(f"No source found for sheet_id: {sheet_id}")

      with source.open(mode="r") as f:
          jj = json.load(f)

      if 'rows' in jj:
          jj = jj['rows']

      # By default, the events are already sorted by their 'id' in ascending order.
      for e in jj:
          yield e

if __name__ == '__main__':
    dal_helper.main(DAL=DAL, demo=demo)

