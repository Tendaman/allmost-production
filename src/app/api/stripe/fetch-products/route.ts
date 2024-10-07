// src/app/api/stripe/fetch-products/route.ts

import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db'; // Assuming you are using Prisma for DB

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const subaccountId = searchParams.get('subaccountId');

    if (!subaccountId) {
      return NextResponse.json({ error: 'Missing subaccountId' }, { status: 400 });
    }

    // Retrieve connected account ID from the database
    const subaccount = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });

    if (!subaccount || !subaccount.connectAccountId) {
      return NextResponse.json({ error: 'Connected Stripe account not found' }, { status: 400 });
    }

    // Fetch products from the Stripe connected account
    const products = await stripe.products.list(
      {
        limit: 100, // You can adjust this limit based on your needs
      },
      {
        stripeAccount: subaccount.connectAccountId, // Specify connected account
      }
    );

    // If you want to include price information, you can also fetch prices for the products
    const productsWithPrices = await Promise.all(
      products.data.map(async (product) => {
        const prices = await stripe.prices.list(
          {
            product: product.id,
          },
          {
            stripeAccount: subaccount.connectAccountId,
          }
        );

        return {
          ...product,
          prices: prices.data, // Attach prices to the product
        };
      })
    );

    return NextResponse.json(productsWithPrices);
  } catch (error) {
    console.error('Error fetching Stripe products:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
