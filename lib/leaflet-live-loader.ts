import { AtpAgent } from "@atproto/api";
import { isDid } from "@atproto/did";
import type { LiveLoader } from "astro/loaders";
import type {
	CollectionFilter,
	EntryFilter,
	LeafletDocumentRecord,
	LeafletDocumentView,
	LiveLeafletLoaderOptions,
} from "./types.js";
import {
	getLeafletDocuments,
	getSingleLeafletDocument,
	leafletBlocksToHTML,
	leafletDocumentRecordToView,
	LiveLoaderError,
	resolveMiniDoc,
	uriToRkey,
} from "./utils.js";
import { Client, simpleFetchHandler } from "@atcute/client";

export function leafletLiveLoader(
	options: LiveLeafletLoaderOptions,
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

	// not a valid did
	if (!isDid(repo)) {
		throw new LiveLoaderError("invalid did", "INVALID_DID");
	}

	return {
		name: "leaflet-loader-astro",
		loadCollection: async ({ filter }) => {
			try {
				const { pds, did } = await resolveMiniDoc(repo);
				const handler = simpleFetchHandler({ service: pds });
				const rpc = new Client({ handler });

				const { documents } = await getLeafletDocuments({
					rpc,
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
							rendered: {
								html: leafletBlocksToHTML({
									record: document.value as unknown as LeafletDocumentRecord,
									did,
								}),
							},
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
			if (!filter.id) {
				return {
					error: new LiveLoaderError(
						"must provide an id for specific document",
						"MISSING_DOCUMENT_ID",
					),
				};
			}
			try {
				const { pds, did } = await resolveMiniDoc(repo);
				const handler = simpleFetchHandler({ service: pds });
				const rpc = new Client({ handler });
				const document = await getSingleLeafletDocument({
					rpc,
					id: filter.id,
					repo,
				});

				const cid = document?.cid?.toString() ?? "";

				return {
					id: filter.id,
					data: leafletDocumentRecordToView({
						uri: document.uri,
						cid,
						value: document.value as unknown as LeafletDocumentRecord,
					}),
					rendered: {
						html: leafletBlocksToHTML({
							record: document.value as unknown as LeafletDocumentRecord,
							did,
						}),
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
