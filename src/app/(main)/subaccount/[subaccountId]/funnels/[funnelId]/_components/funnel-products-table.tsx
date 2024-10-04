//(main)/subaccount/funnels/[funneelId]/_components/funnel-products-table.tsx
'use client'
import React, { useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import Stripe from 'stripe'
import Image from 'next/image'
import {
  saveActivityLogsNotification,
  updateFunnelProducts,
} from '@/lib/queries'
import { Funnel } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import CreateProductPopup from '@/components/create-product-popup/create-popup';
import { StripeProductType } from '@/lib/types'
import { toast, ToastContainer } from 'react-toastify'; // Importing toast methods
import 'react-toastify/dist/ReactToastify.css'; // Importing toast styles
import { Trash2Icon } from 'lucide-react'
import DeleteProductPopup from '@/components/delete-product-popup/delete-product'

interface FunnelProductsTableProps {
  defaultData: Funnel
  products: Stripe.Product[]
}

const FunnelProductsTable: React.FC<FunnelProductsTableProps> = ({
  products,
  defaultData,
}) => {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [liveProducts, setLiveProducts] = useState<
    { productId: string; recurring: boolean }[] | []
  >(JSON.parse(defaultData.liveProducts || '[]'))

  const [isCreateProductPopupOpen, setIsCreateProductPopupOpen] = useState(false);

  const [isDeleteProductPopupOpen, setIsDeleteProductPopupOpen] = useState(false); // State for delete popup
  const [productToDelete, setProductToDelete] = useState<string | null>(null); // State to store product ID to delete

  // Filter active products
  const activeProducts = products.filter(product => product.active);

  const handleCreateProduct = async (productData: StripeProductType) => {
    try {
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }
      
      router.refresh();
      toast.success('Product created successfully!'); // Success toast
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error('Error creating product: ' + (error as Error).message); // Error toast
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      const response = await fetch(`/api/stripe/delete-product`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subaccountId: defaultData.subAccountId,
          productId
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }
      router.refresh();
      toast.success('Product deleted successfully!', {
        position: "bottom-right",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast.error('Error deleting product: ' + (error as Error).message, {
        position: "bottom-right",
      });
    }
  };

  const confirmDeleteProduct = (productId: string) => {
    setProductToDelete(productId); // Set the product ID to be deleted
    setIsDeleteProductPopupOpen(true); // Open the delete confirmation popup
  };

  const handleDeleteConfirmation = () => {
    if (productToDelete) {
      handleDeleteProduct(productToDelete); // Call the delete API
    }
    setIsDeleteProductPopupOpen(false); // Close the popup
  };

  const handleSaveProducts = async () => {
    setIsLoading(true)
    try {
      const response = await updateFunnelProducts(JSON.stringify(liveProducts), defaultData.id)
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Update funnel products | ${response.name}`,
        subaccountId: defaultData.subAccountId,
      })
      router.refresh()
    } catch (error) {
      console.error('Error saving products:', error)
      // Handle error (e.g., show toast)
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async (product: Stripe.Product) => {
    const productIdExists = liveProducts.find(
      //@ts-ignore
      (prod) => prod.productId === product.default_price.id
    )
    productIdExists
      ? setLiveProducts(
          liveProducts.filter(
            (prod) =>
              //@ts-ignore
              prod.productId !== product.default_price?.id
          )
        )
      : //@ts-ignore
        setLiveProducts([
          ...liveProducts,
          {
            //@ts-ignore
            productId: product.default_price.id as string,
            //@ts-ignore
            recurring: !!product.default_price.recurring,
          },
        ])
  }

  return (
    <>
      <Table className="bg-card border-[1px] border-border rounded-md">
        <TableHeader className="rounded-md">
          <TableRow>
            <TableHead>Live</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Interval</TableHead>
            <TableHead className="text-right">Price</TableHead>
            <TableHead className="text-center">Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="font-medium truncate">
          {activeProducts.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <Input
                  defaultChecked={
                    !!liveProducts.find(
                      //@ts-ignore
                      (prod) => prod.productId === product.default_price?.id
                    )
                  }
                  onChange={() => handleAddProduct(product)}
                  type="checkbox"
                  className="w-4 h-4"
                />
              </TableCell>
              <TableCell>
                <Image
                  alt="product Image"
                  height={60}
                  width={60}
                  src={product.images[0]}
                />
              </TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>
                {
                  //@ts-ignore
                  product.default_price?.recurring ? 'Recurring' : 'One Time'
                }
              </TableCell>
              <TableCell className="text-right">
                {
                  //@ts-ignore
                  product.default_price?.unit_amount ? (product.default_price.unit_amount / 100).toLocaleString(undefined, {
                        style: 'currency',
                        currency: (product.default_price as Stripe.Price)?.currency || 'USD',
                      })
                    : 'Error' // Fallback if unit_amount is not available
                }
              </TableCell>
              <TableCell className="text-center">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => confirmDeleteProduct(product.id)} // Open confirmation popup
                  className="dark:bg-gray-900 dark:hover:bg-red-600 dark:hover:text-white bg-white text-red-500 border-red-500 hover:bg-red-600 hover:text-white"
                >
                  <Trash2Icon className="h-4 w-4" />
                </Button>
            </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Delete Product Confirmation Popup */}
      <DeleteProductPopup
        isOpen={isDeleteProductPopupOpen}
        onClose={() => setIsDeleteProductPopupOpen(false)}
        onConfirm={handleDeleteConfirmation}
      />
      <Button
        disabled={isLoading}
        onClick={handleSaveProducts}
        className="mt-4"
      >
        Save Products
      </Button>
      <Button
        disabled={isLoading}
        onClick={() => setIsCreateProductPopupOpen(true)}
        className="ml-5 mt-4"
      >
        Create Products
      </Button>
      <CreateProductPopup
        isOpen={isCreateProductPopupOpen}
        onClose={() => setIsCreateProductPopupOpen(false)}
        onCreateProduct={handleCreateProduct}
        subaccountId={defaultData.subAccountId}
      />
    </>
  )
}

export default FunnelProductsTable