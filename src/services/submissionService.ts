import { supabase } from '../lib/supabase'
import type { Submission } from '../types/database'
import { compressImage } from '../utils/imageCompression'

/**
 * Submit a new location image for review
 */
export const submitLocation = async (
  file: File,
  latitude: number,
  longitude: number,
  name: string,
  description?: string,
  submittedBy?: string
): Promise<Submission | null> => {
  try {
    // Compress image
    const compressedBlob = await compressImage(file)
    const compressedFile = new File([compressedBlob], file.name, { type: 'image/jpeg' })
    
    // Upload to Supabase Storage (we compress to JPEG, so use .jpg)
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`
    const filePath = `submissions/${fileName}`
    
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, compressedFile, {
        cacheControl: '3600',
        upsert: false
      })
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError)
      throw new Error(
        'Image upload failed. In Supabase: Storage → create an "images" bucket (public) and add an INSERT policy for it. Error: ' + uploadError.message
      )
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)
    
    // Create submission record
    const { data, error } = await supabase
      .from('submissions')
      .insert({
        image_url: publicUrl,
        latitude,
        longitude,
        name,
        description,
        submitted_by: submittedBy,
        status: 'pending'
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating submission:', error)
      throw new Error('Could not save submission. Error: ' + error.message)
    }
    
    return data
  } catch (err) {
    if (err instanceof Error && (err.message.startsWith('Image upload failed') || err.message.startsWith('Could not save submission'))) throw err
    console.error('Error in submitLocation:', err)
    throw err instanceof Error ? err : new Error(String(err))
  }
}
