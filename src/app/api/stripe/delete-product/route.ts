//api/stripe/delete-product/route.ts
import { db } from '@/lib/db';
import { stripe } from '@/lib/stripe'
import { NextResponse } from 'next/server'

export async function DELETE(req: Request) {
  try {
    const body = await req.json().catch(() => null);

    if (!body || !body.subaccountId || !body.productId) {
      return NextResponse.json({ error: 'Product Not found!!' }, { status: 400 })
    }

    const { subaccountId, productId } = body;

    // Retrieve connected account ID from the database
    const subaccount = await db.subAccount.findUnique({
      where: { id: subaccountId },
    });

    if (!subaccount || !subaccount.connectAccountId) {
      return NextResponse.json({ error: 'Connected Stripe account not found' }, { status: 400 });
    }

    // Step 1: Retrieve the product
    const product = await stripe.products.retrieve(productId, { stripeAccount: subaccount.connectAccountId });

    // Step 2: If the product has a default price, unset it first
    if (product.default_price) {
      await stripe.products.update(
        productId,
        { default_price: null },
        { stripeAccount: subaccount.connectAccountId }
      );
    }

    // Step 3: Retrieve all prices associated with the product
    const prices = await stripe.prices.list(
      { product: productId },
      { stripeAccount: subaccount.connectAccountId }
    );

    // Step 4: Deactivate all prices
    for (const price of prices.data) {
      await stripe.prices.update(
        price.id,
        { active: false },
        { stripeAccount: subaccount.connectAccountId }
      );
    }

    // Step 5: Update the product to archive it
    const updatedProduct = await stripe.products.update(
      productId,
      { active: false },
      { stripeAccount: subaccount.connectAccountId }
    );

    return NextResponse.json({ archived: updatedProduct.active === false }, { status: 200 });
  } catch (error) {
    console.error('Error archiving Stripe product:', error);
    return NextResponse.json({ error: 'Failed to archive product' }, { status: 500 });
  }
}