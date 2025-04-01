import { USER_AGENT } from "./utils/constants.js";
import { log } from "./utils/log.js";

function getPartitionName(partitionX, partitionY, subreddit, challenge, sequence) {
	return `[${subreddit} / challenge ${challenge} / (${partitionX}, ${partitionY}) @ ${sequence}]`;
}

function getPartitionUrl(partitionX, partitionY, subreddit, challenge, sequence) {
	return `https://webview.devvit.net/a1/field-app/px_${partitionX}__py_${partitionY}/${subreddit}/p/${challenge}/${sequence}`;
}

export async function fetchPartition(partitionX, partitionY, subreddit, challenge, sequence) {
	const name = getPartitionName(partitionX, partitionY, subreddit, challenge, sequence);
	const url = getPartitionUrl(partitionX, partitionY, subreddit, challenge, sequence);

	const response = await fetch(url, {
		headers: {
			"user-agent": USER_AGENT,
		},
	});

	if (!response.ok) {
		log("partition %s is blank", name);
		return null;
	}

	log("fetched partition %s", name);

	const blob = await response.blob();
	return blob.bytes();
}
