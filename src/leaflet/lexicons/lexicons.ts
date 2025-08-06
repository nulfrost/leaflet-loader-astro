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
  ComAtprotoRepoCreateRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.createRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Create a single new repository record. Requires auth, implemented by PDS.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'record'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
                maxLength: 512,
              },
              validate: {
                type: 'boolean',
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: 'unknown',
                description: 'The record itself. Must contain a $type field.',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
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
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
              validationStatus: {
                type: 'string',
                knownValues: ['valid', 'unknown'],
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
            description:
              "Indicates that 'swapCommit' didn't match current repo commit.",
          },
        ],
      },
    },
  },
  ComAtprotoRepoDefs: {
    lexicon: 1,
    id: 'com.atproto.repo.defs',
    defs: {
      commitMeta: {
        type: 'object',
        required: ['cid', 'rev'],
        properties: {
          cid: {
            type: 'string',
            format: 'cid',
          },
          rev: {
            type: 'string',
            format: 'tid',
          },
        },
      },
    },
  },
  ComAtprotoRepoDeleteRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.deleteRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          "Delete a repository record, or ensure it doesn't exist. Requires auth, implemented by PDS.",
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'rkey'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
              },
              swapRecord: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous record by CID.',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            properties: {
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
          },
        ],
      },
    },
  },
  ComAtprotoRepoGetRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.getRecord',
    defs: {
      main: {
        type: 'query',
        description:
          'Get a single record from a repository. Does not require auth.',
        parameters: {
          type: 'params',
          required: ['repo', 'collection', 'rkey'],
          properties: {
            repo: {
              type: 'string',
              format: 'at-identifier',
              description: 'The handle or DID of the repo.',
            },
            collection: {
              type: 'string',
              format: 'nsid',
              description: 'The NSID of the record collection.',
            },
            rkey: {
              type: 'string',
              description: 'The Record Key.',
              format: 'record-key',
            },
            cid: {
              type: 'string',
              format: 'cid',
              description:
                'The CID of the version of the record. If not specified, then return the most recent version.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['uri', 'value'],
            properties: {
              uri: {
                type: 'string',
                format: 'at-uri',
              },
              cid: {
                type: 'string',
                format: 'cid',
              },
              value: {
                type: 'unknown',
              },
            },
          },
        },
        errors: [
          {
            name: 'RecordNotFound',
          },
        ],
      },
    },
  },
  ComAtprotoRepoListRecords: {
    lexicon: 1,
    id: 'com.atproto.repo.listRecords',
    defs: {
      main: {
        type: 'query',
        description:
          'List a range of records in a repository, matching a specific collection. Does not require auth.',
        parameters: {
          type: 'params',
          required: ['repo', 'collection'],
          properties: {
            repo: {
              type: 'string',
              format: 'at-identifier',
              description: 'The handle or DID of the repo.',
            },
            collection: {
              type: 'string',
              format: 'nsid',
              description: 'The NSID of the record type.',
            },
            limit: {
              type: 'integer',
              minimum: 1,
              maximum: 100,
              default: 50,
              description: 'The number of records to return.',
            },
            cursor: {
              type: 'string',
            },
            rkeyStart: {
              type: 'string',
              description:
                'DEPRECATED: The lowest sort-ordered rkey to start from (exclusive)',
            },
            rkeyEnd: {
              type: 'string',
              description:
                'DEPRECATED: The highest sort-ordered rkey to stop at (exclusive)',
            },
            reverse: {
              type: 'boolean',
              description: 'Flag to reverse the order of the returned records.',
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['records'],
            properties: {
              cursor: {
                type: 'string',
              },
              records: {
                type: 'array',
                items: {
                  type: 'ref',
                  ref: 'lex:com.atproto.repo.listRecords#record',
                },
              },
            },
          },
        },
      },
      record: {
        type: 'object',
        required: ['uri', 'cid', 'value'],
        properties: {
          uri: {
            type: 'string',
            format: 'at-uri',
          },
          cid: {
            type: 'string',
            format: 'cid',
          },
          value: {
            type: 'unknown',
          },
        },
      },
    },
  },
  ComAtprotoRepoPutRecord: {
    lexicon: 1,
    id: 'com.atproto.repo.putRecord',
    defs: {
      main: {
        type: 'procedure',
        description:
          'Write a repository record, creating or updating it as needed. Requires auth, implemented by PDS.',
        input: {
          encoding: 'application/json',
          schema: {
            type: 'object',
            required: ['repo', 'collection', 'rkey', 'record'],
            nullable: ['swapRecord'],
            properties: {
              repo: {
                type: 'string',
                format: 'at-identifier',
                description:
                  'The handle or DID of the repo (aka, current account).',
              },
              collection: {
                type: 'string',
                format: 'nsid',
                description: 'The NSID of the record collection.',
              },
              rkey: {
                type: 'string',
                format: 'record-key',
                description: 'The Record Key.',
                maxLength: 512,
              },
              validate: {
                type: 'boolean',
                description:
                  "Can be set to 'false' to skip Lexicon schema validation of record data, 'true' to require it, or leave unset to validate only for known Lexicons.",
              },
              record: {
                type: 'unknown',
                description: 'The record to write.',
              },
              swapRecord: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous record by CID. WARNING: nullable and optional field; may cause problems with golang implementation',
              },
              swapCommit: {
                type: 'string',
                format: 'cid',
                description:
                  'Compare and swap with the previous commit by CID.',
              },
            },
          },
        },
        output: {
          encoding: 'application/json',
          schema: {
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
              commit: {
                type: 'ref',
                ref: 'lex:com.atproto.repo.defs#commitMeta',
              },
              validationStatus: {
                type: 'string',
                knownValues: ['valid', 'unknown'],
              },
            },
          },
        },
        errors: [
          {
            name: 'InvalidSwap',
          },
        ],
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
  ComAtprotoRepoCreateRecord: 'com.atproto.repo.createRecord',
  ComAtprotoRepoDefs: 'com.atproto.repo.defs',
  ComAtprotoRepoDeleteRecord: 'com.atproto.repo.deleteRecord',
  ComAtprotoRepoGetRecord: 'com.atproto.repo.getRecord',
  ComAtprotoRepoListRecords: 'com.atproto.repo.listRecords',
  ComAtprotoRepoPutRecord: 'com.atproto.repo.putRecord',
  ComAtprotoRepoStrongRef: 'com.atproto.repo.strongRef',
} as const
