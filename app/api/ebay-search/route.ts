import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ error: 'Query parameter is required' }, { status: 400 });
  }

  const clientId = process.env.EBAY_CLIENT_ID;
  const clientSecret = process.env.EBAY_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: 'eBay API keys are missing' }, { status: 500 });
  }

  try {
    // 1. eBay se Authorization Token lena
    const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    const tokenResponse = await fetch('https://api.ebay.com/identity/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`,
      },
      body: 'grant_type=client_credentials&scope=https://api.ebay.com/oauth/api_scope'
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('Failed to get access token from eBay');
    }

    // 2. Token aur Query ko use karke Auto Parts (Category 6030) ki image dhoondhna
    const searchResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&category_ids=6030&limit=1`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const searchData = await searchResponse.json();

    // 3. Agar item mil gaya toh uski photo return karna
    if (searchData.itemSummaries && searchData.itemSummaries.length > 0) {
      const item = searchData.itemSummaries[0];
      const imageUrl = item.image?.imageUrl || null;
      return NextResponse.json({ imageUrl, title: item.title });
    } else {
      return NextResponse.json({ imageUrl: null, message: 'No image found' });
    }

  } catch (error) {
    console.error('eBay API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from eBay' }, { status: 500 });
  }
}