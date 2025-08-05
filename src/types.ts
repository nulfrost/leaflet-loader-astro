export interface LiveLoaderOptions {
	/**
	 * @description Your repo is either your handle (@you.some.url) or your DID (did:plc... or did:web...). You can find this information using: https://pdsls.dev
	 */
	repo: string;
}

export interface LeafletRecord {
	id: string;
	uri: string;
	cid: string;
	value: unknown;
}

export interface MiniDoc {
	did: string;
	handle: string;
	pds: string;
	signing_key: string;
}
