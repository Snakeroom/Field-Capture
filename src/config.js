import { decodeGrpc, encodeGrpc } from "./utils/grpc.js";

import { CustomPostDefinition } from "@devvit/protos";
import { USER_AGENT } from "./utils/constants.js";
import { log } from "./utils/log.js";

const RENDER_POST_CONTENT_URL = "https://devvit-gateway.reddit.com/devvit.reddit.custom_post.v1alpha.CustomPost/RenderPostContent";
const GRPC_CONTENT_TYPE = "application/grpc-web+proto";

const GRPC_MESSAGE_HEADER = "grpc-message";

export async function getFieldConfig(installation, postId, cookie) {
	log("fetching post data for installation %s", installation);

	const body = encodeGrpc(CustomPostDefinition.methods.renderPostContent.requestType, {
		events: [],
		props: {
			postId,
		},
	});

	const response = await fetch(RENDER_POST_CONTENT_URL, {
		body,
		headers: {
			"content-type": GRPC_CONTENT_TYPE,
			cookie,
			"devvit-installation": installation,
			"user-agent": USER_AGENT,
		},
		method: "post",
	});

	if (!response.ok) {
		throw new Error("Failed to fetch post data: " + response.statusText);
	}

	const data = await response.arrayBuffer();

	if (data.byteLength === 0) {
		if (response.headers.has(GRPC_MESSAGE_HEADER)) {
			throw new Error("Failed to fetch post data: " + response.headers.get(GRPC_MESSAGE_HEADER));
		} else {
			throw new Error("No post data found");
		}
	}

	log("fetched post data");

	const buffer = Buffer.from(data);
	const post = decodeGrpc(CustomPostDefinition.methods.renderPostContent.responseType, buffer);

	const state = Object.values(post.state).find(statex => {
		return statex?.value?.appConfig !== undefined;
	});

	const config = state?.value;

	if (!config) {
		throw new Error("No config found in post data");
	}

	log("decoded config");
	return state?.value;
}
