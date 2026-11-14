app_name = "elegant_theme"
app_title = "Elegant Theme"
app_publisher = "savadibrahim"
app_description = "Dark sidebar and teal accents for the Frappe v16 and ERPNext v16 desk."
app_email = "savadibrahim@users.noreply.github.com"
app_license = "MIT"

required_apps = ["frappe"]

# Built by Frappe's esbuild pipeline from public/**/*.bundle.{scss,js}.
app_include_css = "elegant_theme.bundle.css"
app_include_js = "elegant_theme.bundle.js"

# Login and the website share the same bundle. Sidebar rules only match desk markup.
web_include_css = "elegant_theme.bundle.css"
web_include_js = "elegant_theme.bundle.js"

boot_session = "elegant_theme.boot.boot_session"
