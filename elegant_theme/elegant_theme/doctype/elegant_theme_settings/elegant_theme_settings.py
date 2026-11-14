import frappe
from frappe import _
from frappe.model.document import Document

from elegant_theme.api import clear_theme_cache
from elegant_theme.colors import FONTS, normalize_hex


class ElegantThemeSettings(Document):
	def validate(self):
		if self.accent_color and not normalize_hex(self.accent_color):
			frappe.throw(_("Accent Color must be a hex color such as #0F766E."))
		if self.font_family and self.font_family not in FONTS:
			frappe.throw(_("Font must be Inter or System."))

	def on_update(self):
		clear_theme_cache()
		frappe.clear_cache()
