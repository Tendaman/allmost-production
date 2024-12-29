//src/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/_components/funnel-editor-sidebar/tabs/inventory-tab.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { Loader } from 'lucide-react'

type Props = {
  subaccountId: string
}

type StripeProduct = {
  id: string
  name: string
  images: string[]
  prices: {
    currency: string
    unit_amount: number
    recurring?: {
      interval: string
    }
  }[]
}

const InventoryTab: React.FC<Props> = ({ subaccountId }) => {
  const [products, setProducts] = useState<StripeProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const handleDragStart = (e: React.DragEvent, product: StripeProduct) => {
    e.dataTransfer.setData('componentType', 'product')
    e.dataTransfer.setData('productId', product.id)
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/api/stripe/fetch-products?subaccountId=${subaccountId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        setProducts(data)
      } catch (error) {
        console.error('Error fetching products:', error)
        setError('Failed to load products.')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [subaccountId])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader className="animate-spin h-8 w-8" />
      </div>
    )
  }

  if (error) {
    return <div className="text-red-500">{error}</div>
  }

  return (
    <div className="editor__tab inventory-tab space-y-4 px-5">
      {products.length === 0 ? (
        <p className="dark:text-gray-200">No products found.</p>
      ) : (
        products.map((product) => (
          <div
            key={product.id}
            draggable
            onDragStart={(e) => handleDragStart(e, product)}
            className="flex flex-col border border-blue-500 items-center p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800"
          >
            {/* Product Image */}
            {product.images[0] ? (
              <img src={product.images[0]} alt={product.name} className="w-32 h-32 object-cover rounded-lg" />
            ) : (
              <div className="w-32 h-32 bg-gray-200  dark:bg-gray-700 flex items-center justify-center">
                No Image
              </div>
            )}

            {/* Product Name */}
            <h3 className="text-lg font-semibold mt-2 dark:text-gray-200">{product.name}</h3>

            {/* Product Interval */}
            {product.prices[0]?.recurring?.interval ? (
              <p className="text-gray-500 dark:text-gray-400">{product.prices[0].recurring.interval}</p>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">one-time</p>
            )}

            {/* Product Price */}
            <p className="text-gray-700 dark:text-gray-300">
              Price: {product.prices[0]?.unit_amount
                ? (product.prices[0].unit_amount / 100).toFixed(2)
                : 'Error'}{' '}
              {product.prices[0]?.currency.toUpperCase()}
            </p>
          </div>
        ))
      )}
    </div>
  )
}

export default InventoryTab

