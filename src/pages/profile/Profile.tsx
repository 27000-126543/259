import { useState } from 'react';
import { 
  User, 
  Phone, 
  Mail, 
  IdCard, 
  Calendar, 
  Crown,
  Shield,
  Edit3,
  Save,
  Camera
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge, getMemberLevelInfo } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAppStore } from '@/store';

export default function Profile() {
  const { currentUser, updateUser, policies } = useAppStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    phone: currentUser?.phone || '',
    email: currentUser?.email || '',
    idCard: currentUser?.idCard || ''
  });

  const memberInfo = getMemberLevelInfo(currentUser?.memberLevel || 'silver');
  const activePolicies = policies.filter(p => p.userId === currentUser?.id && p.status === 'active');

  const handleSave = async () => {
    if (currentUser) {
      try {
        await updateUser({
          ...currentUser,
          ...formData
        });
        setIsEditing(false);
      } catch (error) {
        console.error('更新用户信息失败:', error);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">个人中心</h1>
          <p className="text-gray-500 mt-1">管理您的个人信息和账户设置</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <div className="relative inline-block">
                <div className={cn('w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto', memberInfo.bgColor)}>
                  {currentUser?.name.charAt(0)}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              
              <h2 className="text-xl font-bold text-gray-900 mt-4">{currentUser?.name}</h2>
              <div className="flex items-center justify-center gap-2 mt-2">
                <span className={cn('px-3 py-1 rounded-full text-sm font-medium text-white', memberInfo.bgColor)}>
                  {memberInfo.label}
                </span>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-gray-100">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activePolicies.length}</p>
                  <p className="text-xs text-gray-500">有效保单</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{currentUser?.renewalCount}</p>
                  <p className="text-xs text-gray-500">续保次数</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">¥{(currentUser?.annualPremium || 0).toLocaleString()}</p>
                  <p className="text-xs text-gray-500">年缴保费</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Member Benefits Summary */}
          <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100">
            <CardContent className="p-5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
                  <Crown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900">会员权益</p>
                  <p className="text-xs text-gray-500">当前{memberInfo.label}</p>
                </div>
              </div>
              <div className="space-y-2">
                {['保费95折优惠', '理赔优先通道', '免费道路救援', '专属客服经理'].map((benefit, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                    {benefit}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Personal Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <h3 className="font-semibold text-gray-900">个人信息</h3>
                <p className="text-sm text-gray-500">您的基本信息，用于保单和理赔</p>
              </div>
              {isEditing ? (
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>取消</Button>
                  <Button size="sm" onClick={handleSave}>
                    <Save className="w-4 h-4 mr-1" />
                    保存
                  </Button>
                </div>
              ) : (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  <Edit3 className="w-4 h-4 mr-1" />
                  编辑
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <User className="w-4 h-4 inline mr-1.5" />
                    真实姓名
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{currentUser?.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <Phone className="w-4 h-4 inline mr-1.5" />
                    手机号
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{currentUser?.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <Mail className="w-4 h-4 inline mr-1.5" />
                    邮箱
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">{currentUser?.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <IdCard className="w-4 h-4 inline mr-1.5" />
                    身份证号
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.idCard}
                      onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-900 font-medium">
                      {currentUser?.idCard.replace(/^(.{6})(.+)(.{4})$/, '$1********$3')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <Calendar className="w-4 h-4 inline mr-1.5" />
                    注册时间
                  </label>
                  <p className="text-gray-900 font-medium">{currentUser?.createTime}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1.5">
                    <Shield className="w-4 h-4 inline mr-1.5" />
                    用户角色
                  </label>
                  <p className="text-gray-900 font-medium">
                    {currentUser?.role === 'admin' ? '管理员' : currentUser?.role === 'agent' ? '代理人' : '客户'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-gray-900">账户安全</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">登录密码</p>
                    <p className="text-sm text-gray-500">上次修改：3个月前</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">修改密码</Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                    <Phone className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">手机验证</p>
                    <p className="text-sm text-gray-500">已绑定：{currentUser?.phone.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')}</p>
                  </div>
                </div>
                <Badge variant="success">已验证</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center">
                    <Mail className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">邮箱验证</p>
                    <p className="text-sm text-gray-500">已绑定：{currentUser?.email}</p>
                  </div>
                </div>
                <Badge variant="success">已验证</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}
