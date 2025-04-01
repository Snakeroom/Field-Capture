/**
 * Reads a 24-bit unsigned integer from a {@link Uint8Array}.
 * @param {Uint8Array} data the array to read from
 * @param {number} offset the offset in the array
 * @returns {number} the value
 */
function readUint24(data, offset) {
	return (data[offset] << 16) | (data[offset + 1] << 8) | data[offset + 2];
}

/**
 * Reads multiple pairs of bytes from a {@link Uint8Array}.
 */
class QuadReader {
	/**
	 * @param {Uint8Array} data the array to read from
	 */
	constructor(data) {
		this.data = data;

		this.index = 0;
		this.byteOffset = 0;
	}

	/**
	 * Reads a pair of bits from the array.
	 * @returns {number} the value
	 */
	read() {
		// Read two bits from the current byte
		const value = (this.data[this.index] >>> (6 - this.byteOffset)) & 0b11;
		this.byteOffset += 2;

		// Move to the next byte
		if (this.byteOffset >= 8) {
			this.index += 1;
			this.byteOffset = 0;
		}

		return value;
	}
}

/**
 * @typedef {Object} Cell
 * @property {boolean} ban whether the cell caused the claimer to be banned
 * @property {number} team the index of the claimer's team
 */

/**
 * Decodes full partition data.
 * @param {Uint8Array} data the array to read from
 * @yields {Cell | null} a cell, or null if the position has not been claimed
 */
export function *decodePartition(data) {
	let cells = readUint24(data, 0);

	const typesLength = readUint24(data, 3);
	const types = data.subarray(6, 6 + typesLength);

	const teams = new QuadReader(data.subarray(6 + typesLength));

	for (let index = 0; index < types.length && cells > 0; index += 1) {
		let byte = types[index];

		if (byte >= 244) {
			// Run of cells
			const claimed = (byte - 244) % 3 === 0;

			const cell = claimed ? null : {
				ban: (byte - 244) % 3 === 2,
				team: teams.read(),
			};

			// Move to next byte
			const runLength = byte >= 253 ? types[index += 1] + 9 : Math.floor((byte - 244) / 3) + 6;
			cells -= runLength;

			for (let runIndex = 0; runIndex < runLength; runIndex += 1) {
				yield cell;
			}
		} else {
			// Individual cells
			for (let cellIndex = 0; cellIndex < 5 && cells > 0; cellIndex += 1) {
				const trit = byte % 3;
				byte = Math.floor(byte / 3);

				const cell = trit === 0 ? null : {
					ban: trit === 2,
					team: teams.read(),
				};

				cells -= 1;
				yield cell;
			}
		}
	}
}
