import type { LiveLoader } from "astro/loaders";
import { Agent } from "@atproto/api";
import { isDid } from "@atproto/did";
import { isValidHandle } from "@atproto/syntax";
import { getLeafletDocuments, resolveMiniDoc, uriToRkey } from "./utils.js";
import type { LeafletRecord, LiveLoaderOptions } from "./types.js";

export class LiveLoaderError extends Error {
	constructor(message: string, reason: string) {
		super(message);
		this.name = "LiveLoaderError";
	}
}

/**
 * Flow:
 * - Check for valid handle or did [done]
 * - Resolve PDS url from handle or did [done, thanks Phil!]
 * - Fetch leaflet documents [done]
 */

export function leafletLiveLoader(
	options: LiveLoaderOptions,
): LiveLoader<LeafletRecord> {
	const { repo } = options;

	return {
		name: "leaflet-live-loader",
		loadCollection: async ({ filter }) => {
			if (!repo || typeof repo !== "string") {
				throw new LiveLoaderError(
					"missing or invalid handle or did",
					"MISSING_OR_INVALID_IDENTIFIER",
				);
			}

			if (!isValidHandle(repo) || !isDid(repo)) {
				throw new LiveLoaderError(
					"invalid handle or did",
					"INVALID_IDENTIFIER",
				);
			}

			// we know for sure the handle or did is valid now

			try {
				const pds_url = await resolveMiniDoc(repo);
				const agent = new Agent({ service: pds_url });

				const response = await getLeafletDocuments(repo, agent);

				return {
					entries: response.data.records.map((document) => ({
						id: uriToRkey(document.uri),
						data: document,
					})),
				};
			} catch (error) {
				return {
					error: new LiveLoaderError(
						"Could not recover from error, please report on github",
						"UNRECOVERABLE_ERROR",
					),
				};
			}
		},
		loadEntry: async () => {},
	};
}
