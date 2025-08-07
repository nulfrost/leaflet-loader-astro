import type { Agent } from "@atproto/api";
import type { PubLeafletRichtextFacet } from "./lexicons/index.js";

export interface LiveLeafletLoaderOptions {
	/**
	 * @description Your repo is your DID (did:plc... or did:web...). You can find this information using: https://pdsls.dev
	 */
	repo: string;
}

export interface StaticLeafletLoaderOptions {
	/**
	 * @description Your repo is your DID (did:plc... or did:web...). You can find this information using: https://pdsls.dev
	 */
	repo: string;
	filter?: string;
	/**
	 * @default 50
	 */
	limit?: number;
}

export interface LeafletDocumentRecord {
	$type: "pub.leaflet.document";
	pages: { [x: string]: unknown };
	title: string;
	author: string;
	description: string;
	publication: string;
	publishedAt: string;
}

export interface LeafletDocumentView {
	rkey: string;
	cid: string;
	title: string;
	description: string;
	author: string;
	publication: string;
	publishedAt: string;
}

export interface MiniDoc {
	did: string;
	handle: string;
	pds: string;
	signing_key: string;
}

export interface CollectionFilter {
	limit?: number;
	reverse?: boolean;
	cursor?: string;
}

export interface EntryFilter {
	id?: string;
}

export interface GetLeafletDocumentsParams {
	repo: string;
	agent: Agent;
	cursor?: string;
	limit?: number;
	reverse?: boolean;
}

export interface GetSingleLeafletDocumentParams {
	repo: string;
	agent: Agent;
	id: string;
}

export interface Facet extends PubLeafletRichtextFacet.Main {}
export interface RichTextSegment {
	text: string;
	facet?: Exclude<Facet["features"], { $type: string }>;
}
