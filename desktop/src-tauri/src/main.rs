// Desktop wrapper around baaki.html.
//
// The HTML is the product; this only adds the three things a browser tab
// cannot do: float above other windows, start with the machine, and come
// back where you left it.
//
// Nothing here changes the page. The small drag strip and its two buttons
// are injected from this side, so baaki.html stays a single portable
// file that behaves identically in a browser.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_autostart::MacosLauncher;

// Desktop-only chrome: a hover-revealed strip to drag the window by,
// a pin toggle for always-on-top, and a close button.
const CHROME: &str = r#"
window.addEventListener('DOMContentLoaded', function () {
  var css = document.createElement('style');
  css.textContent = [
    'html,body{user-select:none;-webkit-user-select:none}',
    '#deskbar{position:fixed;top:0;left:0;right:0;height:30px;z-index:60;',
      '-webkit-app-region:drag;app-region:drag;display:flex;justify-content:flex-end;',
      'align-items:center;gap:2px;padding:0 6px;opacity:0;transition:opacity .25s}',
    'body:hover #deskbar{opacity:1}',
    '#deskbar button{-webkit-app-region:no-drag;app-region:no-drag;background:none;',
      'border:0;color:var(--dim);cursor:pointer;font:500 12px/1 inherit;padding:5px 7px;',
      'border-radius:7px}',
    '#deskbar button:hover{background:var(--panel2);color:var(--ink)}',
    '#deskbar button.on{color:var(--ink)}',
    '#bar{padding-bottom:14px}'
  ].join('');
  document.head.appendChild(css);

  var bar = document.createElement('div');
  bar.id = 'deskbar';
  bar.setAttribute('data-tauri-drag-region', '');   // Tauri's own drag, works on all three
  bar.innerHTML = '<button id="dPin" class="on" title="Always on top">◉</button>' +
                  '<button id="dClose" title="Close">✕</button>';
  document.body.appendChild(bar);

  var w = window.__TAURI__.window.getCurrentWindow();
  var pinned = true;
  document.getElementById('dPin').onclick = function () {
    pinned = !pinned;
    w.setAlwaysOnTop(pinned);
    this.classList.toggle('on', pinned);
    this.title = pinned ? 'Always on top' : 'Behaves like a normal window';
  };
  document.getElementById('dClose').onclick = function () { w.close(); };
});
"#;

fn main() {
    tauri::Builder::default()
        // remembers size and position between runs
        .plugin(tauri_plugin_window_state::Builder::default().build())
        // starts with the machine
        .plugin(tauri_plugin_autostart::init(
            MacosLauncher::LaunchAgent,
            None,
        ))
        .setup(|app| {
            use tauri_plugin_autostart::ManagerExt;
            let _ = app.autolaunch().enable();

            WebviewWindowBuilder::new(app, "main", WebviewUrl::App("index.html".into()))
                .title("Baaki")
                .inner_size(400.0, 250.0)
                .min_inner_size(240.0, 150.0)
                .always_on_top(true)
                .decorations(false)
                .resizable(true)
                .shadow(true)
                .initialization_script(CHROME)
                .build()?;

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("failed to start Baaki");
}
