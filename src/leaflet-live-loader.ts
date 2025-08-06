import { Agent } from "@atproto/api";
import { isDid } from "@atproto/did";
import type { LiveLoader } from "astro/loaders";
import type {
	CollectionFilter,
	EntryFilter,
	LeafletDocumentRecord,
	LeafletDocumentView,
	LeafletLoaderOptions,
} from "./types.js";
import {
	getLeafletDocuments,
	getSingleLeafletDocument,
	leafletDocumentRecordToView,
	resolveMiniDoc,
	uriToRkey,
} from "./utils.js";

export class LiveLoaderError extends Error {
	constructor(
		message: string,
		public code?: string,
	) {
		super(message);
		this.name = "LiveLoaderError";
	}
}

export function leafletLiveLoader(
	options: LeafletLoaderOptions,
): LiveLoader<
	LeafletDocumentView,
	EntryFilter,
	CollectionFilter,
	LiveLoaderError
> {
	const { repo } = options;

	if (!repo || typeof repo !== "string") {
		throw new LiveLoaderError(
			"missing or invalid did",
			"MISSING_OR_INVALID_DID",
		);
	}

	// not a valid handle, let's check if it's a valid did
	if (!isDid(repo)) {
		throw new LiveLoaderError("invalid did", "INVALID_DID");
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
							data: leafletDocumentRecordToView({
								uri: document.uri,
								cid: document.cid,
								value: document.value as unknown as LeafletDocumentRecord,
							}),
						};
					}),
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
					id: filter.id,
					data: leafletDocumentRecordToView({
						uri: document.uri,
						cid: document.cid?.toString() ?? "",
						value: document.value as unknown as LeafletDocumentRecord,
					}),
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
