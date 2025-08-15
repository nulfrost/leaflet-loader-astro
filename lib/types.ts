import type { Client } from "@atcute/client";
import type { ActorIdentifier } from "@atcute/lexicons";
import type { XRPCProcedures, XRPCQueries } from "@atcute/lexicons/ambient";
import type { PubLeafletRichtextFacet } from "./lexicons/index.js";

export interface LiveLeafletLoaderOptions {
	/**
	 * @description Your repo is your DID (did:plc... or did:web...) or handle (username.bsky.social). You can find this information using: https://pdsls.dev
	 */
	repo: string;
}

export interface StaticLeafletLoaderOptions {
	/**
	 * @description Your repo is your DID (did:plc... or did:web...) or handle (username.bsky.social). You can find this information using: https://pdsls.dev
	 */
	repo: string;
	/**
	 * @description The number of records leaflet records to return for getCollection, the default being 50. The range can be from 1 to 100.
	 * @default 50
	 */
	limit?: number;
	/**
	 * @description Whether or not the records should be returned in reverse order.
	 * @default undefined
	 */
	reverse?: boolean;
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
	repo: ActorIdentifier;
	rpc: Client<XRPCQueries, XRPCProcedures>;
	cursor?: string;
	limit?: number;
	reverse?: boolean;
}

export interface GetSingleLeafletDocumentParams {
	repo: ActorIdentifier;
	rpc: Client<XRPCQueries, XRPCProcedures>;
	id: string;
}

export interface Facet extends PubLeafletRichtextFacet.Main {}
export interface RichTextSegment {
	text: string;
	facet?: Exclude<Facet["features"], { $type: string }>;
}

// yoinked from: https://github.com/mary-ext/atcute/blob/trunk/packages/lexicons/lexicons/lib/syntax/handle.ts
/**
 * represents a decentralized identifier (DID).
 */
export type Did<Method extends string = string> = `did:${Method}:${string}`;
