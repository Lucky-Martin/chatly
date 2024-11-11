type CodeGeneratorOptions = {
	codeLength?: number;
	maxAttempts?: number;
	characters?: string;
};

export class RoomCodeGenerator {
	private characters: string;
	private codeLength: number;
	private maxAttempts: number;
	private activeCodes: Set<string>;

	constructor(options: CodeGeneratorOptions = {}) {
		this.characters = options.characters ?? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
		this.codeLength = options.codeLength ?? 6;
		this.maxAttempts = options.maxAttempts ?? 100;
		this.activeCodes = new Set<string>();
	}

	generateCode(): string {
		let attempts = 0;

		while (attempts < this.maxAttempts) {
			const code = this._generateRandomCode();

			if (!this.activeCodes.has(code)) {
				this.activeCodes.add(code);
				return code.toUpperCase();
			}

			attempts++;
		}

		throw new Error('Failed to generate unique code after maximum attempts');
	}

	releaseCode(code: string): void {
		this.activeCodes.delete(code);
	}

	isCodeValid(code: string): boolean {
		return this.activeCodes.has(code);
	}

	getActiveCodeCount(): number {
		return this.activeCodes.size;
	}

	private _generateRandomCode(): string {
		return Array.from(
			{ length: this.codeLength },
			() => this.characters[Math.floor(Math.random() * this.characters.length)]
		).join('').toUpperCase();
	}
}

export const codeGenerator = new RoomCodeGenerator();