#!/usr/bin/env python3
import json
from pathlib import Path
from typing import Iterator, Dict, Sequence

from .exporthelpers import dal_helper, logging_helper
from .exporthelpers.dal_helper import PathIsh, Json

logger = logging_helper.logger('google_docs')


class DAL:
    def __init__(self, sources: Sequence[PathIsh]) -> None:
        self.sources = [p if isinstance(p, Path) else Path(p) for p in sources]

    def rows(self, sheet_id: str) -> Iterator[Json]:
      possible_sources = [p for p in self.sources if sheet_id in p.name]


      source = sorted(possible_sources)[-1]

      if not source:
          raise ValueError(f"No source found for sheet_id: {sheet_id}")

      with source.open(mode="r") as f:
          jj = json.load(f)

      # By default, the events are already sorted by their 'id' in ascending order.
      for e in jj:
          yield e

def demo(dal: DAL):
    print("Your events:")
    from collections import Counter
    c = Counter(e['type'] for e in dal.events())
    from pprint import pprint
    pprint(c)


if __name__ == '__main__':
    dal_helper.main(DAL=DAL, demo=demo)

