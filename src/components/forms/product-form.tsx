//src\components\forms\product-form.tsx

import React from 'react'
import { Button } from '@/components/ui/button'
import { EditorElement } from '@/providers/editor/editor-provider'

type Props = {
  element: EditorElement
}

const ProductForm = ({ element }: Props) => {
  const { content } = element

  if (!content || typeof content !== 'object' || Array.isArray(content)) {
    return null
  }

  const { name, images, description, prices } = content

  // Check if the product has recurring pricing
  const isRecurring = prices && prices[0]?.recurring;

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg">
      {images && images.length > 0 && (
        <img
          src={images[0]}
          alt={name}
          className="w-full h-48 border border-black-900 object-cover rounded-lg"
        />
      )}
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      {prices && prices.length > 0 && (
        <p className="text-lg font-bold mt-2 text-center">
          {(prices[0].unit_amount / 100).toFixed(2)} {prices[0].currency.toUpperCase()}<br></br>{isRecurring ? ` /${prices[0].recurring?.interval}` : ''}
        </p>
      )}
      {/* Button: Add to Cart or Subscribe */}
      <Button className="mt-4">
        {isRecurring ? `Subscribe` : 'Add to Cart'}
      </Button>
    </div>
  )
}

export default ProductForm
