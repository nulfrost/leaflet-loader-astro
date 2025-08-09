import { is } from "@atcute/lexicons";
import { AtUri, UnicodeString } from "@atproto/api";
import sanitizeHTML from "sanitize-html";
import {
	PubLeafletBlocksHeader,
	PubLeafletBlocksHorizontalRule,
	PubLeafletBlocksText,
	PubLeafletBlocksUnorderedList,
	PubLeafletPagesLinearDocument,
} from "./lexicons/index.js";
import type {
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
		throw new Error("Failed to get rkey from uri.");
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

		return data.pds;
	} catch {
		throw new Error(`failed to resolve handle: ${handleOrDid}`);
	}
}

export async function getLeafletDocuments({
	repo,
	reverse,
	cursor,
	agent,
	limit,
}: GetLeafletDocumentsParams) {
	const response = await agent.com.atproto.repo.listRecords({
		repo,
		collection: "pub.leaflet.document",
		cursor,
		reverse,
		limit,
	});

	if (response.success === false) {
		throw new LiveLoaderError(
			"error fetching leaflet documents",
			"DOCUMENT_FETCH_ERROR",
		);
	}

	return {
		documents: response?.data?.records,
		cursor: response?.data?.cursor,
	};
}

export async function getSingleLeafletDocument({
	agent,
	repo,
	id,
}: GetSingleLeafletDocumentParams) {
	const response = await agent.com.atproto.repo.getRecord({
		repo,
		collection: "pub.leaflet.document",
		rkey: id,
	});

	if (response.success === false) {
		throw new LiveLoaderError(
			"error fetching single document",
			"DOCUMENT_FETCH_ERROR",
		);
	}

	return response?.data;
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

export function leafletBlocksToHTML(record: LeafletDocumentRecord) {
	const firstPage = record.pages[0];
	let html = "";
	let blocks: PubLeafletPagesLinearDocument.Block[] = [];
	if (is(PubLeafletPagesLinearDocument.mainSchema, firstPage)) {
		blocks = firstPage.blocks || [];
	}

	for (const block of blocks) {
		html += parseBlocks(block);
	}

	return sanitizeHTML(html);
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

function parseBlocks(block: PubLeafletPagesLinearDocument.Block) {
	let html = "";
	if (is(PubLeafletBlocksText.mainSchema, block.block)) {
		const rt = new RichText({
			text: block.block.plaintext,
			facets: block.block.facets || [],
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
				(segment) =>
					segment.$type === "pub.leaflet.richtext.facet#strikethrough",
			);
			const isUnderline = segment.facet?.find(
				(segment) => segment.$type === "pub.leaflet.richtext.facet#underline",
			);
			const isItalic = segment.facet?.find(
				(segment) => segment.$type === "pub.leaflet.richtext.facet#italic",
			);
			if (isCode) {
				children.push(`<code>${segment.text}</code>`);
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
		html += `<p>${children}</p>`;
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
		html += `<ul>$${block.block.children.map((child) => renderListItem(child))}</ul>`;
	}

	return html;
}

function renderListItem(item: PubLeafletBlocksUnorderedList.ListItem): string {
	const children: string | null = item.children?.length
		? `<ul>${item.children.map((child) => renderListItem(child))}</ul>`
		: null;

	return `<li>${parseBlocks({ block: item.content })}${children}</li>`;
}
