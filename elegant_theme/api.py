import frappe

from elegant_theme.colors import DEFAULT_ACCENT, DEFAULT_FONT, public_settings

CACHE_KEY = "elegant_theme_public_settings"


@frappe.whitelist(allow_guest=True)
def get_theme_settings():
	"""Accent and font only. Safe for the login page and for every desk user."""
	cached = frappe.cache.get_value(CACHE_KEY)
	if cached:
		return cached

	settings = _load_settings()
	frappe.cache.set_value(CACHE_KEY, settings)
	return settings


def clear_theme_cache():
	frappe.cache.delete_value(CACHE_KEY)


def _load_settings():
	if not frappe.db.exists("DocType", "Elegant Theme Settings"):
		return public_settings(None, None)

	accent = frappe.db.get_single_value("Elegant Theme Settings", "accent_color")
	font = frappe.db.get_single_value("Elegant Theme Settings", "font_family")
	return public_settings(accent, font)


def fallback_settings():
	return public_settings(DEFAULT_ACCENT, DEFAULT_FONT)
