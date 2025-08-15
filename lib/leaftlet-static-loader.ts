import { Client, simpleFetchHandler } from "@atcute/client";
import { isHandle } from "@atcute/lexicons/syntax";
import type { Loader, LoaderContext } from "astro/loaders";
import { LeafletDocumentSchema } from "schema.js";
import type {
	LeafletDocumentRecord,
	StaticLeafletLoaderOptions,
} from "types.js";
import {
	getLeafletDocuments,
	isPlcDid,
	leafletBlocksToHTML,
	leafletDocumentRecordToView,
	LiveLoaderError,
	resolveMiniDoc,
	uriToRkey,
} from "utils.js";

export function leafletStaticLoader(
	options: StaticLeafletLoaderOptions,
): Loader {
	const { repo, limit, reverse } = options;

	if (!repo || typeof repo !== "string") {
		throw new LiveLoaderError(
			"missing or invalid did",
			"MISSING_OR_INVALID_DID",
		);
	}

	// not a valid handle, check if valid did
	if (!isHandle(repo)) {
		// not a valid handle or did, throw
		if (!isPlcDid(repo)) {
			throw new LiveLoaderError(
				"invalid handle or did",
				"INVALID_HANDLE_OR_DID",
			);
		}
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
				const { pds, did } = await resolveMiniDoc(repo);
				const handler = simpleFetchHandler({ service: pds });
				const rpc = new Client({ handler });

				let cursor: string | undefined;
				let count = 0;

				fetching: do {
					const { documents, cursor: documentsCursor } =
						await getLeafletDocuments({
							rpc,
							repo,
							cursor,
							reverse,
							limit: 50,
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
								html: leafletBlocksToHTML({
									record: document.value as unknown as LeafletDocumentRecord,
									did,
								}),
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
