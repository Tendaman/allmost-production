//components/delete-product-popup/delete-product.tsx

import React from 'react';
import { Button } from '@/components/ui/button';

interface DeleteProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteProductPopup: React.FC<DeleteProductPopupProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  // Get current scroll position
  const scrollY = typeof window !== 'undefined' ? window.scrollY : 0;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div 
        className="bg-white p-6 rounded-md shadow-md dark:bg-gray-800 w-[calc(100%-50px)] max-w-md"
        style={{ marginTop: scrollY + window.innerHeight / 2 - 200 }} // Adjust marginTop based on scroll position
      >
        <header>
            <h2 className="text-lg font-bold mb-4 dark:text-white">Delete Product</h2>
        </header>
        <p className="dark:text-gray-300">Are you sure you want to delete this product? You can only re-add this product from your connected stripe account under the archived section.</p>
        <div className="mt-6 flex justify-end space-x-3">
          <Button variant="outline" onClick={onClose} className="dark:bg-gray-700 dark:text-white dark:border-gray-600">
            Cancel
          </Button>
          <Button variant="destructive" onClick={onConfirm} className="dark:bg-red-600 dark:text-white">
            Confirm
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProductPopup;
