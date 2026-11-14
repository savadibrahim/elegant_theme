import unittest

from elegant_theme.colors import DEFAULT_ACCENT, DEFAULT_FONT, public_settings


class TestPublicSettings(unittest.TestCase):
	def test_defaults(self):
		self.assertEqual(
			public_settings(None, None),
			{"accent_color": DEFAULT_ACCENT, "font_family": DEFAULT_FONT},
		)

	def test_short_hex_and_unknown_font(self):
		self.assertEqual(
			public_settings("#0f7", "Comic Sans"),
			{"accent_color": "#00FF77", "font_family": DEFAULT_FONT},
		)

	def test_rejects_non_hex(self):
		self.assertEqual(public_settings("teal", "Inter")["accent_color"], DEFAULT_ACCENT)


if __name__ == "__main__":
	unittest.main()
