// TP VPN native UI reference · iOS 17+ · integrate and compile in the target app.
// Inject real VPN state and callbacks. This view never creates a VPN tunnel.
import SwiftUI

enum TPConnectionState { case disconnected, connecting, connected, error }

struct TPNativeReference: View {
    let state: TPConnectionState
    let onConnect: () -> Void
    let onCancel: () -> Void
    let onDisconnect: () -> Void
    let onSelectNode: (String) -> Void
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var showNodes = false
    @State private var selectedNode = "Hong Kong"
    @State private var autoConnect = true
    private let brand = Color(red: 22 / 255, green: 119 / 255, blue: 1)
    private var label: String {
        switch state {
        case .disconnected: "Connect"
        case .connecting: "Cancel connection"
        case .connected: "Disconnect"
        case .error: "Retry connection"
        }
    }
    var body: some View {
        NavigationStack {
            List {
                Section {
                    Button {
                        switch state {
                        case .connecting: onCancel()
                        case .connected: onDisconnect()
                        default: onConnect()
                        }
                    } label: {
                        VStack(spacing: 16) {
                            Image(systemName: state == .connected ? "checkmark.shield.fill" : "power")
                                .font(.largeTitle).accessibilityHidden(true)
                            Text(label).font(.headline)
                            if state == .connecting { Text("Connecting…").font(.body) }
                            if state == .error { Text("Connection failed. Try again.").font(.body) }
                        }
                        .frame(maxWidth: .infinity, minHeight: 128).padding(24)
                        .foregroundStyle(brand)
                    }
                    .buttonStyle(.plain)
                    .animation(reduceMotion ? nil : .easeOut(duration: 0.18), value: state)
                }
                Section("Location") {
                    Button { showNodes = true } label: {
                        Label(selectedNode, systemImage: "globe").frame(minHeight: 44)
                    }
                }
                Section("Preferences") {
                    Toggle("Auto-connect", isOn: $autoConnect)
                }
            }
            .navigationTitle("TP VPN")
            .sheet(isPresented: $showNodes) {
                NavigationStack {
                    List(["Hong Kong", "Tokyo", "Singapore"], id: \.self) { node in
                        Button {
                            selectedNode = node
                            onSelectNode(node)
                            showNodes = false
                        } label: {
                            HStack {
                                Text(node)
                                Spacer()
                                if node == selectedNode { Image(systemName: "checkmark") }
                            }.frame(minHeight: 44)
                        }
                        .accessibilityAddTraits(node == selectedNode ? .isSelected : [])
                    }
                    .navigationTitle("Locations")
                    .toolbar { ToolbarItem(placement: .confirmationAction) { Button("Done") { showNodes = false } } }
                }
                .presentationDetents([.medium, .large])
                .presentationDragIndicator(.visible)
            }
        }
        .tint(brand)
        .preferredColorScheme(.light)
    }
}
