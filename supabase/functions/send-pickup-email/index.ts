import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      }
    })
  }

  try {
    const { 
      partnerName, 
      partnerAddress, 
      userEmail, 
      userLocation, 
      googleMapsLink,
      itemId 
    } = await req.json()

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'ReHome <onboarding@resend.dev>',
        to: 'dummymail.13la7e@gmail.com',
        subject: `Pickup Request - ${partnerName}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2E7D32;">New Pickup Request from ReHome</h2>
            
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Partner Details</h3>
              <p><strong>Partner Name:</strong> ${partnerName}</p>
              <p><strong>Partner Address:</strong> ${partnerAddress}</p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">User Details</h3>
              <p><strong>User Email:</strong> ${userEmail}</p>
              <p><strong>User Location Coordinates:</strong> ${userLocation}</p>
              <p><strong>View Location:</strong> <a href="${googleMapsLink}" style="color: #2E7D32;">Open in Google Maps</a></p>
            </div>

            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0;">Request Details</h3>
              <p><strong>Requested At:</strong> ${new Date().toLocaleString()}</p>
              ${itemId ? `<p><strong>Item ID:</strong> ${itemId}</p>` : ''}
            </div>

            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This is an automated email from ReHome. Please contact the user to arrange pickup details.
            </p>
          </div>
        `
      })
    })

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        } 
      }
    )
  }
})
