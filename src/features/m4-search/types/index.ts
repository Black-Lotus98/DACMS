export interface SearchFilters { query: string; docType?: string; secrecy?: string }
export interface SearchResult { id: string; refNo: string; title: string; locationCode: string; secrecy: string }
export interface SavedQuery { id: string; name: string; filters: SearchFilters }
export interface SearchState { filters: SearchFilters; results: SearchResult[]; savedQueries: SavedQuery[]; loading: boolean }
