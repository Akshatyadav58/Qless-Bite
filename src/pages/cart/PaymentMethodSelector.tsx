import React from 'react';
import { CreditCard, DollarSign } from 'lucide-react';
import { PaymentMethod } from '../../types';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentMethod;
  onSelectMethod: (method: PaymentMethod) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="grid grid-cols-2 gap-2">
      <button
        onClick={() => onSelectMethod('COD')}
        className={`
          flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md border transition-colors
          ${selectedMethod === 'COD'
            ? 'bg-primary-100 border-primary-500 text-primary-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
        `}
      >
        <DollarSign className={`h-5 w-5 mr-2 ${selectedMethod === 'COD' ? 'text-primary-500' : 'text-gray-500'}`} />
        Cash on Delivery
      </button>
      
      <button
        onClick={() => onSelectMethod('ONLINE')}
        className={`
          flex items-center justify-center px-4 py-3 text-sm font-medium rounded-md border transition-colors
          ${selectedMethod === 'ONLINE'
            ? 'bg-primary-100 border-primary-500 text-primary-700'
            : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}
        `}
      >
        <CreditCard className={`h-5 w-5 mr-2 ${selectedMethod === 'ONLINE' ? 'text-primary-500' : 'text-gray-500'}`} />
        Online Payment
      </button>
    </div>
  );
};

export default PaymentMethodSelector;