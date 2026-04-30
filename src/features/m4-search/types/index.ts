import type { RecordStatus, SecrecyLevel } from '@/features/m3-records/types';

export interface SearchFilters {
  query:       string;
  docTypeId?:  string;
  categoryId?: string;
  status?:     RecordStatus;
  secrecy?:    SecrecyLevel;
  dateFrom?:   string;
  dateTo?:     string;
  department?: string;
}

export interface SearchResult {
  id:          string;
  refNo:       string;
  titleAr:     string;
  titleEn:     string;
  docTypeId:   string;
  categoryId:  string;
  boxId:       string;
  status:      RecordStatus;
  secrecy:     SecrecyLevel;
  archiveDate: string;
}

export interface SavedQuery {
  id:        string;
  name:      string;
  userId:    string;
  filters:   SearchFilters;
  createdAt: string;
}

export interface SearchState {
  filters:      SearchFilters;
  results:      SearchResult[];
  savedQueries: SavedQuery[];
  barcodeQuery: string;
  loading:      boolean;
}
