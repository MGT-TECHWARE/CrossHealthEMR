import { supabase } from './supabase'

export async function searchICD10(query, { limit = 20, commonOnly = false } = {}) {
  if (!query || query.length < 2) {
    // Return common PT codes when no query
    const { data, error } = await supabase
      .from('icd10_codes')
      .select('code, description, category, is_common_pt')
      .eq('is_common_pt', true)
      .order('code')
      .limit(limit)

    if (error) throw error
    return data
  }

  // Search by code prefix or full-text search on description
  const isCodeSearch = /^[A-Z]\d/i.test(query)

  if (isCodeSearch) {
    const { data, error } = await supabase
      .from('icd10_codes')
      .select('code, description, category, is_common_pt')
      .ilike('code', `${query}%`)
      .order('code')
      .limit(limit)

    if (error) throw error
    return data
  }

  // Text search on description
  const { data, error } = await supabase
    .from('icd10_codes')
    .select('code, description, category, is_common_pt')
    .or(`description.ilike.%${query}%,code.ilike.%${query}%`)
    .order('is_common_pt', { ascending: false })
    .order('code')
    .limit(limit)

  if (error) throw error
  return data
}
