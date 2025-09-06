import { useState, useEffect, useCallback } from 'react'
import { 
  getAllEstimates, 
  createEstimate, 
  updateEstimate, 
  deleteEstimate,
  subscribeToEstimates 
} from '../services/estimatesService.js'

export function useEstimates() {
  const [estimates, setEstimates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Load estimates from Supabase
  const loadEstimates = useCallback(async () => {
    try {
      console.log('Loading estimates from Supabase...')
      setLoading(true)
      setError(null)
      const data = await getAllEstimates()
      console.log('Loaded estimates:', data)
      setEstimates(data)
    } catch (err) {
      console.error('Failed to load estimates:', err)
      setError(err.message || 'Failed to load estimates')
    } finally {
      setLoading(false)
    }
  }, [])

  // Add a new estimate
  const addEstimate = useCallback(async (estimateData) => {
    try {
      setError(null)
      const newEstimate = await createEstimate(estimateData)
      setEstimates(prev => [newEstimate, ...prev])
      return newEstimate
    } catch (err) {
      console.error('Failed to create estimate:', err)
      setError(err.message || 'Failed to create estimate')
      throw err
    }
  }, [])

  // Update an existing estimate
  const updateEstimateById = useCallback(async (id, updates) => {
    try {
      setError(null)
      const updatedEstimate = await updateEstimate(id, updates)
      setEstimates(prev => 
        prev.map(est => est.id === id ? updatedEstimate : est)
      )
      return updatedEstimate
    } catch (err) {
      console.error('Failed to update estimate:', err)
      setError(err.message || 'Failed to update estimate')
      throw err
    }
  }, [])

  // Delete an estimate
  const removeEstimate = useCallback(async (id) => {
    try {
      setError(null)
      await deleteEstimate(id)
      setEstimates(prev => prev.filter(est => est.id !== id))
    } catch (err) {
      console.error('Failed to delete estimate:', err)
      setError(err.message || 'Failed to delete estimate')
      throw err
    }
  }, [])

  // Mark an estimate as billed
  const markBilled = useCallback(async (id) => {
    return updateEstimateById(id, { billed: true })
  }, [updateEstimateById])

  // Update estimate status
  const updateStatus = useCallback(async (id, status) => {
    const updates = { status }
    
    // If marking as done, set the return date and time
    if (status === 'Done') {
      const now = new Date()
      updates.dateReturned = now.toISOString().split('T')[0]
      updates.timeReturned = now.toTimeString().slice(0, 5)
    }
    
    return updateEstimateById(id, updates)
  }, [updateEstimateById])

  // Update final amount
  const updateFinalAmount = useCallback(async (id, finalAmount) => {
    const finalAmountCents = finalAmount 
      ? Math.round(Number(String(finalAmount).replace(/[^0-9.\-]/g, "")) * 100) 
      : 0
    
    return updateEstimateById(id, { 
      finalAmount, 
      finalAmountCents 
    })
  }, [updateEstimateById])

  // Load estimates on mount
  useEffect(() => {
    loadEstimates()
  }, [loadEstimates])

  // Set up real-time subscription
  useEffect(() => {
    const subscription = subscribeToEstimates((payload) => {
      console.log('Real-time update:', payload)
      
      switch (payload.eventType) {
        case 'INSERT':
          setEstimates(prev => [payload.new, ...prev])
          break
        case 'UPDATE':
          setEstimates(prev => 
            prev.map(est => est.id === payload.new.id ? payload.new : est)
          )
          break
        case 'DELETE':
          setEstimates(prev => 
            prev.filter(est => est.id !== payload.old.id)
          )
          break
        default:
          // For any other changes, reload all estimates
          loadEstimates()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [loadEstimates])

  return {
    estimates,
    loading,
    error,
    addEstimate,
    updateEstimate: updateEstimateById,
    deleteEstimate: removeEstimate,
    markBilled,
    updateStatus,
    updateFinalAmount,
    reloadEstimates: loadEstimates
  }
}
