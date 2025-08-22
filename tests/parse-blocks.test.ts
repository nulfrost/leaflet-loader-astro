import { expect, test } from "vitest";
import { parseBlocks } from "../lib/utils";

test("should correctly parse an h1 block to an h2 tag", () => {
	const html = parseBlocks({
		block: {
			$type: "pub.leaflet.pages.linearDocument#block",
			block: {
				$type: "pub.leaflet.blocks.header",
				level: 1,
				facets: [],
				plaintext: "heading 1",
			},
		},
		did: "did:plc:qttsv4e7pu2jl3ilanfgc3zn",
	});

	expect(html).toMatchInlineSnapshot(`"<h2>heading 1</h2>"`);
});

test("should correctly parse an h2 block to an h3 tag", () => {
	const html = parseBlocks({
		block: {
			$type: "pub.leaflet.pages.linearDocument#block",
			block: {
				$type: "pub.leaflet.blocks.header",
				level: 2,
				facets: [],
				plaintext: "heading 2",
			},
		},
		did: "did:plc:qttsv4e7pu2jl3ilanfgc3zn",
	});

	expect(html).toMatchInlineSnapshot(`"<h3>heading 2</h3>"`);
});

test("should correctly parse an h3 block to an h4 tag", () => {
	const html = parseBlocks({
		block: {
			$type: "pub.leaflet.pages.linearDocument#block",
			block: {
				$type: "pub.leaflet.blocks.header",
				level: 3,
				facets: [],
				plaintext: "heading 3",
			},
		},
		did: "did:plc:qttsv4e7pu2jl3ilanfgc3zn",
	});

	expect(html).toMatchInlineSnapshot(`"<h4>heading 3</h4>"`);
});

test("should correctly parse a block with no level to an h6 tag", () => {
	const html = parseBlocks({
		block: {
			$type: "pub.leaflet.pages.linearDocument#block",
			block: {
				$type: "pub.leaflet.blocks.header",
				facets: [],
				plaintext: "heading 6",
			},
		},
		did: "did:plc:qttsv4e7pu2jl3ilanfgc3zn",
	});

	expect(html).toMatchInlineSnapshot(`"<h6>heading 6</h6>"`);
});

test("should correctly parse an unordered list block", () => {
	const html = parseBlocks({
		block: {
			$type: "pub.leaflet.pages.linearDocument#block",
			block: {
				$type: "pub.leaflet.blocks.unorderedList",
				children: [
					{
						$type: "pub.leaflet.blocks.unorderedList#listItem",
						content: {
							$type: "pub.leaflet.blocks.text",
							facets: [
								{
									index: {
										byteEnd: 18,
										byteStart: 0,
									},
									features: [
										{
											uri: "https://pdsls.dev/",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
								{
									index: {
										byteEnd: 28,
										byteStart: 22,
									},
									features: [
										{
											uri: "https://bsky.app/profile/juli.ee",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
							],
							plaintext: "https://pdsls.dev/ by Juliet",
						},
						children: [],
					},
					{
						$type: "pub.leaflet.blocks.unorderedList#listItem",
						content: {
							$type: "pub.leaflet.blocks.text",
							facets: [
								{
									index: {
										byteEnd: 34,
										byteStart: 0,
									},
									features: [
										{
											uri: "https://github.com/mary-ext/atcute",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
								{
									index: {
										byteEnd: 42,
										byteStart: 38,
									},
									features: [
										{
											uri: "https://bsky.app/profile/mary.my.id",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
							],
							plaintext: "https://github.com/mary-ext/atcute by mary",
						},
						children: [],
					},
					{
						$type: "pub.leaflet.blocks.unorderedList#listItem",
						content: {
							$type: "pub.leaflet.blocks.text",
							facets: [
								{
									index: {
										byteEnd: 27,
										byteStart: 0,
									},
									features: [
										{
											uri: "https://www.microcosm.blue/",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
								{
									index: {
										byteEnd: 35,
										byteStart: 31,
									},
									features: [
										{
											uri: "https://bsky.app/profile/bad-example.com",
											$type: "pub.leaflet.richtext.facet#link",
										},
									],
								},
							],
							plaintext: "https://www.microcosm.blue/ by phil",
						},
						children: [],
					},
				],
			},
		},
		did: "did:plc:qttsv4e7pu2jl3ilanfgc3zn",
	});

	expect(html).toMatchInlineSnapshot(
		`"<ul><li><p><a href="https://pdsls.dev/" target="_blank" rel="noopener noreferrer">https://pdsls.dev/</a> by <a href="https://bsky.app/profile/juli.ee" target="_blank" rel="noopener noreferrer">Juliet</a></p></li><li><p><a href="https://github.com/mary-ext/atcute" target="_blank" rel="noopener noreferrer">https://github.com/mary-ext/atcute</a> by <a href="https://bsky.app/profile/mary.my.id" target="_blank" rel="noopener noreferrer">mary</a></p></li><li><p><a href="https://www.microcosm.blue/" target="_blank" rel="noopener noreferrer">https://www.microcosm.blue/</a> by <a href="https://bsky.app/profile/bad-example.com" target="_blank" rel="noopener noreferrer">phil</a></p></li></ul>"`,
	);
});
