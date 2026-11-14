"""Accent and font values shared by the settings DocType and the public API.

The browser computes hover, active, and on-accent shades from the accent so a
System Manager can change one color. This module only accepts a safe hex color
and a known font name.
"""

import re

DEFAULT_ACCENT = "#0F766E"
DEFAULT_FONT = "Inter"
FONTS = ("Inter", "System")

_HEX = re.compile(r"^#(?:[0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$")


def normalize_hex(value):
	if not value or not isinstance(value, str):
		return None
	color = value.strip()
	if not _HEX.fullmatch(color):
		return None
	if len(color) == 4:
		color = "#" + "".join(ch * 2 for ch in color[1:])
	return color.upper()


def normalize_font(value):
	if value in FONTS:
		return value
	return DEFAULT_FONT


def public_settings(accent, font):
	return {
		"accent_color": normalize_hex(accent) or DEFAULT_ACCENT,
		"font_family": normalize_font(font),
	}
