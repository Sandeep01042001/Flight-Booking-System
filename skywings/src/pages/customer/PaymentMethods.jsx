import React, { useState } from 'react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/form/Input';

const maskCard = (num) => `**** **** **** ${num.slice(-4)}`;

const PaymentMethods = () => {
  const [methods, setMethods] = useState([
    {
      id: 'pm_visa_1',
      brand: 'Visa',
      last4: '4242',
      name: 'John Doe',
      expMonth: '12',
      expYear: '2027',
      isDefault: true,
    },
    {
      id: 'pm_mc_1',
      brand: 'Mastercard',
      last4: '4444',
      name: 'John Doe',
      expMonth: '07',
      expYear: '2026',
      isDefault: false,
    },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    name: '',
    number: '',
    expMonth: '',
    expYear: '',
    cvc: '',
  });

  const resetForm = () => setForm({ name: '', number: '', expMonth: '', expYear: '', cvc: '' });

  const addMethod = (e) => {
    e.preventDefault();
    if (!form.name || !form.number || !form.expMonth || !form.expYear || !form.cvc) return;
    const last4 = form.number.replace(/\s+/g, '').slice(-4);
    const brand = form.number.startsWith('4') ? 'Visa' : form.number.startsWith('5') ? 'Mastercard' : 'Card';
    const newItem = {
      id: `pm_${Date.now()}`,
      brand,
      last4,
      name: form.name,
      expMonth: form.expMonth,
      expYear: form.expYear,
      isDefault: methods.length === 0,
    };
    setMethods((prev) => [newItem, ...prev]);
    setShowAdd(false);
    resetForm();
  };

  const removeMethod = (id) => {
    setMethods((prev) => prev.filter((m) => m.id !== id));
  };

  const setDefault = (id) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment Methods</h1>
          <p className="text-sm text-gray-500">Manage your saved cards</p>
        </div>
        <Button onClick={() => setShowAdd(true)}>Add New Card</Button>
      </div>

      {methods.length === 0 ? (
        <div className="text-center py-12 bg-white shadow rounded-md">
          <p className="text-sm text-gray-600">No saved payment methods yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {methods.map((m) => (
            <div key={m.id} className="bg-white shadow rounded-md p-4 flex items-center justify-between">
              <div>
                <div className="text-gray-900 font-medium">{m.brand} • {maskCard(m.last4)}</div>
                <div className="text-sm text-gray-500">Name on card: {m.name}</div>
                <div className="text-sm text-gray-500">Expires: {m.expMonth}/{m.expYear}</div>
              </div>
              <div className="flex items-center space-x-3">
                {m.isDefault ? (
                  <span className="px-2 py-1 text-xs rounded bg-green-100 text-green-800">Default</span>
                ) : (
                  <button className="text-blue-600 hover:text-blue-800 text-sm" onClick={() => setDefault(m.id)}>Set default</button>
                )}
                <button className="text-red-600 hover:text-red-800 text-sm" onClick={() => removeMethod(m.id)}>Remove</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add Card</h2>
            <form onSubmit={addMethod} className="space-y-4">
              <Input label="Name on Card" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Card Number" value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value })} placeholder="4242 4242 4242 4242" required />
              <div className="grid grid-cols-3 gap-3">
                <Input label="MM" value={form.expMonth} onChange={(e) => setForm({ ...form, expMonth: e.target.value })} required />
                <Input label="YYYY" value={form.expYear} onChange={(e) => setForm({ ...form, expYear: e.target.value })} required />
                <Input label="CVC" value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value })} required />
              </div>
              <div className="flex justify-end space-x-2 pt-2">
                <Button type="button" variant="outline" onClick={() => { setShowAdd(false); resetForm(); }}>Cancel</Button>
                <Button type="submit">Save Card</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
