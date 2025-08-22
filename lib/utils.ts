import type {} from "@atcute/atproto";
import { is } from "@atcute/lexicons";
import { AtUri, UnicodeString } from "@atproto/api";
import katex from "katex";
import sanitizeHTML from "sanitize-html";
import {
	PubLeafletBlocksBlockquote,
	PubLeafletBlocksCode,
	PubLeafletBlocksHeader,
	PubLeafletBlocksHorizontalRule,
	PubLeafletBlocksImage,
	PubLeafletBlocksMath,
	PubLeafletBlocksText,
	PubLeafletBlocksUnorderedList,
	PubLeafletPagesLinearDocument,
} from "./lexicons/index.js";
import type {
	Did,
	Facet,
	GetLeafletDocumentsParams,
	GetSingleLeafletDocumentParams,
	LeafletDocumentRecord,
	LeafletDocumentView,
	MiniDoc,
	RichTextSegment,
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

export function uriToRkey(uri: string): string {
	const u = AtUri.make(uri);
	if (!u.rkey) {
		throw new Error("failed to get rkey");
	}
	return u.rkey;
}

export async function resolveMiniDoc(handleOrDid: string) {
	try {
		const response = await fetch(
			`https://slingshot.microcosm.blue/xrpc/com.bad-example.identity.resolveMiniDoc?identifier=${handleOrDid}`,
		);

		if (!response.ok || response.status >= 300) {
			throw new Error(
				`could not resolve did doc due to invalid handle or did ${handleOrDid}`,
			);
		}
		const data = (await response.json()) as MiniDoc;

		return {
			pds: data.pds,
			did: data.did,
		};
	} catch {
		throw new Error(`failed to resolve handle: ${handleOrDid}`);
	}
}

export async function getLeafletDocuments({
	repo,
	reverse,
	cursor,
	rpc,
	limit,
}: GetLeafletDocumentsParams) {
	const { ok, data } = await rpc.get("com.atproto.repo.listRecords", {
		params: {
			collection: "pub.leaflet.document",
			cursor,
			reverse,
			limit,
			repo,
		},
	});

	if (!ok) {
		throw new LiveLoaderError(
			"error fetching leaflet documents",
			"DOCUMENT_FETCH_ERROR",
		);
	}

	return {
		documents: data?.records,
		cursor: data?.cursor,
	};
}

export async function getSingleLeafletDocument({
	rpc,
	repo,
	id,
}: GetSingleLeafletDocumentParams) {
	const { ok, data } = await rpc.get("com.atproto.repo.getRecord", {
		params: {
			collection: "pub.leaflet.document",
			repo,
			rkey: id,
		},
	});

	if (!ok) {
		throw new LiveLoaderError(
			"error fetching single document",
			"DOCUMENT_FETCH_ERROR",
		);
	}

	return data;
}

export function leafletDocumentRecordToView({
	uri,
	cid,
	value,
}: {
	uri: string;
	cid: string;
	value: LeafletDocumentRecord;
}): LeafletDocumentView {
	return {
		rkey: uriToRkey(uri),
		cid,
		title: value.title,
		description: value.description,
		author: value.author,
		publication: value.publication,
		publishedAt: value.publishedAt,
	};
}

export function leafletBlocksToHTML({
	record,
	did,
}: {
	record: LeafletDocumentRecord;
	did: string;
}) {
	let html = "";
	const firstPage = record.pages[0];
	let blocks: PubLeafletPagesLinearDocument.Block[] = [];

	if (is(PubLeafletPagesLinearDocument.mainSchema, firstPage)) {
		blocks = firstPage.blocks || [];
	}

	for (const block of blocks) {
		html += parseBlocks({ block, did });
	}

	return sanitizeHTML(html, {
		allowedAttributes: {
			"*": ["class", "style"],
			img: ["src", "height", "width", "alt"],
			a: ["href", "target", "rel"],
		},
		allowedTags: [
			"img",
			"pre",
			"code",
			"p",
			"a",
			"b",
			"s",
			"ul",
			"li",
			"i",
			"h1",
			"h2",
			"h3",
			"h4",
			"h5",
			"h6",
			"hr",
			"div",
			"span",
			"blockquote",
		],
		selfClosing: ["img"],
	});
}

export class RichText {
	unicodeText: UnicodeString;
	facets?: Facet[];
	constructor(props: { text: string; facets: Facet[] }) {
		this.unicodeText = new UnicodeString(props.text);
		this.facets = props.facets;
		if (this.facets) {
			this.facets = this.facets
				.filter((facet) => facet.index.byteStart <= facet.index.byteEnd)
				.sort((a, b) => a.index.byteStart - b.index.byteStart);
		}
	}

	*segments(): Generator<RichTextSegment, void, void> {
		const facets = this.facets || [];
		if (!facets.length) {
			yield { text: this.unicodeText.utf16 };
			return;
		}

		let textCursor = 0;
		let facetCursor = 0;
		do {
			const currFacet = facets[facetCursor];
			if (currFacet) {
				if (textCursor < currFacet.index.byteStart) {
					yield {
						text: this.unicodeText.slice(textCursor, currFacet.index.byteStart),
					};
				} else if (textCursor > currFacet.index.byteStart) {
					facetCursor++;
					continue;
				}
				if (currFacet.index.byteStart < currFacet.index.byteEnd) {
					const subtext = this.unicodeText.slice(
						currFacet.index.byteStart,
						currFacet.index.byteEnd,
					);
					if (!subtext.trim()) {
						// dont empty string entities
						yield { text: subtext };
					} else {
						yield { text: subtext, facet: currFacet.features };
					}
				}
				textCursor = currFacet.index.byteEnd;
				facetCursor++;
			}
		} while (facetCursor < facets.length);
		if (textCursor < this.unicodeText.length) {
			yield {
				text: this.unicodeText.slice(textCursor, this.unicodeText.length),
			};
		}
	}
}

export function parseTextBlock(block: PubLeafletBlocksText.Main) {
	let html = "";
	const rt = new RichText({
		text: block.plaintext,
		facets: block.facets || [],
	});
	const children = [];
	for (const segment of rt.segments()) {
		const link = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#link",
		);
		const isBold = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#bold",
		);
		const isCode = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#code",
		);
		const isStrikethrough = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#strikethrough",
		);
		const isUnderline = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#underline",
		);
		const isItalic = segment.facet?.find(
			(segment) => segment.$type === "pub.leaflet.richtext.facet#italic",
		);
		if (isCode) {
			children.push(`<pre><code>${segment.text}</code></pre>`);
		} else if (link) {
			children.push(
				`<a href="${link.uri}" target="_blank" rel="noopener noreferrer">${segment.text}</a>`,
			);
		} else if (isBold) {
			children.push(`<b>${segment.text}</b>`);
		} else if (isStrikethrough) {
			children.push(`<s>${segment.text}</s>`);
		} else if (isUnderline) {
			children.push(
				`<span style="text-decoration:underline;">${segment.text}</span>`,
			);
		} else if (isItalic) {
			children.push(`<i>${segment.text}</i>`);
		} else {
			children.push(`${segment.text}`);
		}
	}
	html += `<p>${children.join("")}</p>`;

	return html.trim();
}

export function parseBlocks({
	block,
	did,
}: {
	block: PubLeafletPagesLinearDocument.Block;
	did: string;
}): string {
	let html = "";

	if (is(PubLeafletBlocksText.mainSchema, block.block)) {
		html += parseTextBlock(block.block);
	}

	if (is(PubLeafletBlocksHeader.mainSchema, block.block)) {
		if (block.block.level === 1) {
			html += `<h2>${block.block.plaintext}</h2>`;
		}
	}
	if (is(PubLeafletBlocksHeader.mainSchema, block.block)) {
		if (block.block.level === 2) {
			html += `<h3>${block.block.plaintext}</h3>`;
		}
	}
	if (is(PubLeafletBlocksHeader.mainSchema, block.block)) {
		if (block.block.level === 3) {
			html += `<h4>${block.block.plaintext}</h4>`;
		}
	}
	if (is(PubLeafletBlocksHeader.mainSchema, block.block)) {
		if (!block.block.level) {
			html += `<h6>${block.block.plaintext}</h6>`;
		}
	}

	if (is(PubLeafletBlocksHorizontalRule.mainSchema, block.block)) {
		html += `<hr />`;
	}
	if (is(PubLeafletBlocksUnorderedList.mainSchema, block.block)) {
		html += `<ul>${block.block.children.map((child) => renderListItem({ item: child, did })).join("")}</ul>`;
	}

	if (is(PubLeafletBlocksMath.mainSchema, block.block)) {
		html += `<div>${katex.renderToString(block.block.tex, { displayMode: true, output: "html", throwOnError: false })}</div>`;
	}

	if (is(PubLeafletBlocksCode.mainSchema, block.block)) {
		html += `<pre><code data-language=${block.block.language}>${block.block.plaintext}</code></pre>`;
	}

	if (is(PubLeafletBlocksImage.mainSchema, block.block)) {
		// @ts-ignore
		html += `<div><img src="https://cdn.bsky.app/img/feed_fullsize/plain/${did}/${block.block.image.ref.$link}@jpeg" height="${block.block.aspectRatio.height}" width="${block.block.aspectRatio.width}" alt="${block.block.alt}" /></div>`;
	}

	if (is(PubLeafletBlocksBlockquote.mainSchema, block.block)) {
		html += `<blockquote>${parseTextBlock(block.block)}</blockquote>`;
	}

	return html.trim();
}

export function renderListItem({
	item,
	did,
}: {
	item: PubLeafletBlocksUnorderedList.ListItem;
	did: string;
}): string {
	const children: string | null = item.children?.length
		? `<ul>${item.children.map((child) => renderListItem({ item: child, did }))}</ul>`
		: "";

	return `<li>${parseBlocks({ block: { block: item.content }, did })}${children}</li>`;
}

// yoinked from: https://github.com/mary-ext/atcute/blob/trunk/packages/lexicons/lexicons/lib/syntax/handle.ts
const PLC_DID_RE = /^did:plc:([a-z2-7]{24})$/;

export const isPlcDid = (input: string): input is Did<"plc"> => {
	return input.length === 32 && PLC_DID_RE.test(input);
};
