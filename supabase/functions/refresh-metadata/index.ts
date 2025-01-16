import { createClient } from '@supabase/supabase-js';
import mql from '@microlink/mql';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getPlaceholderImage = () => {
  const placeholders = [
    'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
    'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
    'https://images.unsplash.com/photo-1518770660439-4636190af475',
    'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
    'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d'
  ];
  return placeholders[Math.floor(Math.random() * placeholders.length)];
};

async function processItems() {
  const { data: items, error } = await supabase
    .from('list_items')
    .select('id, url')
    .not('url', 'is', null)
    .is('image', null);

  if (error) {
    console.error('Error fetching items:', error);
    return { processed: 0, errors: 1 };
  }

  let processed = 0;
  let errors = 0;

  for (const item of items) {
    try {
      console.log(`Processing item ${item.id} with URL ${item.url}`);
      const response = await mql(item.url);
      const metadata = response.data;
      
      const { error: updateError } = await supabase
        .from('list_items')
        .update({
          image: metadata.image?.url || getPlaceholderImage()
        })
        .eq('id', item.id);

      if (updateError) {
        console.error(`Error updating item ${item.id}:`, updateError);
        errors++;
      } else {
        processed++;
      }

      // Add a small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error(`Error processing item ${item.id}:`, error);
      
      // If metadata fetch fails, set a placeholder image
      const { error: updateError } = await supabase
        .from('list_items')
        .update({
          image: getPlaceholderImage()
        })
        .eq('id', item.id);

      if (updateError) {
        console.error(`Error updating item ${item.id} with placeholder:`, updateError);
        errors++;
      } else {
        processed++;
      }
    }
  }

  return { processed, errors };
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await processItems();
    return new Response(
      JSON.stringify(result),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error in refresh-metadata function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});