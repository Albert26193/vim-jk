import * as vscode from 'vscode';
import { JKAccelerator, type CommandMode } from './jk';

let jk: JKAccelerator | undefined;

export function activate(context: vscode.ExtensionContext): void {
	setup();

	context.subscriptions.push(
		vscode.commands.registerCommand('vim-jk.cursorUp', () => jk?.up()),
		vscode.commands.registerCommand('vim-jk.cursorDown', () => jk?.down()),
		vscode.workspace.onDidChangeConfiguration((e) => {
			if (e.affectsConfiguration('vim-jk')) {
				setup();
			}
		}),
		{
			dispose: () => {
				if (jk) {
					jk.dispose();
					jk = undefined;
				}
			},
		},
	);
}

export function deactivate(): void {
	if (jk) {
		jk.dispose();
		jk = undefined;
	}
}

function setup(): void {
	if (jk) {
		jk.dispose();
	}

	const config = vscode.workspace.getConfiguration('vim-jk');

	const accelerationTable = config.get<number[]>('accelerationTable') ?? [7, 12, 17, 21, 24, 26, 28, 30];
	const resetTime = config.get<number>('resetTime') ?? 150;
	const commandMode = (config.get<string>('commandMode') ?? 'vscodevim') as CommandMode;

	jk = new JKAccelerator({
		accelerationTable,
		resetTime,
		commandMode,
		executeCommand: async (command, args) => {
			await vscode.commands.executeCommand(command, args);
		},
		onError: (e) => {
			void vscode.window.showErrorMessage(e.toString());
			console.error(e);
		},
	});
}
