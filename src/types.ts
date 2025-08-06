import type { Agent } from "@atproto/api";

export interface LeafletLoaderOptions {
	/**
	 * @description Your repo is either your handle (@you.some.url) or your DID (did:plc... or did:web...). You can find this information using: https://pdsls.dev
	 */
	repo: string;
}

export interface LeafletRecord {
	id: string;
	uri: string;
	cid?: string;
	value: unknown;
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
