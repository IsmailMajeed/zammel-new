import { useState } from 'react'
import { createClient, SupabaseClient } from '@supabase/supabase-js'
import toast from 'react-hot-toast';

export const supabase: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
)

const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/[^a-zA-Z0-9._-]/g, '') // Remove special characters
    .toLowerCase();
};

export function useSupabaseUpload() {
  const [loading, setLoading] = useState<boolean>(false)

  const upload = async (files: File | File[]): Promise<string[]> => {
    setLoading(true)
    let fileArray: File[] = Array.isArray(files) ? files : [files]

    const uploadPromises = fileArray.map(file =>
      supabase.storage
        .from('images') // bucket name
        .upload(`public/${Date.now()}-${sanitizeFileName(file.name)}`, file, {
          cacheControl: '3600',
          upsert: false,
        })
    )

    const results = await Promise.all(uploadPromises)

    const urls = results.map(result => {
      if (result.error) {
        toast.error(result.error.message)
        console.error(result.error)
        return null
      }
      const { data } = result
      if (!data) return null
      const { data: publicUrlData } = supabase.storage
        .from('images')
        .getPublicUrl(data.path)

      return publicUrlData.publicUrl
    })

    setLoading(false)
    return urls.filter((url): url is string => Boolean(url))
  }

  return { upload, loading }
}
