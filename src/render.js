import { log, statsLog } from "./utils/log.js";

import { createCanvas } from "canvas";
import { decodePartition } from "./utils/decode.js";
import { fetchPartition } from "./partition.js";
import { getCellColor } from "./utils/color.js";

function getPercent(count, total) {
	const percent = count / Math.max(total, 1) * 100;
	return `${percent.toFixed(2)}%`;
}

export async function renderPartition(totalSize, partitionSize, subreddit, challenge, sequence, name) {
	log("capturing screenshot for %s", name);

	const partitionCount = Math.floor(totalSize / partitionSize);

	const canvas = createCanvas(totalSize, totalSize);
	const context = canvas.getContext("2d");

	const imageData = context.createImageData(partitionSize, partitionSize);

	let total = 0;
	let claimed = 0;
	let bans = 0;

	for (let partitionX = 0; partitionX < partitionCount; partitionX += 1) {
		for (let partitionY = 0; partitionY < partitionCount; partitionY += 1) {
			const partition = await fetchPartition(partitionX, partitionY, subreddit, challenge, sequence);

			if (partition !== null) {
				const cells = decodePartition(partition);

				let index = 0;

				for (const cell of cells) {
					const color = getCellColor(cell);

					imageData.data[index * 4] = (color >> 16) & 0xFF;
					imageData.data[index * 4 + 1] = (color >> 8) & 0xFF;
					imageData.data[index * 4 + 2] = color & 0xFF;
					imageData.data[index * 4 + 3] = 255;

					index += 1;
					total += 1;

					if (cell) {
						claimed += 1;

						if (cell.ban) {
							bans += 1;
						}
					}
				}

				context.putImageData(imageData, partitionX * partitionSize, partitionY * partitionSize);
			}
		}
	}

	statsLog("%s of all cells on %s are claimed", getPercent(claimed, total), name);
	statsLog("%s of claimed cells on %s are bans", getPercent(bans, claimed), name);

	return canvas;
}
