//src\components\create-product-popup\create-popup.tsx
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import FileUpload from '../global/file-upload';

interface CreateProductPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProduct: (product: any) => void;
  subaccountId: string; // Add subaccountId prop to handle connected accounts
}

const CreateProductPopup: React.FC<CreateProductPopupProps> = ({ isOpen, onClose, onCreateProduct, subaccountId }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [priceType, setPriceType] = useState('recurring');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [recurringInterval, setRecurringInterval] = useState('month');
  const [isLoading, setIsLoading] = useState(false);
  const [maxHeight, setMaxHeight] = useState('80vh');
  const { toast } = useToast();

  useEffect(() => {
    const updateMaxHeight = () => {
      const windowHeight = window.innerHeight;
      setMaxHeight(`${windowHeight * 0.8}px`);
    };

    updateMaxHeight();
    window.addEventListener('resize', updateMaxHeight);

    return () => window.removeEventListener('resize', updateMaxHeight);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          image,
          priceType,
          price: parseFloat(price),
          currency,
          recurringInterval: priceType === 'recurring' ? recurringInterval : null,
          subaccountId, // Pass subaccountId to the API request
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create product');
      }

      const data = await response.json();
      onCreateProduct(data);
      toast({
        title: "Success",
        description: "Product created successfully",
      });
      onClose();
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        title: "Error",
        description: "Failed to create product. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-full overflow-y-auto" style={{ maxHeight: maxHeight }}>
        <DialogHeader>
          <DialogTitle>Create New Product</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="image" className="text-right">
                Product Image
              </Label>
              <div className='col-span-3'>
                <FileUpload
                  apiEndpoint="media"
                  onChange={setImage}
                  value={image}
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="priceType" className="text-right">
                Price Type
              </Label>
              <Select
                value={priceType}
                onValueChange={setPriceType}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select price type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="once-off">Once-Off</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="currency" className="text-right">
                Currency
              </Label>
              <Select
                value={currency}
                onValueChange={setCurrency}
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="USD">USD – United States Dollar</SelectItem>
                  <SelectItem value="EUR">EUR – Euro</SelectItem>
                  <SelectItem value="GBP">GBP – British Pound</SelectItem>
                  <SelectItem value="AUD">AUD – Australian Dollar</SelectItem>
                  <SelectItem value="CAD">CAD – Canadian Dollar</SelectItem>
                  <SelectItem value="JPY">JPY – Japanese Yen</SelectItem>
                  <SelectItem value="CNY">CNY – Chinese Yuan</SelectItem>
                  <SelectItem value="INR">INR – Indian Rupee</SelectItem>
                  <SelectItem value="CHF">CHF – Swiss Franc</SelectItem>
                  <SelectItem value="SEK">SEK – Swedish Krona</SelectItem>
                  <SelectItem value="NOK">NOK – Norwegian Krone</SelectItem>
                  <SelectItem value="DKK">DKK – Danish Krone</SelectItem>
                  <SelectItem value="NZD">NZD – New Zealand Dollar</SelectItem>
                  <SelectItem value="HKD">HKD – Hong Kong Dollar</SelectItem>
                  <SelectItem value="SGD">SGD – Singapore Dollar</SelectItem>
                  <SelectItem value="AED">AED – UAE Dirham</SelectItem>
                  <SelectItem value="ARS">ARS – Argentine Peso</SelectItem>
                  <SelectItem value="BDT">BDT – Bangladeshi Taka</SelectItem>
                  <SelectItem value="BRL">BRL – Brazilian Real</SelectItem>
                  <SelectItem value="CLP">CLP – Chilean Peso</SelectItem>
                  <SelectItem value="COP">COP – Colombian Peso</SelectItem>
                  <SelectItem value="CZK">CZK – Czech Koruna</SelectItem>
                  <SelectItem value="EGP">EGP – Egyptian Pound</SelectItem>
                  <SelectItem value="HUF">HUF – Hungarian Forint</SelectItem>
                  <SelectItem value="IDR">IDR – Indonesian Rupiah</SelectItem>
                  <SelectItem value="ILS">ILS – Israeli Shekel</SelectItem>
                  <SelectItem value="KES">KES – Kenyan Shilling</SelectItem>
                  <SelectItem value="KRW">KRW – South Korean Won</SelectItem>
                  <SelectItem value="MAD">MAD – Moroccan Dirham</SelectItem>
                  <SelectItem value="MXN">MXN – Mexican Peso</SelectItem>
                  <SelectItem value="MYR">MYR – Malaysian Ringgit</SelectItem>
                  <SelectItem value="NGN">NGN – Nigerian Naira</SelectItem>
                  <SelectItem value="PHP">PHP – Philippine Peso</SelectItem>
                  <SelectItem value="PKR">PKR – Pakistani Rupee</SelectItem>
                  <SelectItem value="PLN">PLN – Polish Złoty</SelectItem>
                  <SelectItem value="RUB">RUB – Russian Ruble</SelectItem>
                  <SelectItem value="THB">THB – Thai Baht</SelectItem>
                  <SelectItem value="TRY">TRY – Turkish Lira</SelectItem>
                  <SelectItem value="TWD">TWD – New Taiwan Dollar</SelectItem>
                  <SelectItem value="VND">VND – Vietnamese Đồng</SelectItem>
                  <SelectItem value="ZAR">ZAR – South African Rand</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {priceType === 'recurring' && (
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="recurringInterval" className="text-right">
                  Interval
                </Label>
                <Select
                  value={recurringInterval}
                  onValueChange={setRecurringInterval}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select interval" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="day">Daily</SelectItem>
                    <SelectItem value="week">Weekly</SelectItem>
                    <SelectItem value="month">Monthly</SelectItem>
                    <SelectItem value="year">Yearly</SelectItem>
                    <SelectItem value="quarter">Every 3 months</SelectItem>
                    <SelectItem value="half-year">Every 6 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateProductPopup;