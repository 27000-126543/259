import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Phone, Lock } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store';

const loginSchema = z.object({
  phone: z.string().min(11, '请输入正确的手机号'),
  password: z.string().min(6, '密码至少6位')
});

type LoginForm = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAppStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema)
  });

  const onSubmit = async (data: LoginForm) => {
    setError('');
    const user = login(data.phone, data.password);
    
    if (user) {
      navigate('/');
    } else {
      setError('手机号或密码错误');
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 text-white p-12 flex-col justify-between relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-20 w-96 h-96 bg-cyan-400 rounded-full blur-3xl" />
        </div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">智慧保险</h1>
              <p className="text-blue-200 text-sm">综合服务平台</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-md">
          <h2 className="text-4xl font-bold leading-tight">
            智能保险服务<br />让保障更简单
          </h2>
          <p className="text-blue-200 text-lg">
            AI驱动的一站式保险服务平台，智能推荐、快速理赔、健康管理，全方位守护您和家人。
          </p>
          
          <div className="grid grid-cols-3 gap-4 pt-4">
            {[
              { label: '在线投保', desc: '最快3分钟' },
              { label: '智能理赔', desc: '24小时到账' },
              { label: '专属服务', desc: '7x24小时' }
            ].map((item, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur rounded-xl p-4">
                <p className="font-semibold">{item.label}</p>
                <p className="text-blue-200 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-blue-300 text-sm">
          © 2024 智慧保险 版权所有
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">智慧保险</h1>
              <p className="text-gray-500 text-sm">综合服务平台</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">欢迎回来</h2>
              <p className="text-gray-500 mt-1">登录您的账户继续使用</p>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  {...register('phone')}
                  label="手机号"
                  placeholder="请输入手机号"
                  className="pl-10"
                  defaultValue="13800138001"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('password')}
                  label="密码"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  className="pl-10 pr-10"
                  defaultValue="123456"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  <span className="text-sm text-gray-600">记住密码</span>
                </label>
                <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  忘记密码？
                </button>
              </div>

              <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
                登录
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">测试账号</span>
                </div>
              </div>
              
              <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-gray-500">
                <p>客户：13800138001 / 123456</p>
                <p>代理人：13900139002 / 123456</p>
                <p>管理员：13700137003 / admin123</p>
              </div>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              还没有账号？{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
