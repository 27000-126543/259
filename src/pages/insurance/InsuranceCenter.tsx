import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Star, 
  Check,
  ChevronRight,
  ShieldPlus,
  Info
} from 'lucide-react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store';
import type { InsuranceProduct } from '@/types';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'health', label: '健康险' },
  { id: 'accident', label: '意外险' },
  { id: 'life', label: '寿险' },
  { id: 'education', label: '教育金' },
  { id: 'pension', label: '养老险' }
];

export default function InsuranceCenter() {
  const navigate = useNavigate();
  const { products } = useAppStore();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<InsuranceProduct | null>(null);
  const [showInsureModal, setShowInsureModal] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    insuredName: '',
    insuredIdCard: '',
    beneficiary: '',
    amount: 0
  });

  const filteredProducts = products.filter(p => {
    const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchSearch = p.name.includes(searchTerm) || p.description.includes(searchTerm);
    return matchCategory && matchSearch;
  });

  const handleInsure = (product: InsuranceProduct) => {
    setSelectedProduct(product);
    setFormData({
      ...formData,
      amount: product.minAmount
    });
    setStep(1);
    setShowInsureModal(true);
  };

  const handleSubmitInsure = () => {
    alert('投保成功！已生成电子保单');
    setShowInsureModal(false);
    navigate('/policies');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">投保中心</h1>
          <p className="text-gray-500 mt-1">智能推荐，为您和家人选择合适的保障</p>
        </div>
      </div>

      {/* Search and Filter */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="搜索保险产品..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Recommendation Banner */}
      <Card className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white border-0">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">AI智能推荐</h3>
                <p className="text-blue-100 text-sm">基于您的年龄、健康状况和历史保单，为您推荐最适合的保障方案</p>
              </div>
            </div>
            <Button variant="secondary" size="sm">
              查看推荐方案
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Product List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} hover className="overflow-hidden">
            <div className="relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-40 object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                {product.hot && <Badge variant="danger">热销</Badge>}
                {product.recommended && <Badge variant="info">推荐</Badge>}
              </div>
            </div>
            <CardContent className="p-5">
              <h3 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                {product.features.map((feature, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-md">
                    <Check className="w-3 h-3 text-green-500" />
                    {feature}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div>
                  <span className="text-2xl font-bold text-blue-600">¥{product.basePremium}</span>
                  <span className="text-sm text-gray-400 ml-1">起/年</span>
                </div>
                <Button onClick={() => handleInsure(product)}>
                  立即投保
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Insure Modal */}
      {showInsureModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-xl font-bold text-gray-900">投保 - {selectedProduct.name}</h3>
              <p className="text-sm text-gray-500 mt-1">请填写投保信息</p>
            </div>

            {/* Steps */}
            <div className="px-6 py-4 border-b border-gray-100">
              <div className="flex items-center justify-between">
                {['被保人信息', '保额选择', '确认支付'].map((label, idx) => (
                  <div key={idx} className="flex items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step > idx + 1 ? 'bg-green-500 text-white' : step === idx + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {step > idx + 1 ? <Check className="w-4 h-4" /> : idx + 1}
                    </div>
                    <span className={`ml-2 text-sm ${step >= idx + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
                      {label}
                    </span>
                    {idx < 2 && <div className={`w-12 h-0.5 mx-4 ${step > idx + 1 ? 'bg-green-500' : 'bg-gray-200'}`} />}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-6">
              {step === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">被保人姓名</label>
                    <input
                      type="text"
                      value={formData.insuredName}
                      onChange={(e) => setFormData({...formData, insuredName: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入被保人姓名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">被保人身份证号</label>
                    <input
                      type="text"
                      value={formData.insuredIdCard}
                      onChange={(e) => setFormData({...formData, insuredIdCard: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入身份证号"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">受益人</label>
                    <input
                      type="text"
                      value={formData.beneficiary}
                      onChange={(e) => setFormData({...formData, beneficiary: e.target.value})}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="请输入受益人姓名"
                    />
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">选择保额</label>
                    <div className="grid grid-cols-3 gap-3">
                      {[selectedProduct.minAmount, (selectedProduct.minAmount + selectedProduct.maxAmount) / 2, selectedProduct.maxAmount].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setFormData({...formData, amount})}
                          className={`p-4 border-2 rounded-xl text-center transition-colors ${
                            formData.amount === amount
                              ? 'border-blue-600 bg-blue-50'
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <p className="font-bold text-lg text-gray-900">{(amount / 10000).toFixed(0)}万</p>
                          <p className="text-xs text-gray-500">保额</p>
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-start gap-3">
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">保费计算</p>
                        <p className="text-sm text-gray-600 mt-1">
                          保额 {(formData.amount / 10000).toFixed(0)}万，对应保费约 ¥{Math.round(selectedProduct.basePremium * (formData.amount / selectedProduct.minAmount))} 元/年
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-xl space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-500">产品名称</span>
                      <span className="font-medium text-gray-900">{selectedProduct.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">被保人</span>
                      <span className="font-medium text-gray-900">{formData.insuredName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">受益人</span>
                      <span className="font-medium text-gray-900">{formData.beneficiary}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">保额</span>
                      <span className="font-medium text-gray-900">{(formData.amount / 10000).toFixed(0)}万</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3 flex justify-between">
                      <span className="text-gray-700 font-medium">首年保费</span>
                      <span className="text-xl font-bold text-blue-600">¥{Math.round(selectedProduct.basePremium * (formData.amount / selectedProduct.minAmount))}</span>
                    </div>
                  </div>
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input type="checkbox" className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="text-sm text-gray-600">我已阅读并同意《保险条款》和《投保须知》</span>
                  </label>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-between">
              <Button variant="ghost" onClick={() => setShowInsureModal(false)}>取消</Button>
              <div className="flex gap-3">
                {step > 1 && (
                  <Button variant="outline" onClick={() => setStep(step - 1)}>上一步</Button>
                )}
                {step < 3 ? (
                  <Button onClick={() => setStep(step + 1)}>下一步</Button>
                ) : (
                  <Button onClick={handleSubmitInsure}>确认投保</Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
