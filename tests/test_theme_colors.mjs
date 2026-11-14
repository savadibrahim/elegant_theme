import assert from "node:assert/strict";
import {
	DEFAULT_ACCENT,
	contrastRatio,
	onAccent,
	themeVariables,
} from "../elegant_theme/public/js/theme_colors.js";

const sidebar = "#0c1c20";
const sidebarText = "#f3fbfa";
const sidebarMuted = "#b7d4d0";
const page = "#ffffff";

const defaults = themeVariables({});

assert.equal(defaults["--et-accent"], DEFAULT_ACCENT);
assert.equal(defaults["--et-on-accent"], "#ffffff");
assert.ok(
	contrastRatio(defaults["--et-on-accent"], defaults["--et-accent"]) >= 4.5,
	"default accent must keep white button text at WCAG AA"
);
assert.ok(contrastRatio(sidebarText, sidebar) >= 4.5, "sidebar text contrast");
assert.ok(contrastRatio(sidebarMuted, sidebar) >= 4.5, "sidebar muted text contrast");
assert.ok(contrastRatio(defaults["--et-accent-text"], page) >= 4.5, "link text on white");
assert.ok(
	contrastRatio(defaults["--et-accent-muted"], sidebar) >= 4.5,
	"active sidebar label on the dark sidebar"
);

const pale = themeVariables({ accent_color: "#E6FFFB" });
assert.equal(pale["--et-on-accent"], "#062326");
assert.ok(contrastRatio(pale["--et-on-accent"], pale["--et-accent"]) >= 4.5);

const custom = themeVariables({ accent_color: "#0E7490", font_family: "System" });
assert.equal(custom["--et-accent"], "#0e7490");
assert.match(custom["--font-stack"], /^ui-sans-serif/);
assert.equal(themeVariables({ accent_color: "nope" })["--et-accent"], DEFAULT_ACCENT);

console.log("theme color contrast checks passed");
