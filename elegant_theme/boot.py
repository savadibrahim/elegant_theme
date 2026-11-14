import frappe

from elegant_theme.api import get_theme_settings


def boot_session(bootinfo):
	"""Expose the public accent and font to the desk. Never fail desk boot."""
	try:
		bootinfo.elegant_theme = get_theme_settings()
	except Exception:
		frappe.log_error(title="Elegant Theme boot")
		bootinfo.elegant_theme = {
			"accent_color": "#0F766E",
			"font_family": "Inter",
		}
