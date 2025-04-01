export function encodeGrpc(def, data) {
	const protobuf = Buffer.from(def.encode(data).finish());
	const buffer = Buffer.alloc(5 + protobuf.byteLength);

	// Header
	buffer.writeUInt8(0, 0);
	buffer.writeUInt32BE(protobuf.length, 1);

	protobuf.copy(buffer, 5);

	return buffer;
}

export function decodeGrpc(def, buffer) {
	let offset = 1;

	const length = buffer.readUInt32BE(offset);
	offset += 4;

	const messageBuffer = buffer.subarray(offset);
	return def.decode(messageBuffer, length);
}
