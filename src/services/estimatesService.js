import { supabase } from '../lib/supabase.js'

// Helper function to generate a random ID
function cryptoRandomId() {
  try {
    const a = new Uint8Array(16)
    crypto.getRandomValues(a)
    return Array.from(a, b => b.toString(16).padStart(2, "0")).join("")
  } catch {
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2)
  }
}

// Helper function to convert estimate data for database storage
function formatEstimateForDB(estimate) {
  return {
    id: estimate.id || cryptoRandomId(),
    estimate_type: estimate.estimateType,
    claim_number: estimate.claimNumber,
    client_name: estimate.clientName,
    task_number: estimate.taskNumber,
    date_received: estimate.dateReceived,
    time_received: estimate.timeReceived,
    date_returned: estimate.dateReturned || null,
    time_returned: estimate.timeReturned || null,
    final_amount: estimate.finalAmount || null,
    final_amount_cents: estimate.finalAmountCents || 0,
    status: estimate.status,
    billed: estimate.billed,
    created_at_iso: estimate.createdAtISO || new Date().toISOString()
  }
}

// Helper function to convert database data back to app format
function formatEstimateFromDB(dbEstimate) {
  return {
    id: dbEstimate.id,
    estimateType: dbEstimate.estimate_type,
    claimNumber: dbEstimate.claim_number,
    clientName: dbEstimate.client_name,
    taskNumber: dbEstimate.task_number,
    dateReceived: dbEstimate.date_received,
    timeReceived: dbEstimate.time_received,
    dateReturned: dbEstimate.date_returned,
    timeReturned: dbEstimate.time_returned,
    finalAmount: dbEstimate.final_amount,
    finalAmountCents: dbEstimate.final_amount_cents,
    status: dbEstimate.status,
    billed: dbEstimate.billed,
    createdAtISO: dbEstimate.created_at_iso
  }
}

// Get all estimates
export async function getAllEstimates() {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .order('created_at_iso', { ascending: false })

    if (error) {
      console.error('Error fetching estimates:', error)
      throw error
    }

    return data.map(formatEstimateFromDB)
  } catch (error) {
    console.error('Error in getAllEstimates:', error)
    throw error
  }
}

// Create a new estimate
export async function createEstimate(estimate) {
  try {
    const formattedEstimate = formatEstimateForDB(estimate)
    
    const { data, error } = await supabase
      .from('estimates')
      .insert([formattedEstimate])
      .select()
      .single()

    if (error) {
      console.error('Error creating estimate:', error)
      throw error
    }

    return formatEstimateFromDB(data)
  } catch (error) {
    console.error('Error in createEstimate:', error)
    throw error
  }
}

// Update an existing estimate
export async function updateEstimate(id, updates) {
  try {
    const formattedUpdates = {}
    
    // Map the updates to database column names
    if (updates.estimateType !== undefined) formattedUpdates.estimate_type = updates.estimateType
    if (updates.claimNumber !== undefined) formattedUpdates.claim_number = updates.claimNumber
    if (updates.clientName !== undefined) formattedUpdates.client_name = updates.clientName
    if (updates.taskNumber !== undefined) formattedUpdates.task_number = updates.taskNumber
    if (updates.dateReceived !== undefined) formattedUpdates.date_received = updates.dateReceived
    if (updates.timeReceived !== undefined) formattedUpdates.time_received = updates.timeReceived
    if (updates.dateReturned !== undefined) formattedUpdates.date_returned = updates.dateReturned
    if (updates.timeReturned !== undefined) formattedUpdates.time_returned = updates.timeReturned
    if (updates.finalAmount !== undefined) formattedUpdates.final_amount = updates.finalAmount
    if (updates.finalAmountCents !== undefined) formattedUpdates.final_amount_cents = updates.finalAmountCents
    if (updates.status !== undefined) formattedUpdates.status = updates.status
    if (updates.billed !== undefined) formattedUpdates.billed = updates.billed

    const { data, error } = await supabase
      .from('estimates')
      .update(formattedUpdates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating estimate:', error)
      throw error
    }

    return formatEstimateFromDB(data)
  } catch (error) {
    console.error('Error in updateEstimate:', error)
    throw error
  }
}

// Delete an estimate
export async function deleteEstimate(id) {
  try {
    const { error } = await supabase
      .from('estimates')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting estimate:', error)
      throw error
    }

    return true
  } catch (error) {
    console.error('Error in deleteEstimate:', error)
    throw error
  }
}

// Get estimates by date range
export async function getEstimatesByDateRange(startDate, endDate) {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .gte('date_returned', startDate)
      .lte('date_returned', endDate)
      .order('created_at_iso', { ascending: false })

    if (error) {
      console.error('Error fetching estimates by date range:', error)
      throw error
    }

    return data.map(formatEstimateFromDB)
  } catch (error) {
    console.error('Error in getEstimatesByDateRange:', error)
    throw error
  }
}

// Get estimates by status
export async function getEstimatesByStatus(status) {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .eq('status', status)
      .order('created_at_iso', { ascending: false })

    if (error) {
      console.error('Error fetching estimates by status:', error)
      throw error
    }

    return data.map(formatEstimateFromDB)
  } catch (error) {
    console.error('Error in getEstimatesByStatus:', error)
    throw error
  }
}

// Get final estimates that are not billed
export async function getUnbilledFinalEstimates() {
  try {
    const { data, error } = await supabase
      .from('estimates')
      .select('*')
      .eq('estimate_type', 'Final')
      .eq('billed', false)
      .order('created_at_iso', { ascending: false })

    if (error) {
      console.error('Error fetching unbilled final estimates:', error)
      throw error
    }

    return data.map(formatEstimateFromDB)
  } catch (error) {
    console.error('Error in getUnbilledFinalEstimates:', error)
    throw error
  }
}

// Subscribe to real-time changes
export function subscribeToEstimates(callback) {
  return supabase
    .channel('estimates_changes')
    .on('postgres_changes', 
      { 
        event: '*', 
        schema: 'public', 
        table: 'estimates' 
      }, 
      (payload) => {
        console.log('Real-time update received:', payload)
        callback(payload)
      }
    )
    .subscribe()
}
