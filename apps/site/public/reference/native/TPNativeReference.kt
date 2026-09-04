// TP VPN native UI reference · Compose Material 3.
// Compile in target app; inject VPN state, node selection and persisted settings.
package com.tpvpn.reference

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.semantics.*
import androidx.compose.ui.unit.dp

enum class TPConnectionState { Disconnected, Connecting, Connected, Error }

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun TPNativeReference(
    state: TPConnectionState,
    onConnect: () -> Unit,
    onCancel: () -> Unit,
    onDisconnect: () -> Unit,
    onSelectNode: (String) -> Unit,
    autoConnect: Boolean,
    onAutoConnectChange: (Boolean) -> Unit
) {
    var showNodes by remember { mutableStateOf(false) }
    var selectedNode by remember { mutableStateOf("Hong Kong") }
    val label = when (state) {
        TPConnectionState.Disconnected -> "Connect"
        TPConnectionState.Connecting -> "Cancel connection"
        TPConnectionState.Connected -> "Disconnect"
        TPConnectionState.Error -> "Retry connection"
    }
    // Native component transitions honor the platform duration scale.
    // No decorative loop; a static text state remains when animation is disabled.
    MaterialTheme(colorScheme = lightColorScheme(
        primary = Color(0xFF1677FF), onPrimary = Color.White,
        background = Color(0xFFFAFBFF), surface = Color.White
    )) {
        Scaffold(topBar = { TopAppBar(title = { Text("TP VPN") }) }) { insets ->
            Column(Modifier.padding(insets).consumeWindowInsets(insets)
                .padding(24.dp).fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(24.dp)) {
                Text("A clearer connection", style = MaterialTheme.typography.headlineMedium)
                Button(
                    onClick = {
                        when (state) {
                            TPConnectionState.Connecting -> onCancel()
                            TPConnectionState.Connected -> onDisconnect()
                            else -> onConnect()
                        }
                    }, modifier = Modifier.fillMaxWidth().heightIn(min = 56.dp)
                ) { Text(label) }
                Text(when (state) {
                    TPConnectionState.Disconnected -> "Not connected"
                    TPConnectionState.Connecting -> "Connecting…"
                    TPConnectionState.Connected -> "Connected"
                    TPConnectionState.Error -> "Connection failed. Try again."
                }, modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite })
                OutlinedButton(onClick = { showNodes = true }, modifier = Modifier.heightIn(min = 48.dp)) {
                    Text(selectedNode)
                }
                ListItem(headlineContent = { Text("Auto-connect") }, trailingContent = {
                    Switch(checked = autoConnect, onCheckedChange = onAutoConnectChange,
                        modifier = Modifier.semantics { contentDescription = "Auto-connect" })
                })
            }
        }
        if (showNodes) {
            ModalBottomSheet(onDismissRequest = { showNodes = false }) {
                Column(Modifier.navigationBarsPadding().padding(24.dp), verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Text("Locations", style = MaterialTheme.typography.titleLarge)
                    listOf("Hong Kong", "Tokyo", "Singapore").forEach { node ->
                        TextButton(onClick = {
                            selectedNode = node
                            onSelectNode(node)
                            showNodes = false
                        }, modifier = Modifier.fillMaxWidth().heightIn(min = 48.dp)
                            .semantics { selected = node == selectedNode }) { Text(node) }
                    }
                }
            }
        }
    }
}
