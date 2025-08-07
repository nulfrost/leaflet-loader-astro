import { z } from "astro/zod";

export const LeafletDocumentSchema = z.object({
	rkey: z.string(),
	cid: z.string(),
	title: z.string(),
	description: z.string(),
	author: z.string(),
	publication: z.string(),
	publishedAt: z.string(),
});
