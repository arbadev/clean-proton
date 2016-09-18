
import Service from 'proton-service'
import { isEmpty, last as lastItem } from 'lodash'
import Model from 'proton-mongoose-model'
import qs from 'querystring'

const defaultLimit = 10

export default class SearchService extends Service {
  * search(model, opts) {
    const limit = opts.params.limit ? parseFloat(opts.params.limit) : defaultLimit
    const criteria = buildCriteria.call(this, opts)
    const [collection, last] = yield [
      getCollection.call(this, model, criteria, limit),
      getLastBound.call(this, model, criteria),
    ]
    if (!isValidCollection.call(this, collection)) return { collection: [] }
    const pagination = getPagination.call(this, collection, last, opts)
    return { pagination, collection }
  }
}

function isValidCollection(collection) {
  return Array.isArray(collection) && !isEmpty(collection)
}

function getCollection(model, criteria, limit) {
  return model.aggregate([
    { $sort: { _id: 1 } },
    { $match: criteria },
    { $limit: limit },
  ])
}

function * getLastBound(model, criteria) {
  const [last] = yield model.aggregate([
    { $sort: { _id: -1 } },
    { $match: criteria },
    { $limit: 1 },
    { $project: { _id: 1 } },
  ])
  return last
}

function buildCriteria({ criteria = {}, params = {} }) {
  const { ObjectId } = Model.adapter.Types
  const gt = params.greaterThan
  const paginationCriteria = gt ? { _id: { $gt: ObjectId(gt) } } : {}
  return Object.assign({}, criteria, paginationCriteria)
}

function getPagination(collection, last, { uri, params }) {
  const gt = lastItem(collection)
  if (!gt._id.equals(last._id)) {
    const query = Object.assign(params, { greaterThan: gt._id.toString() })
    return `<${uri}?${qs.stringify(query)}>; rel="next"`
  }
  return ''
}
