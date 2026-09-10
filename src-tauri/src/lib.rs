use std::sync::Mutex;

use tauri::{Emitter, Manager};

const TRAY_ID: &str = "main";

/// Normal window geometry is retained while mini mode is active. It is restored before any
/// close/quit path so the window-state plugin never saves the 320×120 mini player as startup.
#[derive(Clone, Copy)]
struct Geometry {
    width: f64,
    height: f64,
    x: Option<f64>,
    y: Option<f64>,
    min_width: f64,
    min_height: f64,
}

#[derive(Default)]
struct WindowState(Mutex<Option<Geometry>>);

#[derive(serde::Serialize)]
struct TrayAction {
    action: String,
}

#[tauri::command]
#[allow(clippy::too_many_arguments)]
fn set_mini_geometry(
    state: tauri::State<WindowState>,
    active: bool,
    width: f64,
    height: f64,
    x: Option<f64>,
    y: Option<f64>,
    min_width: f64,
    min_height: f64,
) {
    *state.0.lock().unwrap() = active.then_some(Geometry {
        width,
        height,
        x,
        y,
        min_width,
        min_height,
    });
}

fn restore_normal_geometry(app: &tauri::AppHandle) {
    let geometry = app.state::<WindowState>().0.lock().unwrap().take();
    let (Some(g), Some(window)) = (geometry, app.get_webview_window("main")) else { return };
    let _ = window.set_resizable(true);
    let _ = window.set_always_on_top(false);
    let _ = window.set_min_size(Some(tauri::LogicalSize::new(g.min_width, g.min_height)));
    let _ = window.set_size(tauri::LogicalSize::new(g.width, g.height));
    if let (Some(x), Some(y)) = (g.x, g.y) {
        let _ = window.set_position(tauri::LogicalPosition::new(x, y));
    }
}

#[tauri::command]
fn exit_mini(app: tauri::AppHandle) {
    restore_normal_geometry(&app);
}

#[tauri::command]
fn quit_app(app: tauri::AppHandle) {
    restore_normal_geometry(&app);
    app.exit(0);
}

fn toggle_window(app: &tauri::AppHandle) {
    let Some(window) = app.get_webview_window("main") else { return };
    if window.is_visible().unwrap_or(false) && !window.is_minimized().unwrap_or(false) {
        let _ = window.hide();
    } else {
        let _ = window.unminimize();
        let _ = window.show();
        let _ = window.set_focus();
    }
}

fn build_tray(app: &tauri::AppHandle) -> tauri::Result<()> {
    use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
    use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};

    let show = MenuItem::with_id(app, "toggle-window", "Show / Hide", true, None::<&str>)?;
    let play = MenuItem::with_id(app, "playpause", "Play / Pause", true, None::<&str>)?;
    let skip = MenuItem::with_id(app, "skip", "Skip phase", true, None::<&str>)?;
    let quit = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
    let separator = PredefinedMenuItem::separator(app)?;
    let menu = Menu::with_items(app, &[&show, &play, &skip, &separator, &quit])?;

    let mut builder = TrayIconBuilder::with_id(TRAY_ID)
        .menu(&menu)
        .tooltip("Lofi Engine")
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| {
            let action = event.id.as_ref().to_string();
            let _ = app.emit("tray://action", TrayAction { action: action.clone() });
            match action.as_str() {
                "toggle-window" => toggle_window(app),
                "quit" => { restore_normal_geometry(app); app.exit(0); }
                _ => {}
            }
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click { button: MouseButton::Left, button_state: MouseButtonState::Up, .. } = event {
                toggle_window(tray.app_handle());
            }
        });
    if let Some(icon) = app.default_window_icon() { builder = builder.icon(icon.clone()); }
    builder.build(app)?;
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(
            tauri_plugin_window_state::Builder::default()
                .with_state_flags(
                    tauri_plugin_window_state::StateFlags::SIZE
                        | tauri_plugin_window_state::StateFlags::POSITION
                        | tauri_plugin_window_state::StateFlags::MAXIMIZED,
                )
                .build(),
        )
        .manage(WindowState::default())
        .setup(|app| {
            let handle = app.handle().clone();
            if let Err(error) = build_tray(&handle) {
                eprintln!("Unable to create system tray: {error}");
            }
            if let Some(window) = app.get_webview_window("main") {
                window.on_window_event(move |event| {
                    if let tauri::WindowEvent::CloseRequested { api, .. } = event {
                        api.prevent_close();
                        restore_normal_geometry(&handle);
                        handle.exit(0);
                    }
                });
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![set_mini_geometry, exit_mini, quit_app])
        .run(tauri::generate_context!())
        .expect("error while running Lofi Engine");
}
