import type { Agent } from "@atproto/api";
import type { MiniDoc } from "./types.js";
import { LiveLoaderError } from "./loader.js";

export function uriToRkey(uri: string) {
	const rkey = uri.split("/").pop();
	if (!rkey) {
		throw new Error("Failed to get rkey from uri.");
	}
	return rkey;
}

export async function resolveMiniDoc(handleOrDid: string) {
	try {
		const response = await fetch(
			`https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${handleOrDid}`,
		);

		if (!response.ok || response.status >= 300) {
			throw new Error(
				`could not resolve did doc due to invalid handle or did ${handleOrDid}`,
			);
		}
		const data = (await response.json()) as MiniDoc;

		return data.pds;
	} catch (error) {
		throw new Error(`failed to resolve handle: ${handleOrDid}`);
	}
}

export async function getLeafletDocuments(repo: string, agent: Agent) {
	const response = await agent.com.atproto.repo.listRecords({
		repo,
		collection: "pub.leaflet.document",
	});

	if (response.success === false) {
		throw new LiveLoaderError(
			"Could not fetch leaflet documents",
			"FETCH_FAILED",
		);
	}

	return response;
}
