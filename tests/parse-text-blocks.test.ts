import { expect, test } from "vitest";
import { parseTextBlock } from "../lib/utils";

test("should correctly parse a text block without facets", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [],
		plaintext: "just plaintext no facets",
	});

	expect(html).toMatchInlineSnapshot(`"<p>just plaintext no facets</p>"`);
});

test("should correctly parse a text block with bolded text", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [
			{
				index: {
					byteEnd: 11,
					byteStart: 0,
				},
				features: [
					{
						$type: "pub.leaflet.richtext.facet#bold",
					},
				],
			},
		],
		plaintext: "bolded text with some plaintext",
	});

	expect(html).toMatchInlineSnapshot(
		`"<p><b>bolded text</b> with some plaintext</p>"`,
	);
});

test("should correctly parse a text block with an inline link", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [
			{
				index: {
					byteEnd: 27,
					byteStart: 0,
				},
				features: [
					{
						uri: "https://blacksky.community/",
						$type: "pub.leaflet.richtext.facet#link",
					},
				],
			},
		],
		plaintext: "https://blacksky.community/",
	});

	expect(html).toMatchInlineSnapshot(
		`"<p><a href="https://blacksky.community/" target="_blank" rel="noopener noreferrer">https://blacksky.community/</a></p>"`,
	);
});

test("should correctly parse a text block with strikethrough text", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [
			{
				index: {
					byteEnd: 13,
					byteStart: 0,
				},
				features: [
					{
						$type: "pub.leaflet.richtext.facet#strikethrough",
					},
				],
			},
		],
		plaintext: "strikethrough text with some plaintext",
	});

	expect(html).toMatchInlineSnapshot(
		`"<p><s>strikethrough</s> text with some plaintext</p>"`,
	);
});

test("should correctly parse a text block with underlined text", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [
			{
				index: {
					byteEnd: 10,
					byteStart: 0,
				},
				features: [
					{
						$type: "pub.leaflet.richtext.facet#underline",
					},
				],
			},
		],
		plaintext: "underlined text with some plaintext",
	});

	expect(html).toMatchInlineSnapshot(
		`"<p><span style="text-decoration:underline;">underlined</span> text with some plaintext</p>"`,
	);
});

test("should correctly parse a text block with italicized text", () => {
	const html = parseTextBlock({
		$type: "pub.leaflet.blocks.text",
		facets: [
			{
				index: {
					byteEnd: 10,
					byteStart: 0,
				},
				features: [
					{
						$type: "pub.leaflet.richtext.facet#italic",
					},
				],
			},
		],
		plaintext: "italicized text with some plaintext",
	});

	expect(html).toMatchInlineSnapshot(
		`"<p><i>italicized</i> text with some plaintext</p>"`,
	);
});
