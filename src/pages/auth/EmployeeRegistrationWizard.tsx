import React, { useMemo, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface FilePreview {
  file?: File;
  url?: string;
}

interface RegistrationState {
  fullName: string;
  nationalId: string;
  phone: string;
  country: string;
  verificationSent: boolean;
  verificationCode: string;
  enteredCode: string;
  isVerified: boolean;
  password: string;
  confirmPassword: string;
  profilePhoto?: FilePreview;
  idCardFront?: FilePreview;
  idCardBack?: FilePreview;
  termsAccepted: boolean;
  contractRead: boolean;
  signatureDataUrl: string;
  signatureHash: string;
  hasSigned: boolean;
}

const countries = [
  { value: 'eg', label: 'مصر' },
  { value: 'sa', label: 'السعودية' },
  { value: 'ae', label: 'الإمارات' },
  { value: 'jo', label: 'الأردن' },
  { value: 'kw', label: 'الكويت' },
];

const steps = [
  { label: 'البيانات الأساسية' },
  { label: 'إثبات الهوية' },
  { label: 'الصورة الشخصية' },
  { label: 'عقد العمل والتوقيع' },
  { label: 'مراجعة البيانات' },
];

const formatPhoneNumber = (value: string): string => value.replace(/\D/g, '');
const createVerificationCode = (): string => Math.floor(100000 + Math.random() * 900000).toString();
const hashValue = (value: string): string => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return `SIG-${Math.abs(hash)}`;
};

const fileToDataUrl = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Unable to read file content')); 
      }
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });

const WizardCard: React.FC<{ children: React.ReactNode; title: string; subtitle: string }> = ({ children, title, subtitle }) => (
  <div className="min-h-screen bg-[#050505] py-10 px-4 sm:px-6 lg:px-8">
    <div className="mx-auto w-full max-w-4xl rounded-[32px] border border-white/10 bg-[#0b1221]/95 shadow-2xl shadow-blue-500/10 overflow-hidden">
      <div className="bg-[#09101b] px-8 py-6 border-b border-white/10">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-2 text-gray-400">{subtitle}</p>
      </div>
      <div className="px-8 py-10">{children}</div>
    </div>
  </div>
);

const StepIndicator: React.FC<{ active: number }> = ({ active }) => (
  <div className="mb-8 grid gap-3 sm:grid-cols-5">
    {steps.map((step, index) => (
      <div key={step.label} className={`rounded-3xl border p-4 text-center ${index <= active ? 'border-blue-500 bg-blue-500/10' : 'border-white/10 bg-white/5'}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">الخطوة {index + 1}</p>
        <p className="mt-2 text-sm font-semibold text-white">{step.label}</p>
      </div>
    ))}
  </div>
);

const UploadCard: React.FC<{
  label: string;
  preview?: FilePreview;
  onChange: (file?: File, url?: string) => void;
}> = ({ label, preview, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  const clearFile = () => {
    if (inputRef.current) inputRef.current.value = '';
    onChange(undefined, undefined);
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">{label}</p>
        {preview?.url && (
          <button type="button" onClick={clearFile} className="text-sm text-blue-300 hover:text-white">
            إزالة
          </button>
        )}
      </div>
      <label className="block rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center cursor-pointer hover:border-blue-500/60">
        <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        {preview?.url ? (
          <img src={preview.url} alt={label} className="mx-auto h-40 w-full max-w-sm rounded-3xl object-cover" />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">انقر لتحميل الصورة أو اسحب الملف هنا</p>
            <p className="text-xs text-gray-500">JPG أو PNG، حتى 10 ميجا بايت</p>
          </div>
        )}
      </label>
    </div>
  );
};

const SignatureCanvas: React.FC<{ value: string; onChange: (dataUrl: string) => void }> = ({ value, onChange }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
    onChange('');
  };

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    setLastPoint({ x: event.clientX - rect.left, y: event.clientY - rect.top });
    setIsDrawing(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint || !canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const nextPoint = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    context.strokeStyle = '#fff';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(nextPoint.x, nextPoint.y);
    context.stroke();
    setLastPoint(nextPoint);
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onChange(dataUrl);
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-4">
        <canvas
          ref={canvasRef}
          width={700}
          height={220}
          className="w-full rounded-3xl bg-white/5 shadow-inner shadow-black/10"
          onPointerDown={beginDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
        />
      </div>
      <button type="button" onClick={clearCanvas} className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-200 hover:bg-white/10">
        مسح التوقيع
      </button>
      {value && <p className="text-sm text-gray-300">تم حفظ التوقيع إلكترونيًا.</p>}
    </div>
  );
};

const EmployeeRegistrationWizard: React.FC = () => {
  const [step, setStep] = useState(0);
  const [state, setState] = useState<RegistrationState>({
    fullName: '',
    nationalId: '',
    phone: '',
    country: '',
    verificationSent: false,
    verificationCode: '',
    enteredCode: '',
    isVerified: false,
    password: '',
    confirmPassword: '',
    profilePhoto: undefined,
    idCardFront: undefined,
    idCardBack: undefined,
    termsAccepted: false,
    contractRead: false,
    signatureDataUrl: '',
    signatureHash: '',
    hasSigned: false,
  });
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState('');
  const { registerEmployee } = useAuth();
  const navigate = useNavigate();

  const activeStepLabel = useMemo(() => steps[step]?.label || '', [step]);

  const updateField = <K extends keyof RegistrationState>(field: K, value: RegistrationState[K]) => {
    setState((prev) => ({ ...prev, [field]: value }));
  };

  const updateFilePreview = (field: 'profilePhoto' | 'idCardFront' | 'idCardBack', file?: File, url?: string) => {
    setState((prev) => ({
      ...prev,
      [field]: file || url ? { file, url } : undefined,
    }));
  };

  const sendVerificationCode = () => {
    if (!state.phone || !state.nationalId || !state.fullName || !state.country) {
      setMessage('يرجى ملء الحقول الأساسية قبل إرسال رمز التحقق.');
      return;
    }
    const code = createVerificationCode();
    updateField('verificationCode', code);
    updateField('verificationSent', true);
    updateField('isVerified', false);
    setMessage(`تم إرسال رمز التحقق إلى رقم الهاتف. الرمز التجريبي: ${code}`);
  };

  const verifyCode = () => {
    if (!state.enteredCode) {
      setMessage('يرجى إدخال رمز التحقق.');
      return;
    }
    if (state.enteredCode !== state.verificationCode) {
      setMessage('الرمز غير صحيح. حاول مرة أخرى.');
      return;
    }
    updateField('isVerified', true);
    setMessage('تم التحقق من رقم الهاتف بنجاح.');
  };

  const stepValidations = [
    () => {
      if (!state.fullName.trim() || !state.nationalId.trim() || !state.phone.trim() || !state.country.trim()) {
        setMessage('يرجى ملء جميع الحقول الأساسية.');
        return false;
      }
      if (!state.verificationSent) {
        setMessage('يرجى إرسال رمز التحقق أولاً.');
        return false;
      }
      if (!state.isVerified) {
        setMessage('يرجى التحقق من رمز التحقق.');
        return false;
      }
      if (!state.password || !state.confirmPassword) {
        setMessage('يرجى تعيين كلمة المرور وتأكيدها.');
        return false;
      }
      if (state.password !== state.confirmPassword) {
        setMessage('كلمتا المرور غير متطابقتين.');
        return false;
      }
      return true;
    },
    () => {
      if (!state.idCardFront?.file || !state.idCardBack?.file) {
        setMessage('يرجى رفع صور البطاقة الأمامية والخلفية.');
        return false;
      }
      return true;
    },
    () => {
      if (!state.profilePhoto?.file) {
        setMessage('يرجى رفع الصورة الشخصية.');
        return false;
      }
      return true;
    },
    () => {
      if (!state.termsAccepted) {
        setMessage('يجب الموافقة على الشروط والأحكام للمتابعة.');
        return false;
      }
      if (!state.contractRead) {
        setMessage('يرجى تأكيد قراءة عقد العمل.');
        return false;
      }
      if (!state.signatureDataUrl) {
        setMessage('يجب رسم التوقيع الإلكتروني للمتابعة.');
        return false;
      }
      return true;
    },
    () => true,
  ];

  const goNext = async () => {
    setMessage('');
    if (!stepValidations[step]()) return;
    setStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const goBack = () => {
    setMessage('');
    setStep((prev) => Math.max(prev - 1, 0));
  };

  const createAccount = async () => {
    setSubmissionError('');
    setIsSubmitting(true);
    try {
      const profilePhotoUrl = state.profilePhoto?.file ? await fileToDataUrl(state.profilePhoto.file) : state.profilePhoto?.url;
      const idCardFrontUrl = state.idCardFront?.file ? await fileToDataUrl(state.idCardFront.file) : state.idCardFront?.url;
      const idCardBackUrl = state.idCardBack?.file ? await fileToDataUrl(state.idCardBack.file) : state.idCardBack?.url;

      const result = await registerEmployee({
        fullName: state.fullName,
        nationalId: state.nationalId,
        phone: state.phone,
        country: state.country,
        password: state.password,
        rememberMe: false,
        profilePhotoUrl,
        idCardFrontUrl,
        idCardBackUrl,
        personalPhotoUrl: profilePhotoUrl,
        termsAccepted: state.termsAccepted,
        contractRead: state.contractRead,
        signatureDataUrl: state.signatureDataUrl,
      });

      if (!result.success) {
        setSubmissionError(result.error || 'تعذر إنشاء الحساب. حاول مرة أخرى.');
        setIsSubmitting(false);
        return;
      }

      navigate('/employee-pending', { replace: true });
    } catch (error) {
      console.error(error);
      setSubmissionError('حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة لاحقًا.');
      setIsSubmitting(false);
    }
  };

  if (import.meta.env.PROD) {
    return (
      <main className="min-h-screen bg-[#050505] flex items-center justify-center p-6 text-center">
        <div className="max-w-lg">
          <h1 className="text-2xl font-bold text-white">التسجيل غير متاح</h1>
          <p className="mt-3 text-gray-400">
            يلزم ربط خدمة تسجيل وتحقق حقيقية قبل استقبال بيانات الموظفين.
          </p>
        </div>
      </main>
    );
  }

  const renderStepContent = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">الخطوة 1: البيانات الأساسية</h2>
              <p className="text-gray-400">أدخل بياناتك الأساسية وحمّل رمز التحقق من الهاتف.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <label className="space-y-3">
                <span className="text-sm text-gray-300">الاسم الرباعي</span>
                <input
                  type="text"
                  value={state.fullName}
                  onChange={(e) => updateField('fullName', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="أحمد محمد علي حسين"
                />
              </label>
              <label className="space-y-3">
                <span className="text-sm text-gray-300">الرقم القومي</span>
                <input
                  type="text"
                  value={state.nationalId}
                  onChange={(e) => updateField('nationalId', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="12345678901234"
                />
              </label>
              <label className="space-y-3">
                <span className="text-sm text-gray-300">رقم الهاتف</span>
                <input
                  type="tel"
                  value={state.phone}
                  onChange={(e) => updateField('phone', formatPhoneNumber(e.target.value))}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="0501234567"
                />
              </label>
              <label className="space-y-3">
                <span className="text-sm text-gray-300">الدولة</span>
                <select
                  value={state.country}
                  onChange={(e) => updateField('country', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">اختر الدولة</option>
                  {countries.map((country) => (
                    <option key={country.value} value={country.label} className="bg-[#0b1221] text-white">
                      {country.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid gap-6 sm:grid-cols-3">
              <div className="space-y-3">
                <span className="text-sm text-gray-300">رمز التحقق</span>
                <button
                  type="button"
                  onClick={sendVerificationCode}
                  className="w-full rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-5 py-4 font-semibold text-white shadow-lg shadow-blue-500/20"
                >
                  إرسال رمز التحقق
                </button>
              </div>
              <label className="space-y-3">
                <span className="text-sm text-gray-300">أدخل رمز التحقق</span>
                <input
                  type="text"
                  value={state.enteredCode}
                  onChange={(e) => updateField('enteredCode', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="123456"
                />
              </label>
              <div className="space-y-3">
                <span className="text-sm text-gray-300">الحالة</span>
                <button
                  type="button"
                  onClick={verifyCode}
                  className={`w-full rounded-3xl px-5 py-4 font-semibold ${state.isVerified ? 'bg-emerald-500 text-white' : 'bg-white/5 text-white hover:bg-white/10'}`}
                >
                  {state.isVerified ? 'تم التحقق' : 'تحقق'}
                </button>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <label className="space-y-3">
                <span className="text-sm text-gray-300">كلمة المرور</span>
                <input
                  type="password"
                  value={state.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="******"
                />
              </label>
              <label className="space-y-3">
                <span className="text-sm text-gray-300">تأكيد كلمة المرور</span>
                <input
                  type="password"
                  value={state.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  placeholder="******"
                />
              </label>
            </div>

          </div>
        );
      case 1:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">الخطوة 2: إثبات الهوية</h2>
              <p className="text-gray-400">ارفع نسخ البطاقة الأمامية والخلفية مع معاينتها.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <UploadCard
                label="صورة البطاقة - الأمامية"
                preview={state.idCardFront}
                onChange={(file, url) => updateFilePreview('idCardFront', file, url)}
              />
              <UploadCard
                label="صورة البطاقة - الخلفية"
                preview={state.idCardBack}
                onChange={(file, url) => updateFilePreview('idCardBack', file, url)}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">الخطوة 3: الصورة الشخصية</h2>
              <p className="text-gray-400">ارفع صورتك الشخصية مع المعاينة قبل المتابعة.</p>
            </div>
            <UploadCard
              label="الصورة الشخصية"
              preview={state.profilePhoto}
              onChange={(file, url) => updateFilePreview('profilePhoto', file, url)}
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">الخطوة 4: عقد العمل والشروط</h2>
              <p className="text-gray-400">راجع العقد، وافق على الشروط ووقّع إلكترونيًا.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
              <div className="max-h-[340px] overflow-y-auto pr-4 text-gray-300 leading-7">
                <p className="font-semibold text-white mb-4">عقد العمل</p>
                <p>أتعهد بتقديم معلومات دقيقة وصحيحة، وأقر بأن بياناتي ستخضع للمراجعة من قبل الإدارة. كما أقر بأنني لم أقدم بيانات مزيفة وأنني أوافق على الالتزام بسياسات الشركة الداخلية.</p>
                <p className="mt-4">أوافق على استخدام هذا التوقيع الإلكتروني كجزء من إصدار العقد وأنه قابل للاعتماد قانونياً في إطار العلاقة بيني وبين الشركة.</p>
                <p className="mt-4">سيتم الاحتفاظ بالبيانات والمستندات بطريقة آمنة، وستستخدم فقط في إجراءات القبول والمراجعة الإدارية.</p>
              </div>
            </div>
            <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <input
                type="checkbox"
                checked={state.termsAccepted}
                onChange={(e) => updateField('termsAccepted', e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-300">
                أوافق على الشروط والأحكام وأقر بأنني أوافق على البنود المذكورة في عقد العمل.
              </div>
            </label>
            <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
              <input
                type="checkbox"
                checked={state.contractRead}
                onChange={(e) => updateField('contractRead', e.target.checked)}
                className="mt-1 h-5 w-5 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
              />
              <div className="text-sm text-gray-300">
                أؤكد أنني قرأت عقد العمل بالكامل.
              </div>
            </label>
            <div className="space-y-4">
              <p className="text-sm font-semibold text-white">التوقيع الإلكتروني</p>
              <SignatureCanvas value={state.signatureDataUrl} onChange={(value) => updateField('signatureDataUrl', value)} />
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">الخطوة 5: مراجعة البيانات</h2>
              <p className="text-gray-400">راجع جميع البيانات قبل إنشاء الحساب وإرسال الطلب.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
                <h3 className="text-lg font-semibold text-white">البيانات الشخصية</h3>
                <dl className="mt-4 space-y-3 text-gray-300">
                  <div>
                    <dt className="font-medium text-white">الاسم الرباعي</dt>
                    <dd>{state.fullName || 'غير محدد'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-white">الرقم القومي</dt>
                    <dd>{state.nationalId || 'غير محدد'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-white">رقم الهاتف</dt>
                    <dd>{state.phone || 'غير محدد'}</dd>
                  </div>
                  <div>
                    <dt className="font-medium text-white">الدولة</dt>
                    <dd>{state.country || 'غير محدد'}</dd>
                  </div>
                </dl>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
                <h3 className="text-lg font-semibold text-white">الحالة والمستندات</h3>
                <ul className="mt-4 space-y-3 text-gray-300">
                  <li>• تم التحقق من الهاتف: {state.isVerified ? 'نعم' : 'لا'}</li>
                  <li>• تم قراءة العقد: {state.contractRead ? 'نعم' : 'لا'}</li>
                  <li>• تم توقيع العقد: {state.signatureDataUrl ? 'نعم' : 'لا'}</li>
                </ul>
              </div>
            </div>
            <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
              <h3 className="text-lg font-semibold text-white">معاينة الملفات</h3>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="rounded-3xl bg-white/5 p-4 text-gray-300">
                  <p className="font-medium text-white mb-3">صورتك الشخصية</p>
                  {state.profilePhoto?.url ? <img src={state.profilePhoto.url} alt="Profile" className="h-40 w-full rounded-3xl object-cover" /> : <p>غير مرفوعة</p>}
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-gray-300">
                  <p className="font-medium text-white mb-3">هوية - وجه</p>
                  {state.idCardFront?.url ? <img src={state.idCardFront.url} alt="ID Front" className="h-40 w-full rounded-3xl object-cover" /> : <p>غير مرفوعة</p>}
                </div>
                <div className="rounded-3xl bg-white/5 p-4 text-gray-300">
                  <p className="font-medium text-white mb-3">هوية - ظهر</p>
                  {state.idCardBack?.url ? <img src={state.idCardBack.url} alt="ID Back" className="h-40 w-full rounded-3xl object-cover" /> : <p>غير مرفوعة</p>}
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <WizardCard title="إنشاء حساب موظف جديد" subtitle="أكمل الخطوات الخمس لإرسال طلب التسجيل إلى الإدارة.">
      <StepIndicator active={step} />
      {renderStepContent()}
      {message && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</div>}
      {submissionError && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{submissionError}</div>}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-between">
        <button
          type="button"
          onClick={goBack}
          disabled={step === 0}
          className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-gray-300 transition hover:border-blue-500 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          السابق
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20"
          >
            التالي
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={createAccount}
            className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'جارٍ الإنشاء...' : 'إنشاء الحساب'}
          </button>
        )}
      </div>
    </WizardCard>
  );
};

export default EmployeeRegistrationWizard;
