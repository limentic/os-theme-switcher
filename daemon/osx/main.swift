import Cocoa

func watcher() -> Void {
    let isDark = UserDefaults.standard.string(forKey: "AppleInterfaceStyle") == "Dark"
    
    let text = isDark ? "dark" : "light"

    // write current-theme to the same directory as the daemon
    let path = Bundle.main.bundlePath + "/current-theme"
    let url = URL(fileURLWithPath: path)
    do {
        try text.write(to: url, atomically: false, encoding: .utf8)
    } catch {
        print("DAEMON: Error writing to \(path)")
        exit(EXIT_FAILURE)
    }

}

watcher()

DistributedNotificationCenter.default.addObserver(
    forName: Notification.Name("AppleInterfaceThemeChangedNotification"),
    object: nil,
    queue: nil
) {
    notification in
    watcher()
}

NSWorkspace.shared.notificationCenter.addObserver(
    forName: NSWorkspace.didWakeNotification,
    object: nil,
    queue: nil
) {
    notification in
    watcher()
}

NSApplication.shared.run()