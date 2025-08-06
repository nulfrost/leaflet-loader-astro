import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import * as PubLeafletRichtextFacet from "../richtext/facet.js";

const _mainSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("pub.leaflet.blocks.header"),
  ),
  get facets() {
    return /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.array(PubLeafletRichtextFacet.mainSchema),
    );
  },
  level: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.integer(), [
      /*#__PURE__*/ v.integerRange(1, 6),
    ]),
  ),
  plaintext: /*#__PURE__*/ v.string(),
});

type main$schematype = typeof _mainSchema;

export interface mainSchema extends main$schematype {}

export const mainSchema = _mainSchema as mainSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}
