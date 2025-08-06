import type { LiveLoader } from "astro/loaders";
import { Agent } from "@atproto/api";
import { isDid } from "@atproto/did";
import { isValidHandle } from "@atproto/syntax";
import {
	getLeafletDocuments,
	getSingleLeafletDocument,
	resolveMiniDoc,
	uriToRkey,
} from "./utils.js";
import type {
	CollectionFilter,
	EntryFilter,
	LeafletRecord,
	LeafletLoaderOptions,
} from "./types.js";

export class LiveLoaderError extends Error {
	constructor(
		message: string,
		public code?: string,
	) {
		super(message);
		this.name = "LiveLoaderError";
	}
}

/**
 * Flow:
 * - Check for valid handle or did [done]
 * - Resolve PDS url from handle or did [done, thanks Phil!]
 * - Fetch leaflet documents [done]
 * - Find out how to use leaflet types here
 */

export function leafletLiveLoader(
	options: LeafletLoaderOptions,
): LiveLoader<LeafletRecord, EntryFilter, CollectionFilter, LiveLoaderError> {
	const { repo } = options;

	if (!repo || typeof repo !== "string") {
		throw new LiveLoaderError(
			"missing or invalid handle or did",
			"MISSING_OR_INVALID_HANDLE_OR_DID",
		);
	}

	if (!isValidHandle(repo)) {
		// not a valid handle, let's check if it's a valid did
		if (!isDid(repo)) {
			throw new LiveLoaderError(
				"invalid handle or did",
				"INVALID_HANDLE_OR_DID",
			);
		}
	}

	return {
		name: "leaflet-loader-astro",
		loadCollection: async ({ filter }) => {
			try {
				const pds_url = await resolveMiniDoc(repo);
				const agent = new Agent({ service: pds_url });

				const documents = await getLeafletDocuments({
					agent,
					repo,
					reverse: filter?.reverse,
					cursor: filter?.cursor,
					limit: filter?.limit,
				});

				return {
					entries: documents.map((document) => {
						const id = uriToRkey(document.uri);
						return {
							id,
							data: {
								id,
								...document,
							},
						};
					}),
				};
			} catch (error) {
				return {
					error: new LiveLoaderError(
						"could not recover from error, please report on github",
						"UNRECOVERABLE_ERROR",
					),
				};
			}
		},
		loadEntry: async ({ filter }) => {
			try {
				if (!filter.id) {
					return {
						error: new LiveLoaderError(
							"must provide an id for specific document",
							"MISSING_DOCUMENT_ID",
						),
					};
				}
				const pds_url = await resolveMiniDoc(repo);
				const agent = new Agent({ service: pds_url });
				const document = await getSingleLeafletDocument({
					agent,
					id: filter.id,
					repo,
				});

				return {
					id: filter?.id,
					data: {
						id: filter?.id,
						...document,
					},
				};
			} catch {
				return {
					error: new LiveLoaderError(
						"could not recover from error, please report on github",
						"UNRECOVERABLE_ERROR",
					),
				};
			}
		},
	};
}
