import { applyThemeSettings } from "./theme_colors.js";

function readBootSettings() {
	return window.frappe?.boot?.elegant_theme || null;
}

function apply(settings) {
	if (!settings) return;
	applyThemeSettings(settings);
}

function applyFromServer() {
	const boot = readBootSettings();
	if (boot) {
		apply(boot);
		return;
	}

	const onAuthPage = document.querySelector(
		".for-login, .for-signup, .for-forgot, .for-email-login, .for-login-with-email-link, .for-reset-password"
	);
	if (!onAuthPage) return;

	fetch("/api/method/elegant_theme.api.get_theme_settings", {
		credentials: "same-origin",
		headers: { Accept: "application/json" },
	})
		.then((response) => (response.ok ? response.json() : null))
		.then((payload) => apply(payload?.message))
		.catch(() => {});
}

function watchSettingsForm() {
	const formApi = window.frappe?.ui?.form;
	if (!formApi?.on) return;

	formApi.on("Elegant Theme Settings", {
		refresh(frm) {
			apply(frm.doc);
		},
		accent_color(frm) {
			apply(frm.doc);
		},
		font_family(frm) {
			apply(frm.doc);
		},
	});
}

applyFromServer();
watchSettingsForm();
