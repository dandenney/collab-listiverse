import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get items with URLs but no images
    const { data: items, error: fetchError } = await supabase
      .from('list_items')
      .select('id, url')
      .not('url', 'is', null)
      .is('image', null)

    if (fetchError) {
      console.error('Error fetching items:', fetchError)
      throw fetchError
    }

    let processed = 0
    let errors = 0

    for (const item of items) {
      try {
        console.log(`Processing item ${item.id} with URL ${item.url}`)
        
        // Fetch the URL and look for meta tags
        const response = await fetch(item.url)
        const html = await response.text()
        
        // Simple regex to find og:image or twitter:image meta tags
        const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/)
        const twitterImageMatch = html.match(/<meta[^>]*name="twitter:image"[^>]*content="([^"]*)"/)
        
        const imageUrl = ogImageMatch?.[1] || twitterImageMatch?.[1] || getPlaceholderImage()
        
        const { error: updateError } = await supabase
          .from('list_items')
          .update({
            image: imageUrl
          })
          .eq('id', item.id)

        if (updateError) {
          console.error(`Error updating item ${item.id}:`, updateError)
          errors++
        } else {
          processed++
        }

        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500))
      } catch (error) {
        console.error(`Error processing item ${item.id}:`, error)
        
        // If metadata fetch fails, set a placeholder image
        const { error: updateError } = await supabase
          .from('list_items')
          .update({
            image: getPlaceholderImage()
          })
          .eq('id', item.id)

        if (updateError) {
          console.error(`Error updating item ${item.id} with placeholder:`, updateError)
          errors++
        } else {
          processed++
        }
      }
    }

    return new Response(
      JSON.stringify({ processed, errors }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Error in refresh-metadata function:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 500
      }
    )
  }
})

function getPlaceholderImage() {
  const placeholders = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  ]
  return placeholders[Math.floor(Math.random() * placeholders.length)]
}