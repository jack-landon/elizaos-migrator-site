import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sourceChainSelectorName = searchParams.get('sourceChainSelectorName');
  const sourceTransactionHash = searchParams.get('sourceTransactionHash');

  if (!sourceChainSelectorName || !sourceTransactionHash) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    );
  }

  try {
    const response = await fetch(
      `https://test.transporter.io/api/h/ccipData/message/details?sourceChainSelectorName=${sourceChainSelectorName}&sourceTransactionHash=${sourceTransactionHash}`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: `HTTP error! status: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching CCIP progress:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CCIP progress' },
      { status: 500 }
    );
  }
}
