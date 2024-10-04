//src/app/api/stripe/create-product/route.ts

import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'  // Assuming you are using Prisma for DB

export async function POST(req: Request) {
  try {
    const { name, description, price, image, subaccountId, priceType, currency, recurringInterval } = await req.json()

    if (!name || !description || !price|| !image || !currency || !subaccountId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Price must be a valid number
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      return NextResponse.json({ error: 'Invalid price value' }, { status: 400 });
    }

    // Retrieve connected account ID from the database
    const subaccount = await db.subAccount.findUnique({
        where: { id: subaccountId },
    });
  
    if (!subaccount || !subaccount.connectAccountId) {
        return NextResponse.json({ error: 'Connected Stripe account not found' }, { status: 400 });
    }

    const product = await stripe.products.create({
      name,
      description,
      images: [image],
    },
    {
      stripeAccount: subaccount.connectAccountId, // Create the product for the connected account
    })

    const stripePrice = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(parsedPrice * 100), // Convert price to cents
      currency,
      ...(priceType === 'recurring' ? { recurring: { interval: recurringInterval } } : {}),
    },
    {
      stripeAccount: subaccount.connectAccountId, // Create the price for the connected account
    })

    // Step 3: Update the product to set the created price as the default price
    await stripe.products.update(product.id, {
        default_price: stripePrice.id, // Set the default price for this product
      }, {
        stripeAccount: subaccount.connectAccountId,
      });

    return NextResponse.json({ 
        product: product.id, 
        price: stripePrice,
        name: product.name,
        description: product.description,
        image: product.images?.[0],
        priceType: priceType,
        amount: stripePrice.unit_amount,
        currency: stripePrice.currency,
        interval: stripePrice.recurring?.interval
    })
  } catch (error) {
    console.error('Error creating Stripe product:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}