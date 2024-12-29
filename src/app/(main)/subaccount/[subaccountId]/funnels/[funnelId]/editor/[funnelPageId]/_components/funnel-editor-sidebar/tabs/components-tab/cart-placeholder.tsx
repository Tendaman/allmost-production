//src\app\(main)\subaccount\[subaccountId]\funnels\[funnelId]\editor\[funnelPageId]\_components\funnel-editor-sidebar\tabs\components-tab\cart-placeholder.tsx

import { EditorBtns } from '@/lib/constants'
import { Image, ShoppingCart } from 'lucide-react'
import React from 'react'

interface ImagePlaceholderProps {}

const CartPlaceholder: React.FC<ImagePlaceholderProps> = ({}) => {
  const handleDragStart = (e: React.DragEvent, type: EditorBtns) => {
    if (type === null) return
    e.dataTransfer.setData('componentType', type)
  }
  return (
    <div
      draggable
      onDragStart={(e) => handleDragStart(e, 'cart')}
      className="h-14 w-14 bg-muted rounded-lg flex items-center justify-center"
    >
      <ShoppingCart
        size={40}
        className="text-muted-foreground"
      />
    </div>
  )
}

export default CartPlaceholder;
