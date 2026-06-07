import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Shield, Eye, EyeOff, Phone, Lock, User, Mail, IdCard } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store';

const registerSchema = z.object({
  name: z.string().min(2, '请输入真实姓名'),
  phone: z.string().min(11, '请输入正确的手机号'),
  email: z.string().email('请输入正确的邮箱'),
  idCard: z.string().min(18, '请输入正确的身份证号'),
  password: z.string().min(6, '密码至少6位'),
  confirmPassword: z.string()
}).refine(data => data.password === data.confirmPassword, {
  message: '两次密码输入不一致',
  path: ['confirmPassword']
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register: registerUser } = useAppStore();

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterForm) => {
    const { confirmPassword, ...userData } = data;
    await registerUser({
      ...userData,
      role: 'customer'
    });
    navigate('/');
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
            开启智能保险<br />新体验
          </h2>
          <p className="text-blue-200 text-lg">
            注册即可享受AI智能推荐、极速理赔、健康管理等全方位服务。
          </p>
          
          <div className="space-y-4 pt-4">
            {[
              { icon: '🔒', text: '银行级数据加密，保障信息安全' },
              { icon: '⚡', text: '快速投保，最快3分钟完成' },
              { icon: '💎', text: '会员专属权益，越用越超值' }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-blue-100">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-blue-300 text-sm">
          © 2024 智慧保险 版权所有
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 overflow-y-auto">
        <div className="w-full max-w-md py-8">
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
              <h2 className="text-2xl font-bold text-gray-900">创建账户</h2>
              <p className="text-gray-500 mt-1">填写信息完成注册</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('name')}
                  label="真实姓名"
                  placeholder="请输入真实姓名"
                  className="pl-10"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div className="relative">
                <Phone className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('phone')}
                  label="手机号"
                  placeholder="请输入手机号"
                  className="pl-10"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('email')}
                  label="邮箱"
                  placeholder="请输入邮箱"
                  className="pl-10"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div className="relative">
                <IdCard className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('idCard')}
                  label="身份证号"
                  placeholder="请输入身份证号"
                  className="pl-10"
                />
                {errors.idCard && <p className="text-red-500 text-sm mt-1">{errors.idCard.message}</p>}
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('password')}
                  label="设置密码"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请设置密码"
                  className="pl-10 pr-10"
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

              <div className="relative">
                <Lock className="absolute left-3 top-9 w-5 h-5 text-gray-400" />
                <Input
                  {...register('confirmPassword')}
                  label="确认密码"
                  type="password"
                  placeholder="请再次输入密码"
                  className="pl-10"
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
              </div>

              <label className="flex items-start gap-2 cursor-pointer pt-2">
                <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="text-sm text-gray-600">
                  我已阅读并同意<a href="#" className="text-blue-600 hover:underline">《用户服务协议》</a>和<a href="#" className="text-blue-600 hover:underline">《隐私政策》</a>
                </span>
              </label>

              <Button type="submit" className="w-full" loading={isSubmitting} size="lg">
                注册
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-600">
              已有账号？{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                立即登录
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
