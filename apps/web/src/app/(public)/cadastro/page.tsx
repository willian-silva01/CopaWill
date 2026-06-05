'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Trophy, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/api/client';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome muito curto').max(100),
    username: z
      .string()
      .min(3, 'Mínimo 3 caracteres')
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, 'Apenas letras, números e _'),
    email: z.string().email('E-mail inválido'),
    password: z.string().min(8, 'Mínimo 8 caracteres'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: 'Senhas não conferem',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function CadastroPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(data: RegisterForm) {
    setIsLoading(true);
    try {
      await api.post('/auth/register', {
        name: data.name,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      setSuccess(true);
    } catch (err: any) {
      const msg = err.response?.data?.message ?? 'Erro ao criar conta';
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    } finally {
      setIsLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <CheckCircle className="h-16 w-16 text-brand-green mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Conta criada!</h1>
          <p className="text-white/50 mb-6">
            Verifique seu e-mail para confirmar sua conta antes de entrar.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-green/90 transition-colors"
          >
            Ir para o login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-dark flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white mb-6">
            <Trophy className="h-8 w-8 text-brand-gold" />
            <span className="text-2xl font-bold">Copa Will</span>
          </Link>
          <h1 className="text-2xl font-bold text-white">Criar conta</h1>
          <p className="text-white/50 mt-1">É grátis e leva menos de 1 minuto</p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {[
              { name: 'name', label: 'Nome completo', type: 'text', placeholder: 'Seu nome' },
              { name: 'username', label: 'Username', type: 'text', placeholder: 'seunome123' },
              { name: 'email', label: 'E-mail', type: 'email', placeholder: 'seu@email.com' },
              { name: 'password', label: 'Senha', type: 'password', placeholder: '••••••••' },
              {
                name: 'confirmPassword',
                label: 'Confirmar senha',
                type: 'password',
                placeholder: '••••••••',
              },
            ].map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-white/70 mb-1.5">
                  {field.label}
                </label>
                <input
                  {...register(field.name as keyof RegisterForm)}
                  type={field.type}
                  placeholder={field.placeholder}
                  className="w-full bg-white/5 border border-white/10 text-white rounded-lg px-4 py-3 focus:outline-none focus:border-brand-green transition-colors placeholder:text-white/30"
                />
                {errors[field.name as keyof RegisterForm] && (
                  <p className="text-red-400 text-xs mt-1">
                    {errors[field.name as keyof RegisterForm]?.message}
                  </p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-brand-green hover:bg-brand-green/90 disabled:opacity-50 text-white font-bold py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-2"
            >
              {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
              Criar conta
            </button>
          </form>

          <p className="text-center text-white/50 text-sm mt-6">
            Já tem conta?{' '}
            <Link href="/login" className="text-brand-green hover:underline font-medium">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
