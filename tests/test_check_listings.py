import importlib.util
import unittest
from pathlib import Path
from unittest.mock import patch

spec = importlib.util.spec_from_file_location('checker', Path(__file__).resolve().parents[1] / 'scripts/check_listings.py')
checker = importlib.util.module_from_spec(spec)
spec.loader.exec_module(checker)

class ListingChecks(unittest.TestCase):
    def test_partial_failure_is_not_confirmed(self):
        listing = {'url': 'https://example.org', 'verify': [{'find': ['free']}, {'url': 'https://example.org/hours', 'find': ['09:00']}]}
        with patch.object(checker, 'page_text', side_effect=[('free', None), (None, 'HTTP 503')]):
            self.assertEqual(checker.check(listing)['result'], 'unreachable')

    def test_complete_match_is_confirmed(self):
        with patch.object(checker, 'page_text', return_value=('free entry', None)):
            self.assertEqual(checker.check({'url': 'https://example.org', 'verify': [{'find': ['free']}]})['result'], 'ok')

    def test_missing_fact_is_flagged(self):
        with patch.object(checker, 'page_text', return_value=('paid entry', None)):
            self.assertEqual(checker.check({'url': 'https://example.org', 'verify': [{'find': ['free']}]})['result'], 'changed')
