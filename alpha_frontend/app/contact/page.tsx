'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import api from '@/lib/api';
import { CheckCircle2 } from 'lucide-react';

type ContactFormData = {
  name: string;
  email: string;
  company: string;
  phone: string;
  service_interested: string;
  message: string;
};

export default function ContactPage() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await api.post('/inquiries/', data);
      setIsSuccess(true);
      reset();
    } catch (error) {
      setErrorMsg('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-slate-50">
        <div className="text-center p-12 bg-white rounded-2xl shadow-sm border border-slate-100 max-w-md">
          <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-6" />
          <h2 className="text-3xl font-bold font-syne text-slate-900 mb-4">Message Sent!</h2>
          <p className="text-slate-600 mb-8">Thank you for reaching out. Our team will get back to you shortly.</p>
          <button onClick={() => setIsSuccess(false)} className="bg-slate-900 text-white px-6 py-3 rounded-full font-medium">Send Another Message</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-32 bg-slate-50">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold font-syne text-slate-900 mb-6">Let&apos;s Connect</h1>
          <p className="text-lg text-slate-600">Ready to start your next project? Fill out the form below and we&apos;ll be in touch.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-slate-100">
          {errorMsg && <div className="mb-8 p-4 bg-red-50 text-red-600 rounded-xl">{errorMsg}</div>}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Name *</label>
              <input {...register('name', { required: 'Name is required' })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              {errors.name && <p className="text-sm text-red-500 mt-2">{errors.name.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Email *</label>
              <input type="email" {...register('email', { required: 'Email is required' })} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
              {errors.email && <p className="text-sm text-red-500 mt-2">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Company</label>
              <input {...register('company')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Phone</label>
              <input {...register('phone')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600" />
            </div>
          </div>

          <div className="mb-8">
            <label className="block text-sm font-medium text-slate-700 mb-2">Service of Interest</label>
            <select {...register('service_interested')} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600">
              <option value="">Select a service...</option>
              <option value="Outdoor Advertising">Outdoor Advertising</option>
              <option value="Graphic Design">Graphic Design</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
          </div>

          <div className="mb-8">
             <label className="block text-sm font-medium text-slate-700 mb-2">Message *</label>
             <textarea {...register('message', { required: 'Message is required' })} rows={5} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-600"></textarea>
             {errors.message && <p className="text-sm text-red-500 mt-2">{errors.message.message}</p>}
          </div>

          <button disabled={isSubmitting} type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 rounded-xl transition-colors disabled:opacity-50">
             {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}
