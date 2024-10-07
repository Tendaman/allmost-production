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

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md">
      {images && images.length > 0 && (
        <img
          src={images[0]}
          alt={name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
      )}
      <h3 className="text-lg font-semibold mt-2">{name}</h3>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      {prices && prices.length > 0 && (
        <p className="text-lg font-bold mt-2">
          {(prices[0].unit_amount / 100).toFixed(2)} {prices[0].currency.toUpperCase()}
        </p>
      )}
      <Button className="mt-4">Add to Cart</Button>
    </div>
  )
}

export default ProductForm
