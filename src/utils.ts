import type { Agent } from "@atproto/api";
import type {
	GetLeafletDocumentsParams,
	GetSingleLeafletDocumentParams,
	MiniDoc,
} from "./types.js";
import { LiveLoaderError } from "./leaflet-live-loader.js";

export function uriToRkey(uri: string): string {
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

export async function getLeafletDocuments({
	repo,
	reverse,
	cursor,
	agent,
	limit,
}: GetLeafletDocumentsParams) {
	const response = await agent.com.atproto.repo.listRecords({
		repo,
		collection: "pub.leaflet.document",
		cursor,
		reverse,
		limit,
	});

	if (response.success === false) {
		throw new LiveLoaderError(
			"Could not fetch leaflet documents",
			"FETCH_FAILED",
		);
	}

	return response?.data?.records;
}

export async function getSingleLeafletDocument({
	agent,
	repo,
	id,
}: GetSingleLeafletDocumentParams) {
	const response = await agent.com.atproto.repo.getRecord({
		repo,
		collection: "pub.leaflet.document",
		rkey: id,
	});

	if (response.success === false) {
		throw new LiveLoaderError(
			"error fetching document",
			"DOCUMENT_FETCH_ERROR",
		);
	}

	return response?.data;
}
