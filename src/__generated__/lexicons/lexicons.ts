/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  type LexiconDoc,
  Lexicons,
  ValidationError,
  type ValidationResult,
} from '@atproto/lexicon'
import { type $Typed, is$typed, maybe$typed } from './util.js'

export const schemaDict = {
  PubLeafletDocument: {
    lexicon: 1,
    id: 'pub.leaflet.document',
    revision: 1,
    description: 'A lexicon for long form rich media documents',
    defs: {
      main: {
        type: 'record',
        key: 'tid',
        description: 'Record containing a document',
        record: {
          type: 'object',
          required: ['pages', 'author', 'title', 'publication'],
          properties: {
            title: {
              type: 'string',
              maxLength: 1280,
              maxGraphemes: 128,
            },
            postRef: {
              type: 'ref',
              ref: 'lex:com.atproto.repo.strongRef',
            },
            description: {
              type: 'string',
              maxLength: 3000,
              maxGraphemes: 300,
            },
            publishedAt: {
              type: 'string',
              format: 'datetime',
            },
            publication: {
              type: 'string',
              format: 'at-uri',
            },
            author: {
              type: 'string',
              format: 'at-identifier',
            },
            pages: {
              type: 'array',
              items: {
                type: 'union',
                refs: ['lex:pub.leaflet.pages.linearDocument'],
              },
            },
          },
        },
      },
    },
  },
  PubLeafletBlocksCode: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.code',
    defs: {
      main: {
        type: 'object',
        required: ['plaintext'],
        properties: {
          plaintext: {
            type: 'string',
          },
          language: {
            type: 'string',
          },
          syntaxHighlightingTheme: {
            type: 'string',
          },
        },
      },
    },
  },
  PubLeafletBlocksHeader: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.header',
    defs: {
      main: {
        type: 'object',
        required: ['plaintext'],
        properties: {
          level: {
            type: 'integer',
            minimum: 1,
            maximum: 6,
          },
          plaintext: {
            type: 'string',
          },
          facets: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:pub.leaflet.richtext.facet',
            },
          },
        },
      },
    },
  },
  PubLeafletBlocksImage: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.image',
    defs: {
      main: {
        type: 'object',
        required: ['image', 'aspectRatio'],
        properties: {
          image: {
            type: 'blob',
            accept: ['image/*'],
            maxSize: 1000000,
          },
          alt: {
            type: 'string',
            description:
              'Alt text description of the image, for accessibility.',
          },
          aspectRatio: {
            type: 'ref',
            ref: 'lex:pub.leaflet.blocks.image#aspectRatio',
          },
        },
      },
      aspectRatio: {
        type: 'object',
        required: ['width', 'height'],
        properties: {
          width: {
            type: 'integer',
          },
          height: {
            type: 'integer',
          },
        },
      },
    },
  },
  PubLeafletBlocksMath: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.math',
    defs: {
      main: {
        type: 'object',
        required: ['tex'],
        properties: {
          tex: {
            type: 'string',
          },
        },
      },
    },
  },
  PubLeafletBlocksText: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.text',
    defs: {
      main: {
        type: 'object',
        required: ['plaintext'],
        properties: {
          plaintext: {
            type: 'string',
          },
          facets: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:pub.leaflet.richtext.facet',
            },
          },
        },
      },
    },
  },
  PubLeafletBlocksUnorderedList: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.unorderedList',
    defs: {
      main: {
        type: 'object',
        required: ['children'],
        properties: {
          children: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:pub.leaflet.blocks.unorderedList#listItem',
            },
          },
        },
      },
      listItem: {
        type: 'object',
        required: ['content'],
        properties: {
          content: {
            type: 'union',
            refs: [
              'lex:pub.leaflet.blocks.text',
              'lex:pub.leaflet.blocks.header',
              'lex:pub.leaflet.blocks.image',
            ],
          },
          children: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:pub.leaflet.blocks.unorderedList#listItem',
            },
          },
        },
      },
    },
  },
  PubLeafletBlocksWebsite: {
    lexicon: 1,
    id: 'pub.leaflet.blocks.website',
    defs: {
      main: {
        type: 'object',
        required: ['src'],
        properties: {
          previewImage: {
            type: 'blob',
            accept: ['image/*'],
            maxSize: 1000000,
          },
          title: {
            type: 'string',
          },
          description: {
            type: 'string',
          },
          src: {
            type: 'string',
            format: 'uri',
          },
        },
      },
    },
  },
  PubLeafletPagesLinearDocument: {
    lexicon: 1,
    id: 'pub.leaflet.pages.linearDocument',
    defs: {
      main: {
        type: 'object',
        properties: {
          blocks: {
            type: 'array',
            items: {
              type: 'ref',
              ref: 'lex:pub.leaflet.pages.linearDocument#block',
            },
          },
        },
      },
      block: {
        type: 'object',
        required: ['block'],
        properties: {
          block: {
            type: 'union',
            refs: [
              'lex:pub.leaflet.blocks.text',
              'lex:pub.leaflet.blocks.header',
              'lex:pub.leaflet.blocks.image',
              'lex:pub.leaflet.blocks.unorderedList',
              'lex:pub.leaflet.blocks.website',
              'lex:pub.leaflet.blocks.math',
              'lex:pub.leaflet.blocks.code',
            ],
          },
          alignment: {
            type: 'string',
            knownValues: [
              'lex:pub.leaflet.pages.linearDocument#textAlignLeft',
              'lex:pub.leaflet.pages.linearDocument#textAlignCenter',
              'lex:pub.leaflet.pages.linearDocument#textAlignRight',
            ],
          },
        },
      },
      textAlignLeft: {
        type: 'token',
      },
      textAlignCenter: {
        type: 'token',
      },
      textAlignRight: {
        type: 'token',
      },
    },
  },
  PubLeafletRichtextFacet: {
    lexicon: 1,
    id: 'pub.leaflet.richtext.facet',
    defs: {
      main: {
        type: 'object',
        description: 'Annotation of a sub-string within rich text.',
        required: ['index', 'features'],
        properties: {
          index: {
            type: 'ref',
            ref: 'lex:pub.leaflet.richtext.facet#byteSlice',
          },
          features: {
            type: 'array',
            items: {
              type: 'union',
              refs: [
                'lex:pub.leaflet.richtext.facet#link',
                'lex:pub.leaflet.richtext.facet#code',
                'lex:pub.leaflet.richtext.facet#highlight',
                'lex:pub.leaflet.richtext.facet#underline',
                'lex:pub.leaflet.richtext.facet#strikethrough',
                'lex:pub.leaflet.richtext.facet#id',
                'lex:pub.leaflet.richtext.facet#bold',
                'lex:pub.leaflet.richtext.facet#italic',
              ],
            },
          },
        },
      },
      byteSlice: {
        type: 'object',
        description:
          'Specifies the sub-string range a facet feature applies to. Start index is inclusive, end index is exclusive. Indices are zero-indexed, counting bytes of the UTF-8 encoded text. NOTE: some languages, like Javascript, use UTF-16 or Unicode codepoints for string slice indexing; in these languages, convert to byte arrays before working with facets.',
        required: ['byteStart', 'byteEnd'],
        properties: {
          byteStart: {
            type: 'integer',
            minimum: 0,
          },
          byteEnd: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
      link: {
        type: 'object',
        description:
          'Facet feature for a URL. The text URL may have been simplified or truncated, but the facet reference should be a complete URL.',
        required: ['uri'],
        properties: {
          uri: {
            type: 'string',
            format: 'uri',
          },
        },
      },
      code: {
        type: 'object',
        description: 'Facet feature for inline code.',
        required: [],
        properties: {},
      },
      highlight: {
        type: 'object',
        description: 'Facet feature for highlighted text.',
        required: [],
        properties: {},
      },
      underline: {
        type: 'object',
        description: 'Facet feature for underline markup',
        required: [],
        properties: {},
      },
      strikethrough: {
        type: 'object',
        description: 'Facet feature for strikethrough markup',
        required: [],
        properties: {},
      },
      id: {
        type: 'object',
        description:
          'Facet feature for an identifier. Used for linking to a segment',
        required: [],
        properties: {
          id: {
            type: 'string',
          },
        },
      },
      bold: {
        type: 'object',
        description: 'Facet feature for bold text',
        required: [],
        properties: {},
      },
      italic: {
        type: 'object',
        description: 'Facet feature for italic text',
        required: [],
        properties: {},
      },
    },
  },
  ComAtprotoRepoStrongRef: {
    lexicon: 1,
    id: 'com.atproto.repo.strongRef',
    description: 'A URI with a content-hash fingerprint.',
    defs: {
      main: {
        type: 'object',
        required: ['uri', 'cid'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
        },
      },
    },
  },
} as const satisfies Record<string, LexiconDoc>
export const schemas = Object.values(schemaDict) satisfies LexiconDoc[]
export const lexicons: Lexicons = new Lexicons(schemas)

export function validate<T extends { $type: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType: true,
): ValidationResult<T>
export function validate<T extends { $type?: string }>(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: false,
): ValidationResult<T>
export function validate(
  v: unknown,
  id: string,
  hash: string,
  requiredType?: boolean,
): ValidationResult {
  return (requiredType ? is$typed : maybe$typed)(v, id, hash)
    ? lexicons.validate(`${id}#${hash}`, v)
    : {
        success: false,
        error: new ValidationError(
          `Must be an object with "${hash === 'main' ? id : `${id}#${hash}`}" $type property`,
        ),
      }
}

export const ids = {
  PubLeafletDocument: 'pub.leaflet.document',
  PubLeafletBlocksCode: 'pub.leaflet.blocks.code',
  PubLeafletBlocksHeader: 'pub.leaflet.blocks.header',
  PubLeafletBlocksImage: 'pub.leaflet.blocks.image',
  PubLeafletBlocksMath: 'pub.leaflet.blocks.math',
  PubLeafletBlocksText: 'pub.leaflet.blocks.text',
  PubLeafletBlocksUnorderedList: 'pub.leaflet.blocks.unorderedList',
  PubLeafletBlocksWebsite: 'pub.leaflet.blocks.website',
  PubLeafletPagesLinearDocument: 'pub.leaflet.pages.linearDocument',
  PubLeafletRichtextFacet: 'pub.leaflet.richtext.facet',
  ComAtprotoRepoStrongRef: 'com.atproto.repo.strongRef',
} as const
