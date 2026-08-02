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

    const searchResponse = await fetch(`https://api.ebay.com/buy/browse/v1/item_summary/search?q=${encodeURIComponent(query)}&filter=conditionIds:{1000}&limit=3`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US'
      }
    });

    const searchData = await searchResponse.json();

    let selectedItem = null;
    if (searchData.itemSummaries && searchData.itemSummaries.length > 0) {
      selectedItem = searchData.itemSummaries.find((item: any) => item.image?.imageUrl) || searchData.itemSummaries[0];
    }

    if (selectedItem && selectedItem.image) {
      const mainImageUrl = selectedItem.image.imageUrl;
      const additionalImages = selectedItem.additionalImages?.map((img: any) => img.imageUrl) || [];
      const allImages = [mainImageUrl, ...additionalImages];

      // 🔥 Extra Details Extract Kar Rahe Hain 🔥
      const brand = selectedItem.brand || null;
      const mpn = selectedItem.mpn || null; // Manufacturer Part Number
      const price = selectedItem.price ? `${selectedItem.price.currency === 'USD' ? '$' : selectedItem.price.currency} ${selectedItem.price.value}` : null;

      return NextResponse.json({ 
        imageUrl: mainImageUrl,
        images: allImages,
        title: selectedItem.title,
        brand: brand,
        mpn: mpn,
        price: price
      });
    } else {
      return NextResponse.json({ imageUrl: null, images: [], message: 'No image found' });
    }

  } catch (error) {
    console.error('eBay API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch data from eBay' }, { status: 500 });
  }
}