import { FIELDS, OUTPUT_DIR } from "./utils/constants.js";

import { createWriteStream } from "node:fs";
import { getFieldConfig } from "./config.js";
import { log } from "./utils/log.js";
import { mkdir } from "node:fs/promises";
import { renderPartition } from "./render.js";

await mkdir(OUTPUT_DIR, {
	recursive: true,
});

for (const { cookie, id, installation, overrideConfig, post } of FIELDS) {
	try {
		const config = overrideConfig ?? await getFieldConfig(installation, post, cookie);

		const subreddit = config.level.subredditId;
		const name = config.level.title;

		const challenge = config.challengeNumber;
		const sequence = config.initialMapKey.sequenceNumber;

		const totalSize = config.challengeConfig.size;
		const partitionSize = config.challengeConfig.partitionSize;

		const canvas = await renderPartition(totalSize, partitionSize, subreddit, challenge, sequence, name,false,false);

		const writeStream = createWriteStream(`${OUTPUT_DIR}/${id}.png`);
		canvas.createPNGStream().pipe(writeStream);
		
		const bancanvas = await renderPartition(totalSize, partitionSize, subreddit, challenge, sequence, name,true,false);

		const banWriteStream = createWriteStream(`${OUTPUT_DIR}/${id}_b.png`);
		bancanvas.createPNGStream().pipe(banWriteStream);
		
		const shadecanvas = await renderPartition(totalSize, partitionSize, subreddit, challenge, sequence, name,true,true);

		const shadeWriteStream = createWriteStream(`${OUTPUT_DIR}/${id}_s.png`);
		shadecanvas.createPNGStream().pipe(shadeWriteStream);
	} catch (error) {
		log("failed to capture screenshot for %s", installation, error);
	}
}
