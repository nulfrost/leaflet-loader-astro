import { Agent } from "@atproto/api";
import { isDid } from "@atproto/did";
import type { Loader, LoaderContext } from "astro/loaders";
import { LeafletDocumentSchema } from "schema.js";
import type {
	LeafletDocumentRecord,
	StaticLeafletLoaderOptions,
} from "types.js";
import {
	LiveLoaderError,
	resolveMiniDoc,
	getLeafletDocuments,
	uriToRkey,
	leafletDocumentRecordToView,
	leafletBlocksToHTML,
} from "utils.js";

export function leafletStaticLoader(
	options: StaticLeafletLoaderOptions,
): Loader {
	const { repo, limit } = options;

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
		name: "static-leaflet-loader-astro",
		schema: LeafletDocumentSchema,
		load: async ({
			store,
			logger,
			generateDigest,
			parseData,
		}: LoaderContext) => {
			try {
				logger.info("fetching latest leaflet documents");
				const pds_url = await resolveMiniDoc(repo);
				const agent = new Agent({ service: pds_url });

				let cursor: string | undefined;
				let count = 0;

				fetching: do {
					const { documents, cursor: documentsCursor } =
						await getLeafletDocuments({
							agent,
							repo,
							cursor,
							limit: 100,
						});
					for (const document of documents) {
						if (limit && count >= limit) {
							count++;
							break fetching;
						}
						count++;

						const id = uriToRkey(document.uri);
						const digest = generateDigest(document.value);
						store.set({
							id,
							data: await parseData({
								id,
								data: JSON.parse(
									JSON.stringify(
										leafletDocumentRecordToView({
											uri: document.uri,
											cid: document.cid,
											value: document.value as unknown as LeafletDocumentRecord,
										}),
									),
								),
							}),
							digest,
							rendered: {
								html: leafletBlocksToHTML(
									document.value as unknown as LeafletDocumentRecord,
								),
							},
						});
					}
					cursor = documentsCursor;
					logger.info(`Fetched ${count} posts`);
				} while (cursor);
			} catch (error) {
				logger.error(
					`There was an error fetching the leaflet documents: ${(error as Error).message}`,
				);
			}
		},
	};
}
