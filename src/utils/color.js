const TEAM_COLORS = [
	/* eslint-disable no-inline-comments */
	0xCC3A83, // Flamingo
	0x6B92F2, // Juicebox
	0xEA6126, // Lasagna
	0xEDA635, // Sunshine
	/* eslint-enable no-inline-comments */
];

const BAN_COLOR = 0x7DFF00;
const UNCLAIMED_COLOR = 0x000000;

/**
 * Gets an RGB color representing a given cell.
 * @param {import("./decode").Cell | null} cell the cell to get the color for
 * @returns {number} the color
 */
export function getCellColor(cell) {
	if (cell?.ban) {
		return BAN_COLOR;
	} else if (cell?.team !== undefined) {
		return TEAM_COLORS[cell.team];
	}

	return UNCLAIMED_COLOR;
}
