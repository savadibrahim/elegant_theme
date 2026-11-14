/** Pure helpers for the accent token. The stylesheet reads the CSS variables this sets. */

export const DEFAULT_ACCENT = "#0f766e";
export const DEFAULT_FONT = "Inter";

export const FONT_STACKS = {
	Inter: '"InterVariable", "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
	System:
		'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
};

const INK = "#062326";

export function normalizeHex(value) {
	if (typeof value !== "string") return null;
	const color = value.trim();
	if (/^#[0-9a-fA-F]{6}$/.test(color)) return color.toLowerCase();
	if (/^#[0-9a-fA-F]{3}$/.test(color)) {
		return (
			"#" +
			color
				.slice(1)
				.split("")
				.map((ch) => ch + ch)
				.join("")
				.toLowerCase()
		);
	}
	return null;
}

export function rgbChannels(hex) {
	const color = normalizeHex(hex);
	if (!color) return null;
	return [
		parseInt(color.slice(1, 3), 16),
		parseInt(color.slice(3, 5), 16),
		parseInt(color.slice(5, 7), 16),
	];
}

function channelToLinear(channel) {
	const value = channel / 255;
	return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

export function relativeLuminance(hex) {
	const channels = rgbChannels(hex);
	if (!channels) return 0;
	const [r, g, b] = channels.map(channelToLinear);
	return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
	const lighter = Math.max(relativeLuminance(foreground), relativeLuminance(background));
	const darker = Math.min(relativeLuminance(foreground), relativeLuminance(background));
	return (lighter + 0.05) / (darker + 0.05);
}

export function mix(hex, other, weight) {
	const from = rgbChannels(hex);
	const to = rgbChannels(other);
	if (!from || !to) return normalizeHex(hex) || DEFAULT_ACCENT;
	const amount = Math.min(1, Math.max(0, weight));
	const channels = from.map((channel, index) =>
		Math.round(channel + (to[index] - channel) * amount)
	);
	return (
		"#" +
		channels
			.map((channel) => channel.toString(16).padStart(2, "0"))
			.join("")
	);
}

/** White when it clears WCAG AA on the accent, otherwise the dark sidebar ink. */
export function onAccent(accent) {
	const color = normalizeHex(accent) || DEFAULT_ACCENT;
	const onWhite = contrastRatio("#ffffff", color);
	const onInk = contrastRatio(INK, color);
	if (onWhite >= 4.5) return "#ffffff";
	if (onInk >= 4.5) return INK;
	return onWhite >= onInk ? "#ffffff" : INK;
}

export function themeVariables(settings = {}) {
	const accent = normalizeHex(settings.accent_color) || DEFAULT_ACCENT;
	const fontName = FONT_STACKS[settings.font_family] ? settings.font_family : DEFAULT_FONT;
	const channels = rgbChannels(accent);
	const label = onAccent(accent);

	return {
		"--et-accent": accent,
		"--et-accent-hover": mix(accent, "#042f2e", 0.22),
		"--et-accent-active": mix(accent, "#042f2e", 0.4),
		"--et-on-accent": label,
		"--et-accent-soft": mix(accent, "#ffffff", 0.9),
		"--et-accent-muted": mix(accent, "#ffffff", 0.62),
		"--et-accent-text": contrastRatio(accent, "#ffffff") >= 4.5 ? accent : mix(accent, "#042f2e", 0.35),
		"--et-accent-rgb": channels.join(", "),
		"--et-focus-ring": `0 0 0 3px rgba(${channels.join(", ")}, 0.35)`,
		"--et-font": FONT_STACKS[fontName],
		"--font-stack": FONT_STACKS[fontName],
	};
}

export function applyThemeSettings(settings, root = globalThis.document?.documentElement) {
	if (!root?.style) return themeVariables(settings);
	const variables = themeVariables(settings);
	for (const [name, value] of Object.entries(variables)) {
		root.style.setProperty(name, value);
	}
	return variables;
}
