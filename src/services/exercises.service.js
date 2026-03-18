import { supabase } from './supabase'

export async function getAllExercises(filters = {}) {
  let query = supabase
    .from('exercise_library')
    .select('*')

  if (filters.body_part) {
    query = query.contains('body_part', [filters.body_part])
  }

  if (filters.difficulty) {
    query = query.eq('difficulty', filters.difficulty)
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`
    )
  }

  query = query.order('name', { ascending: true })

  const { data, error } = await query

  if (error) {
    throw error
  }

  return data
}

export async function createExercise(exerciseData) {
  const { data, error } = await supabase
    .from('exercise_library')
    .insert(exerciseData)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateExercise(id, updates) {
  const { data, error } = await supabase
    .from('exercise_library')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getExerciseById(id) {
  const { data, error } = await supabase
    .from('exercise_library')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    throw error
  }

  return data
}
