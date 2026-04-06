import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BASE_URL } from '../config';
import { AuthContext } from '../context/AuthContext';
import { Check, X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const Pricing = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [plans, setPlans] = useState({
    oneMonthPrice: 499,
    threeMonthsPrice: 1299,
    oneYearPrice: 3999
  });
  const [loading, setLoading] = useState(true);
  const [processingPlan, setProcessingPlan] = useState(null);

  useEffect(() => {
    fetchPrices();
  }, []);

  const fetchPrices = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/settings`);
      if (data.settings) {
        setPlans({
          oneMonthPrice: data.settings.oneMonthPrice || 499,
          threeMonthsPrice: data.settings.threeMonthsPrice || 1299,
          oneYearPrice: data.settings.oneYearPrice || 3999
        });
      }
    } catch (err) {
      console.error('Failed to load prices');
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async (planId, price) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (price === 0) {
      navigate('/dashboard'); // Free plan is default
      return;
    }

    setProcessingPlan(planId);
    try {
      const { data } = await axios.post(`${BASE_URL}/api/payments/create-order`, { planId }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const options = {
        key: data.key_id,
        amount: data.amount,
        currency: "INR",
        name: "DP QR-generator",
        description: `Upgrade to ${planId.replace('_', ' ')} plan`,
        order_id: data.order.id,
        handler: async function (response) {
          try {
            await axios.post(`${BASE_URL}/api/payments/verify`, {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId
            }, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser({ ...user, isPaid: true, planType: planId });
            toast.success("Payment successful! Welcome to Premium.");
            navigate('/payment-success');
          } catch (e) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: user.name,
          email: user.email,
        },
        theme: { color: "#6d28d9" }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.open();
    } catch (err) {
      toast.error('Failed to initialize payment');
    } finally {
      setProcessingPlan(null);
    }
  };

  if (loading) return <div className="flex-1 flex justify-center items-center h-[70vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  const planFeatures = {
    free: { name: 'Free Plan', price: 0, features: ['Only 1 QR code', 'QR expires after 24 hours', 'No analytics', 'No edit option'] },
    '1_month': { name: '1 Month Plan', price: plans.oneMonthPrice, features: ['Unlimited QR codes', 'No expiry', 'Basic analytics (scan count)', 'Basic customization'] },
    '3_months': { name: '3 Months Plan', price: plans.threeMonthsPrice, isBestValue: true, features: ['Unlimited QR codes', 'No expiry', 'Advanced edit option', 'Advanced analytics (scan count)'] },
    '1_year': { name: '1 Year Plan', price: plans.oneYearPrice, features: ['Unlimited QR codes', 'No expiry', 'Advanced edit option', 'Dedicated support'] }
  };

  return (
    <div className="py-16 px-4 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-base text-primary font-semibold tracking-wide uppercase">Pricing</h2>
        <p className="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Choose the perfect plan for you
        </p>
        <p className="mt-4 max-w-2xl text-xl text-slate-500 mx-auto">
          Upgrade your QR game with unlimited codes, no expiry, and actionable analytics.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {Object.entries(planFeatures).map(([id, plan]) => (
          <div key={id} className={`relative flex flex-col rounded-3xl border ${plan.isBestValue ? 'border-primary shadow-2xl bg-primary/5 scale-105' : 'border-slate-200 bg-white shadow-sm'} p-8 xl:p-10 transition-transform`}>
            {plan.isBestValue && (
              <div className="absolute -top-5 left-0 right-0 flex justify-center">
                <span className="bg-primary text-white text-sm font-bold uppercase py-1 px-3 rounded-full">Best Value</span>
              </div>
            )}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
              <p className="mt-4 flex items-baseline gap-x-2">
                <span className="text-4xl font-bold tracking-tight text-slate-900">₹{plan.price}</span>
                {plan.price > 0 && <span className="text-sm font-semibold leading-6 text-slate-600">/ {id.replace('_', ' ')}</span>}
              </p>
            </div>
            
            <ul className="mt-8 space-y-4 mb-8 flex-1">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex gap-x-3 text-sm leading-6 text-slate-600 font-medium">
                  {idx < 2 || id !== 'free' ? <Check className="w-5 h-5 flex-none text-primary" /> : <X className="w-5 h-5 flex-none text-red-500" />}
                  {feature}
                </li>
              ))}
            </ul>
            
            <button
              onClick={() => handlePayment(id, plan.price)}
              disabled={processingPlan === id || (user?.planType === id && id !== 'free')}
              className={`mt-auto block w-full rounded-xl px-3 py-4 text-center text-sm font-bold shadow-md transition-all ${
                plan.isBestValue 
                  ? 'bg-primary text-white hover:bg-primary/90 hover:shadow-lg hover:shadow-primary/30' 
                  : id === 'free' ? 'bg-slate-100 text-slate-900 hover:bg-slate-200' : 'bg-slate-900 text-white hover:bg-slate-800'
              } disabled:opacity-50`}
            >
              {processingPlan === id ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : (user?.planType === id && id !== 'free' ? 'Current Plan' : 'Choose Plan')}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
