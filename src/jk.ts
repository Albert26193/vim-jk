export type CommandMode = 'vscodevim' | 'vscodevim-gj-gk' | 'cursormove';

export interface JKOptions {
	accelerationTable: number[];
	resetTime: number;
	commandMode: CommandMode;
	executeCommand: (command: string, args?: unknown) => Promise<unknown>;
	onError: (e: Error) => void;
}

export class JKAccelerator {
	private readonly options: JKOptions;
	private keyCount = 0;
	private resetTimer: NodeJS.Timeout | undefined;

	constructor(options: JKOptions) {
		this.options = options;
	}

	up(): void {
		this.increment();
		void this.executeMotion('up').catch(this.options.onError);
	}

	down(): void {
		this.increment();
		void this.executeMotion('down').catch(this.options.onError);
	}

	dispose(): void {
		if (this.resetTimer) {
			clearTimeout(this.resetTimer);
			this.resetTimer = undefined;
		}
	}

	private increment(): void {
		this.keyCount++;
		if (this.resetTimer) {
			clearTimeout(this.resetTimer);
		}
		this.resetTimer = setTimeout(() => {
			this.keyCount = 0;
		}, this.options.resetTime);
	}

	private calculateCount(): number {
		const { accelerationTable } = this.options;
		const nextIndex = accelerationTable.findIndex((repeat) => this.keyCount < repeat);
		return (nextIndex < 0 ? accelerationTable.length : nextIndex) + 1;
	}

	private async executeMotion(direction: 'up' | 'down'): Promise<void> {
		const { commandMode, executeCommand } = this.options;
		const count = this.calculateCount();

		switch (commandMode) {
			default:
			case 'vscodevim': {
				const motion = direction === 'down' ? 'j' : 'k';
				const after = count >= 2 ? [count.toString(), motion] : [motion];
				await executeCommand('vim.remap', { after });
				return;
			}
			case 'vscodevim-gj-gk': {
				const motion = direction === 'down' ? 'j' : 'k';
				const after = count >= 2 ? [count.toString(), 'g', motion] : ['g', motion];
				await executeCommand('vim.remap', { after });
				return;
			}
			case 'cursormove': {
				await executeCommand('cursorMove', { to: direction, value: count });
				return;
			}
		}
	}
}

