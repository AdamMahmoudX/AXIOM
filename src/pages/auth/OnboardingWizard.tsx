import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { OnboardingProvider, useOnboarding } from '../../context/OnboardingContext';

const steps = [
  { path: 'step-1', title: 'المعلومات الأساسية' },
  { path: 'step-2', title: 'رفع المستندات' },
  { path: 'step-3', title: 'الشروط والأحكام' },
  { path: 'step-4', title: 'عرض عقد العمل' },
  { path: 'step-5', title: 'التوقيع والبصمة' },
  { path: 'step-6', title: 'مراجعة وإرسال' },
];

const stepIndex = (path: string): number => steps.findIndex((step) => step.path === path);

const WizardShell: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const currentStep = useMemo(() => stepIndex(location.pathname.split('/').pop() || 'step-1'), [location.pathname]);

  return (
    <div className="min-h-screen bg-[#050505] text-white py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl rounded-[32px] border border-white/10 bg-[#0b1221]/90 shadow-2xl shadow-blue-500/10 overflow-hidden">
        <div className="bg-[#09101b] px-8 py-6 border-b border-white/10">
          <h1 className="text-3xl font-semibold">إنشاء حساب الموظف</h1>
          <p className="mt-2 text-gray-400">اتبع الخطوات لإكمال بياناتك وإرسال الطلب للمراجعة.</p>
          <div className="mt-6 grid gap-2 sm:grid-cols-3">
            {steps.map((item, index) => (
              <div key={item.path} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">الخطوة {index + 1}</p>
                <p className="mt-2 text-sm font-semibold text-white">{item.title}</p>
                <div className="mt-3 h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-blue-500 transition-all"
                    style={{ width: `${Math.min(((currentStep + 1) / steps.length) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="px-8 py-10">
          {children}
        </div>
      </div>
    </div>
  );
};

const StepOne: React.FC = () => {
  const { data, updateField } = useOnboarding();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<string>('');

  const handleNext = () => {
    if (!data.fullNameAr.trim() || !data.fullNameEn.trim() || !data.phone.trim()) {
      setErrors('يرجى ملء جميع الحقول المطلوبة.');
      return;
    }
    setErrors('');
    navigate('../step-2');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">البيانات الأساسية</h2>
        <p className="text-gray-400">أدخل معلومات الاتصال الأساسية لتكملة ملفك.</p>
      </div>

      <div className="grid gap-6">
        <label className="space-y-3">
          <span className="text-sm text-gray-300">الاسم الرباعي بالعربية</span>
          <input
            type="text"
            value={data.fullNameAr}
            onChange={(e) => updateField('fullNameAr', e.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="مثل: أحمد محمد علي حسين"
          />
        </label>
        <label className="space-y-3">
          <span className="text-sm text-gray-300">الاسم الكامل بالإنجليزية</span>
          <input
            type="text"
            value={data.fullNameEn}
            onChange={(e) => updateField('fullNameEn', e.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="Example: Ahmed Mohamed Ali Hussain"
          />
        </label>
        <label className="space-y-3">
          <span className="text-sm text-gray-300">رقم الهاتف</span>
          <input
            type="tel"
            value={data.phone}
            onChange={(e) => updateField('phone', e.target.value)}
            className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            placeholder="05XXXXXXXX"
          />
        </label>
      </div>

      {errors && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{errors}</div>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleNext}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 font-semibold text-white shadow-lg shadow-blue-500/20"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const FileUploadField: React.FC<{
  label: string;
  preview?: { file?: File; url?: string };
  onChange: (file?: File, url?: string) => void;
}> = ({ label, preview, onChange }) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    onChange(file, url);
  };

  const clearFile = () => {
    onChange(undefined, undefined);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-white">{label}</p>
        {preview?.url && (
          <button
            type="button"
            onClick={clearFile}
            className="text-sm text-blue-300 hover:text-white"
          >
            إزالة
          </button>
        )}
      </div>
      <label className="block rounded-3xl border border-dashed border-white/10 bg-white/5 p-8 text-center cursor-pointer hover:border-blue-500/60">
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
        {preview?.url ? (
          <img src={preview.url} alt={label} className="mx-auto h-40 rounded-3xl object-cover" />
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-gray-400">انقر لتحميل أو اسحب الملف هنا</p>
            <p className="text-xs text-gray-500">JPG أو PNG، حتى 10 ميجا بايت</p>
          </div>
        )}
      </label>
    </div>
  );
};

const StepTwo: React.FC = () => {
  const { data, updateFilePreview } = useOnboarding();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleNext = () => {
    if (!data.profilePhoto?.file || !data.idCardFront?.file || !data.idCardBack?.file) {
      setMessage('يرجى رفع جميع الصور المطلوبة قبل المتابعة.');
      return;
    }
    setMessage('');
    navigate('../step-3');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">رفع المستندات</h2>
        <p className="text-gray-400">أضف الصورة الشخصية وصورة الهوية من الوجه والظهر.</p>
      </div>
      <div className="grid gap-6 lg:grid-cols-3">
        <FileUploadField
          label="الصورة الشخصية"
          preview={data.profilePhoto}
          onChange={(file, url) => updateFilePreview('profilePhoto', file, url)}
        />
        <FileUploadField
          label="صورة البطاقة - وجه"
          preview={data.idCardFront}
          onChange={(file, url) => updateFilePreview('idCardFront', file, url)}
        />
        <FileUploadField
          label="صورة البطاقة - ظهر"
          preview={data.idCardBack}
          onChange={(file, url) => updateFilePreview('idCardBack', file, url)}
        />
      </div>

      {message && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{message}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('../step-1')}
          className="rounded-3xl border border-white/10 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const StepThree: React.FC = () => {
  const { data, updateField } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!data.termsAccepted) {
      setError('يجب الموافقة على الشروط والأحكام للمتابعة.');
      return;
    }
    setError('');
    navigate('../step-4');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">الشروط والأحكام</h2>
        <p className="text-gray-400">راجع الشروط بعناية ثم أكد موافقتك عليها.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6 text-sm leading-7 text-gray-300 max-h-[420px] overflow-y-auto">
        <p className="mb-4 font-semibold text-white">الشروط والأحكام</p>
        <p>بالمتابعة، أوافق على تقديم معلوماتي الشخصية وصوري وفق سياسات الشركة، وأقر بأن البيانات المقدمة صحيحة ودقيقة.</p>
        <p className="mt-4">أفهم أن الحساب لن يُعتمد إلا بعد مراجعة الإدارة، وأن أي تعديل لاحق يخضع لعملية الموافقة.</p>
        <p className="mt-4">أتعهد بالتوقيع الإلكتروني على النص النهائي للعقد، وأقر بأن هذا التوقيع يُعد وثيقة قانونية.</p>
      </div>

      <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
        <input
          type="checkbox"
          checked={data.termsAccepted}
          onChange={(e) => updateField('termsAccepted', e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-300">
          أوافق على الشروط والأحكام وأقر بصحة المعلومات المقدمة.
        </div>
      </label>

      {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('../step-2')}
          className="rounded-3xl border border-white/10 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const StepFour: React.FC = () => {
  const { data, contractText, updateField } = useOnboarding();
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    const handleScroll = () => {
      setIsScrolled(element.scrollTop + element.clientHeight >= element.scrollHeight - 16);
    };
    element.addEventListener('scroll', handleScroll);
    return () => element.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNext = () => {
    if (!data.contractRead) return;
    navigate('../step-5');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">عرض عقد العمل الإلكتروني</h2>
        <p className="text-gray-400">اقرأ العقد كاملاً ثم أكد استكمال القراءة.</p>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
        <div ref={contentRef} className="max-h-[420px] overflow-y-auto pr-4 text-gray-300 leading-7">
          <pre className="whitespace-pre-wrap">{contractText}</pre>
        </div>
      </div>

      <label className="flex items-start gap-3 rounded-3xl border border-white/10 bg-white/5 p-5">
        <input
          type="checkbox"
          checked={data.contractRead}
          onChange={(e) => updateField('contractRead', e.target.checked)}
          className="mt-1 h-5 w-5 rounded border-gray-500 bg-[#0b1221] text-blue-500 focus:ring-blue-500"
        />
        <div className="text-sm text-gray-300">
          أؤكد أنني قرأت العقد بالكامل وأوافق على الشروط الموضحة فيه.
        </div>
      </label>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('../step-3')}
          className="rounded-3xl border border-white/10 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handleNext}
          disabled={!data.contractRead}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const SignatureCanvas: React.FC<{ onChange: (dataUrl: string) => void; resetSignal: number }> = ({ onChange, resetSignal }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }, [resetSignal]);

  const beginDrawing = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    setLastPoint(point);
    setIsDrawing(true);
  };

  const draw = (event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) return;

    const rect = canvas.getBoundingClientRect();
    const point = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    context.strokeStyle = '#ffffff';
    context.lineWidth = 4;
    context.lineCap = 'round';
    context.beginPath();
    context.moveTo(lastPoint.x, lastPoint.y);
    context.lineTo(point.x, point.y);
    context.stroke();

    setLastPoint(point);
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsDrawing(false);
    const dataUrl = canvasRef.current.toDataURL('image/png');
    onChange(dataUrl);
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const context = canvasRef.current.getContext('2d');
    if (!context) return;
    context.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    onChange('');
  };

  return (
    <div className="space-y-4">
      <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-4">
        <canvas
          ref={canvasRef}
          width={720}
          height={220}
          onPointerDown={beginDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          className="w-full rounded-3xl bg-white/5 shadow-inner shadow-black/10"
        />
      </div>
      <button
        type="button"
        onClick={clearCanvas}
        className="rounded-3xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-gray-200 hover:bg-white/10"
      >
        مسح التوقيع
      </button>
    </div>
  );
};

const StepFive: React.FC = () => {
  const { data, updateField, generateFingerprint } = useOnboarding();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [resetSignal, setResetSignal] = useState(0);

  const handleGenerate = () => {
    if (!data.confirmedFullName.trim()) {
      setError('يرجى كتابة اسمك الرباعي للتأكيد.');
      return;
    }
    if (!data.signatureDataUrl) {
      setError('يرجى رسم توقيعك قبل إنشاء البصمة الإلكترونية.');
      return;
    }
    setError('');
    generateFingerprint();
  };

  const handleNext = () => {
    if (!data.fingerprint) {
      setError('يرجى إنشاء البصمة الإلكترونية قبل المتابعة.');
      return;
    }
    setError('');
    navigate('../step-6');
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">التوقيع والبصمة الإلكترونية</h2>
        <p className="text-gray-400">أكمل التوقيع وإنتاج البصمة الرقمية لتأكيد العقد.</p>
      </div>

      <label className="space-y-3">
        <span className="text-sm text-gray-300">اكتب الاسم الرباعي كما في العقد</span>
        <input
          type="text"
          value={data.confirmedFullName}
          onChange={(e) => updateField('confirmedFullName', e.target.value)}
          className="w-full rounded-3xl border border-white/10 bg-[#0b1221] px-5 py-4 text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
          placeholder="أحمد محمد علي حسين"
        />
      </label>

      <div className="space-y-4">
        <p className="text-sm text-gray-300">رسم التوقيع</p>
        <SignatureCanvas onChange={(value) => updateField('signatureDataUrl', value)} resetSignal={resetSignal} />
      </div>

      <button
        type="button"
        onClick={() => {
          setResetSignal((prev) => prev + 1);
          updateField('signatureDataUrl', '');
        }}
        className="rounded-3xl border border-white/10 bg-white/5 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
      >
        إعادة ضبط التوقيع
      </button>

      <button
        type="button"
        onClick={handleGenerate}
        className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20"
      >
        إنشاء البصمة الإلكترونية
      </button>

      {data.fingerprint && (
        <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6 text-sm text-gray-200">
          <h3 className="text-lg font-semibold text-white">تفاصيل البصمة الرقمية</h3>
          <div className="mt-4 space-y-3">
            <p><span className="font-semibold text-white">الاسم:</span> {data.fingerprint.fullName}</p>
            <p><span className="font-semibold text-white">توقيع هاش:</span> {data.fingerprint.signatureHash}</p>
            <p><span className="font-semibold text-white">الوقت:</span> {new Date(data.fingerprint.timestamp).toLocaleString('ar-EG')}</p>
            <p><span className="font-semibold text-white">جهاز المستخدم:</span> {data.fingerprint.deviceFingerprint}</p>
            <p><span className="font-semibold text-white">هاش العقد:</span> {data.fingerprint.contractHash}</p>
          </div>
        </div>
      )}

      {error && <div className="rounded-3xl bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div>}

      <div className="flex justify-between">
        <button
          type="button"
          onClick={() => navigate('../step-4')}
          className="rounded-3xl border border-white/10 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
        >
          السابق
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20"
        >
          التالي
        </button>
      </div>
    </div>
  );
};

const StepSix: React.FC = () => {
  const { data, submitOnboarding } = useOnboarding();
  const navigate = useNavigate();

  const isReady = data.fullNameAr && data.fullNameEn && data.phone && data.profilePhoto && data.idCardFront && data.idCardBack && data.termsAccepted && data.contractRead && data.fingerprint;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">مراجعة وإرسال الطلب</h2>
        <p className="text-gray-400">راجع بياناتك وتأكد من صحة المعلومات قبل إرسال الطلب إلى الإدارة.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
          <h3 className="text-lg font-semibold text-white">البيانات الأساسية</h3>
          <dl className="mt-4 space-y-3 text-gray-300">
            <div><dt className="font-medium text-white">الاسم بالعربية</dt><dd>{data.fullNameAr}</dd></div>
            <div><dt className="font-medium text-white">الاسم بالإنجليزية</dt><dd>{data.fullNameEn}</dd></div>
            <div><dt className="font-medium text-white">رقم الهاتف</dt><dd>{data.phone}</dd></div>
          </dl>
        </div>
        <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
          <h3 className="text-lg font-semibold text-white">المستندات</h3>
          <ul className="mt-4 space-y-3 text-gray-300">
            <li>• الصورة الشخصية: {data.profilePhoto?.url ? 'تم التحميل' : 'غير مرفوعة'}</li>
            <li>• البطاقة وجه: {data.idCardFront?.url ? 'تم التحميل' : 'غير مرفوعة'}</li>
            <li>• البطاقة ظهر: {data.idCardBack?.url ? 'تم التحميل' : 'غير مرفوعة'}</li>
          </ul>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-[#0b1221] p-6">
        <h3 className="text-lg font-semibold text-white">الحالة</h3>
        <ul className="mt-4 space-y-2 text-gray-300">
          <li>• الشروط والأحكام: {data.termsAccepted ? 'موافق عليه' : 'غير موافق'}</li>
          <li>• قراءة العقد: {data.contractRead ? 'تمت' : 'لم تتم'}</li>
          <li>• البصمة الإلكترونية: {data.fingerprint ? 'جاهزة' : 'غير جاهزة'}</li>
        </ul>
      </div>

      <div className="flex justify-between items-center gap-4">
        <button
          type="button"
          onClick={() => navigate('../step-5')}
          className="rounded-3xl border border-white/10 px-6 py-4 text-sm text-gray-300 hover:border-blue-500 hover:text-white"
        >
          السابق
        </button>
        <button
          type="button"
          disabled={!isReady}
          onClick={submitOnboarding}
          className="rounded-3xl bg-gradient-to-r from-blue-600 to-blue-500 px-6 py-4 text-white font-semibold shadow-lg shadow-blue-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          إرسال الطلب للإدارة
        </button>
      </div>
    </div>
  );
};

const OnboardingWizard: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="h-16 w-16 rounded-full border-4 border-blue-500 border-t-transparent animate-spin" />
          <p>جارٍ تحميل بيانات التسجيل...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.authStatus === 'pending_approval') {
    return <Navigate to="/pending-approval" replace />;
  }

  if (user?.authStatus !== 'pending_review' && user?.authStatus !== 'pending_registration') {
    return <Navigate to="/login" replace />;
  }

  return (
    <WizardShell>
      <Routes>
        <Route index element={<Navigate to="step-1" replace />} />
        <Route path="step-1" element={<StepOne />} />
        <Route path="step-2" element={<StepTwo />} />
        <Route path="step-3" element={<StepThree />} />
        <Route path="step-4" element={<StepFour />} />
        <Route path="step-5" element={<StepFive />} />
        <Route path="step-6" element={<StepSix />} />
        <Route path="*" element={<Navigate to="step-1" replace />} />
      </Routes>
    </WizardShell>
  );
};

const OnboardingWizardPage: React.FC = () => (
  <OnboardingProvider>
    <OnboardingWizard />
  </OnboardingProvider>
);

export default OnboardingWizardPage;
