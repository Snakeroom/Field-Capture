export const OUTPUT_DIR = "./output";

export const USER_AGENT = "Field Screenshot v1.0.0";

/**
 * @typedef {Object} FieldSource
 * @property {string?} cookie the cookies to fetch the post with
 * @property {string} id the id to write the image to
 * @property {string} installation the Devvit installation ID
 * @property {unknown} overrideConfig the config to override the fetched config with
 * @property {string} post the post ID
 */

/**
 * @type {FieldSource[]}
 */
export const FIELDS = [{
	cookie: process.env.FIELD_COOKIE,
	id: "field",
	installation: "d705e66b-39d3-4568-b08b-b11655c064c3",
	post: "t3_1jkhl1m",
}, {
	cookie: process.env.BANNED_FIELD_COOKIE,
	id: "bannedfield",
	installation: "076afb2c-8aa3-4bd8-8d68-973c0169974a",
	post: "t3_1jkhly8",
}, {
	cookie: process.env.BANANA_FIELD_COOKIE,
	id: "bananafield",
	installation: "233820d3-60e3-48de-94ee-8853227c003c",
	post: "t3_1jkhmx9",
}, {
	cookie: process.env.WHAT_IS_FIELD_COOKIE,
	id: "whatisfield",
	installation: "8b81865e-e76b-4d51-b1d9-30e4043e0a38",
	post: "t3_1jmw52r",
}];
