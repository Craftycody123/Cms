'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function AdminLogin() {
  const { register, handleSubmit } = useForm();
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append('username', data.email);
      formData.append('password', data.password);
      const res = await api.post('/auth/login', formData);
      setToken(res.data.access_token);
      router.push('/admin/dashboard');
    } catch (error) {
      setErrorMsg('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen py-32 flex items-center justify-center bg-slate-50">
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-10 rounded-3xl shadow-xl border border-slate-100 max-w-md w-full">
        <h1 className="text-3xl font-bold font-syne mb-8 text-center text-slate-900">Admin Login</h1>
        {errorMsg && <p className="text-red-500 mb-6 p-4 bg-red-50 rounded-xl text-center text-sm">{errorMsg}</p>}
        <div className="mb-6">
          <label className="block text-slate-700 mb-2 font-medium text-sm">Email</label>
          <input {...register('email')} type="email" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" />
        </div>
        <div className="mb-8">
          <label className="block text-slate-700 mb-2 font-medium text-sm">Password</label>
          <input {...register('password')} type="password" required className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-600 outline-none transition-shadow" />
        </div>
        <button type="submit" className="w-full bg-slate-900 text-white font-semibold py-4 rounded-xl hover:bg-slate-800 transition-colors">
          Log In
        </button>
      </form>
    </div>
  );
}
