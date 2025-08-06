/**
 * GENERATED CODE - DO NOT MODIFY
 */
import {
  XrpcClient,
  type FetchHandler,
  type FetchHandlerOptions,
} from '@atproto/xrpc'
import { schemas } from './lexicons.js'
import { CID } from 'multiformats/cid'
import { type OmitKey, type Un$Typed } from './util.js'
import * as PubLeafletDocument from './types/pub/leaflet/document.js'
import * as PubLeafletBlocksCode from './types/pub/leaflet/blocks/code.js'
import * as PubLeafletBlocksHeader from './types/pub/leaflet/blocks/header.js'
import * as PubLeafletBlocksImage from './types/pub/leaflet/blocks/image.js'
import * as PubLeafletBlocksMath from './types/pub/leaflet/blocks/math.js'
import * as PubLeafletBlocksText from './types/pub/leaflet/blocks/text.js'
import * as PubLeafletBlocksUnorderedList from './types/pub/leaflet/blocks/unorderedList.js'
import * as PubLeafletBlocksWebsite from './types/pub/leaflet/blocks/website.js'
import * as PubLeafletPagesLinearDocument from './types/pub/leaflet/pages/linearDocument.js'
import * as PubLeafletRichtextFacet from './types/pub/leaflet/richtext/facet.js'
import * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
import * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
import * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
import * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
import * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
import * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
import * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'

export * as PubLeafletDocument from './types/pub/leaflet/document.js'
export * as PubLeafletBlocksCode from './types/pub/leaflet/blocks/code.js'
export * as PubLeafletBlocksHeader from './types/pub/leaflet/blocks/header.js'
export * as PubLeafletBlocksImage from './types/pub/leaflet/blocks/image.js'
export * as PubLeafletBlocksMath from './types/pub/leaflet/blocks/math.js'
export * as PubLeafletBlocksText from './types/pub/leaflet/blocks/text.js'
export * as PubLeafletBlocksUnorderedList from './types/pub/leaflet/blocks/unorderedList.js'
export * as PubLeafletBlocksWebsite from './types/pub/leaflet/blocks/website.js'
export * as PubLeafletPagesLinearDocument from './types/pub/leaflet/pages/linearDocument.js'
export * as PubLeafletRichtextFacet from './types/pub/leaflet/richtext/facet.js'
export * as ComAtprotoRepoCreateRecord from './types/com/atproto/repo/createRecord.js'
export * as ComAtprotoRepoDefs from './types/com/atproto/repo/defs.js'
export * as ComAtprotoRepoDeleteRecord from './types/com/atproto/repo/deleteRecord.js'
export * as ComAtprotoRepoGetRecord from './types/com/atproto/repo/getRecord.js'
export * as ComAtprotoRepoListRecords from './types/com/atproto/repo/listRecords.js'
export * as ComAtprotoRepoPutRecord from './types/com/atproto/repo/putRecord.js'
export * as ComAtprotoRepoStrongRef from './types/com/atproto/repo/strongRef.js'

export const PUB_LEAFLET_PAGES = {
  LinearDocumentTextAlignLeft: 'pub.leaflet.pages.linearDocument#textAlignLeft',
  LinearDocumentTextAlignCenter:
    'pub.leaflet.pages.linearDocument#textAlignCenter',
  LinearDocumentTextAlignRight:
    'pub.leaflet.pages.linearDocument#textAlignRight',
}

export class AtpBaseClient extends XrpcClient {
  pub: PubNS
  com: ComNS

  constructor(options: FetchHandler | FetchHandlerOptions) {
    super(options, schemas)
    this.pub = new PubNS(this)
    this.com = new ComNS(this)
  }

  /** @deprecated use `this` instead */
  get xrpc(): XrpcClient {
    return this
  }
}

export class PubNS {
  _client: XrpcClient
  leaflet: PubLeafletNS

  constructor(client: XrpcClient) {
    this._client = client
    this.leaflet = new PubLeafletNS(client)
  }
}

export class PubLeafletNS {
  _client: XrpcClient
  document: PubLeafletDocumentRecord
  blocks: PubLeafletBlocksNS
  pages: PubLeafletPagesNS
  richtext: PubLeafletRichtextNS

  constructor(client: XrpcClient) {
    this._client = client
    this.blocks = new PubLeafletBlocksNS(client)
    this.pages = new PubLeafletPagesNS(client)
    this.richtext = new PubLeafletRichtextNS(client)
    this.document = new PubLeafletDocumentRecord(client)
  }
}

export class PubLeafletBlocksNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class PubLeafletPagesNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class PubLeafletRichtextNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }
}

export class PubLeafletDocumentRecord {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  async list(
    params: OmitKey<ComAtprotoRepoListRecords.QueryParams, 'collection'>,
  ): Promise<{
    cursor?: string
    records: { uri: string; value: PubLeafletDocument.Record }[]
  }> {
    const res = await this._client.call('com.atproto.repo.listRecords', {
      collection: 'pub.leaflet.document',
      ...params,
    })
    return res.data
  }

  async get(
    params: OmitKey<ComAtprotoRepoGetRecord.QueryParams, 'collection'>,
  ): Promise<{ uri: string; cid: string; value: PubLeafletDocument.Record }> {
    const res = await this._client.call('com.atproto.repo.getRecord', {
      collection: 'pub.leaflet.document',
      ...params,
    })
    return res.data
  }

  async create(
    params: OmitKey<
      ComAtprotoRepoCreateRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<PubLeafletDocument.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'pub.leaflet.document'
    const res = await this._client.call(
      'com.atproto.repo.createRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async put(
    params: OmitKey<
      ComAtprotoRepoPutRecord.InputSchema,
      'collection' | 'record'
    >,
    record: Un$Typed<PubLeafletDocument.Record>,
    headers?: Record<string, string>,
  ): Promise<{ uri: string; cid: string }> {
    const collection = 'pub.leaflet.document'
    const res = await this._client.call(
      'com.atproto.repo.putRecord',
      undefined,
      { collection, ...params, record: { ...record, $type: collection } },
      { encoding: 'application/json', headers },
    )
    return res.data
  }

  async delete(
    params: OmitKey<ComAtprotoRepoDeleteRecord.InputSchema, 'collection'>,
    headers?: Record<string, string>,
  ): Promise<void> {
    await this._client.call(
      'com.atproto.repo.deleteRecord',
      undefined,
      { collection: 'pub.leaflet.document', ...params },
      { headers },
    )
  }
}

export class ComNS {
  _client: XrpcClient
  atproto: ComAtprotoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.atproto = new ComAtprotoNS(client)
  }
}

export class ComAtprotoNS {
  _client: XrpcClient
  repo: ComAtprotoRepoNS

  constructor(client: XrpcClient) {
    this._client = client
    this.repo = new ComAtprotoRepoNS(client)
  }
}

export class ComAtprotoRepoNS {
  _client: XrpcClient

  constructor(client: XrpcClient) {
    this._client = client
  }

  createRecord(
    data?: ComAtprotoRepoCreateRecord.InputSchema,
    opts?: ComAtprotoRepoCreateRecord.CallOptions,
  ): Promise<ComAtprotoRepoCreateRecord.Response> {
    return this._client
      .call('com.atproto.repo.createRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoCreateRecord.toKnownErr(e)
      })
  }

  deleteRecord(
    data?: ComAtprotoRepoDeleteRecord.InputSchema,
    opts?: ComAtprotoRepoDeleteRecord.CallOptions,
  ): Promise<ComAtprotoRepoDeleteRecord.Response> {
    return this._client
      .call('com.atproto.repo.deleteRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoDeleteRecord.toKnownErr(e)
      })
  }

  getRecord(
    params?: ComAtprotoRepoGetRecord.QueryParams,
    opts?: ComAtprotoRepoGetRecord.CallOptions,
  ): Promise<ComAtprotoRepoGetRecord.Response> {
    return this._client
      .call('com.atproto.repo.getRecord', params, undefined, opts)
      .catch((e) => {
        throw ComAtprotoRepoGetRecord.toKnownErr(e)
      })
  }

  listRecords(
    params?: ComAtprotoRepoListRecords.QueryParams,
    opts?: ComAtprotoRepoListRecords.CallOptions,
  ): Promise<ComAtprotoRepoListRecords.Response> {
    return this._client.call(
      'com.atproto.repo.listRecords',
      params,
      undefined,
      opts,
    )
  }

  putRecord(
    data?: ComAtprotoRepoPutRecord.InputSchema,
    opts?: ComAtprotoRepoPutRecord.CallOptions,
  ): Promise<ComAtprotoRepoPutRecord.Response> {
    return this._client
      .call('com.atproto.repo.putRecord', opts?.qp, data, opts)
      .catch((e) => {
        throw ComAtprotoRepoPutRecord.toKnownErr(e)
      })
  }
}
