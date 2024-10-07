// src/app/api/stripe/get-product/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subaccountId = searchParams.get('subaccountId');
    const productId = searchParams.get('productId');

    if (!subaccountId || !productId) {
      console.error('Missing parameters:', { subaccountId, productId });
      return NextResponse.json({ error: 'Missing subaccountId or productId' }, { status: 400 });
    }

    // Retrieve connected account ID from the database
    const subaccount = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });

    if (!subaccount || !subaccount.connectAccountId) {
      console.error('Subaccount not found or missing connectAccountId:', { subaccountId, connectAccountId: subaccount?.connectAccountId });
      return NextResponse.json({ error: 'Connected Stripe account not found' }, { status: 400 });
    }

    // Fetch the specific product from the Stripe connected account
    const product = await stripe.products.retrieve(productId, {
      stripeAccount: subaccount.connectAccountId,
    });

    // Fetch prices for the product
    const prices = await stripe.prices.list(
      {
        product: productId,
      },
      {
        stripeAccount: subaccount.connectAccountId,
      }
    );

    // Combine product and price information
    const productWithPrices = {
      ...product,
      prices: prices.data,
    };

    return NextResponse.json(productWithPrices);
  } catch (error) {
    console.error('Error fetching Stripe product:', error);
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 });
  }
}