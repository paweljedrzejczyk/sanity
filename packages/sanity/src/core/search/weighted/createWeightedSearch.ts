import {type SanityClient} from '@sanity/client'
import {sortBy} from 'lodash'
import {type Observable, of} from 'rxjs'
import {map, switchMap, tap} from 'rxjs/operators'

import {removeDupes} from '../../util/draftUtils'
import {applyWeights} from './applyWeights'
import {createSearchQuery} from './createSearchQuery'
import {
  type SearchableType,
  type SearchHit,
  type SearchOptions,
  type SearchTerms,
  type WeightedHit,
  type WeightedSearchOptions,
} from './types'

function getSearchTerms(searchParams: string | SearchTerms, types: SearchableType[]) {
  if (typeof searchParams === 'string') {
    return {
      query: searchParams,
      types: types,
    }
  }
  return searchParams.types.length ? searchParams : {...searchParams, types}
}

/**
 * @internal
 */
export function createWeightedSearch(
  types: SearchableType[],
  client: SanityClient,
  commonOpts: WeightedSearchOptions = {},
): (
  searchTerms: string | SearchTerms,
  searchOpts?: SearchOptions,
) => Observable<{hits: Observable<WeightedHit[]>}> {
  // Search currently supports both strings (reference + cross dataset reference inputs)
  // or a SearchTerms object (omnisearch).
  return function search(searchParams, searchOpts = {}) {
    const searchTerms = getSearchTerms(searchParams, types)

    const {query, params, options, searchSpec, terms} = createSearchQuery(searchTerms, {
      ...commonOpts,
      ...searchOpts,
    })

    return client.observable.fetch(query, params, options).pipe(
      commonOpts.unique ? map(removeDupes) : tap(),
      // Assign weighting and scores based on current search terms.
      // No scores will be assigned when terms are empty.
      map((hits: SearchHit[]) => applyWeights(searchSpec, hits, terms)),
      // Optionally skip client-side score sorting.
      // This can be relevant when ordering results by specific fields, especially dates.
      searchOpts?.skipSortByScore ? tap() : map((hits) => sortBy(hits, (hit) => -hit.score)),
      switchMap((hits) =>
        of({
          hits: of(hits),
        }),
      ),
    )
  }
}
