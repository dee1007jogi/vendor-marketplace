import React, { useState } from "react";
import { X, Building2, User, Mail, Phone, Lock, ChevronRight, Briefcase, Upload, CheckCircle2, AlertTriangle } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const buyerSchema = z.object({
  name: z.string().min(2, "Name must be 2-100 characters").max(100),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  companyName: z.string().max(200).optional(),
  gstNumber: z.string().optional(), // Removed strict regex for MVP convenience
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Must contain 1 uppercase and 1 number"),
  confirmPassword: z.string(),
  termsAccepted: z.literal(true, { message: "Must accept Terms of Service" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const vendorStep1Schema = z.object({
  businessName: z.string().min(2, "Business Name is required").max(200),
  contactPersonName: z.string().min(2, "Contact Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Enter a 10-digit Indian mobile number"),
  password: z.string().min(8, "Password must be at least 8 characters").regex(/^(?=.*[A-Z])(?=.*\d).+$/, "Must contain 1 uppercase and 1 number"),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

const vendorStep2Schema = z.object({
  gstNumber: z.string().min(15, "Invalid GST format"),
  panNumber: z.string().min(10, "Invalid PAN format"),
  businessType: z.string().min(1, "Required"),
  yearOfEstablishment: z.coerce.number().min(1900).max(new Date().getFullYear()),
  employees: z.string().min(1, "Required"),
  serviceCategories: z.string().min(1, "Select at least one category"),
  serviceAreas: z.string().min(1, "Select at least one area"),
});

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: any) => Promise<void>; // Not strictly used for multipart, handled internally or overridden
  onOpenLogin: () => void;
}

export default function RegisterModal({ isOpen, onClose, onRegister, onOpenLogin }: RegisterModalProps) {
  const [role, setRole] = useState<"BUYER" | "VENDOR" | "">("");
  const [otpPhone, setOtpPhone] = useState("");
  const [otpRole, setOtpRole] = useState("");

  const handleRegisterSuccess = (phone: string, r: string) => {
    setOtpPhone(phone);
    setOtpRole(r);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200 my-8">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors z-10">
          <X size={20} />
        </button>

        {otpPhone ? (
          <OtpVerification phone={otpPhone} role={otpRole} onClose={onClose} />
        ) : !role ? (
          <div className="p-8">
            <h2 className="text-2xl font-black text-slate-900 mb-6 text-center">Join VendiMatch</h2>
            <p className="text-slate-500 font-medium text-sm mb-6 text-center">How do you plan to use the platform?</p>
            
            <div className="space-y-4">
              <button onClick={() => setRole("BUYER")} className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left">
                <div className="p-4 rounded-full bg-slate-100 text-indigo-600"><Briefcase size={32} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">I am a Buyer</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">I want to post requirements and hire vendors.</p>
                </div>
              </button>

              <button onClick={() => setRole("VENDOR")} className="w-full flex items-center gap-4 p-6 rounded-2xl border-2 border-slate-200 bg-white hover:border-indigo-600 hover:bg-indigo-50 transition-all text-left">
                <div className="p-4 rounded-full bg-slate-100 text-indigo-600"><Building2 size={32} /></div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">I am a Vendor</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">I want to offer my services and get leads.</p>
                </div>
              </button>
            </div>
            
            <div className="mt-8 text-center">
              <p className="text-slate-500 font-medium text-sm">
                Already have an account? <button onClick={() => { onClose(); onOpenLogin(); }} className="text-indigo-600 font-bold hover:underline">Log in</button>
              </p>
            </div>
          </div>
        ) : role === "BUYER" ? (
          <BuyerForm onClose={onClose} onOpenLogin={onOpenLogin} onSuccess={handleRegisterSuccess} />
        ) : (
          <VendorForm onClose={onClose} onOpenLogin={onOpenLogin} onSuccess={handleRegisterSuccess} />
        )}
      </div>
    </div>
  );
}

// ==========================================
// BUYER FORM
// ==========================================
function BuyerForm({ onClose, onOpenLogin, onSuccess }: { onClose: () => void, onOpenLogin: () => void, onSuccess: (phone: string, role: string) => void }) {
  const [apiError, setApiError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(buyerSchema),
    defaultValues: { termsAccepted: true } // Pre-check for ease
  });

  const onSubmit = async (data: any) => {
    setApiError("");
    try {
      const response = await fetch("/api/auth/register/buyer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Registration failed");
      }
      
      // Trigger OTP Send
      await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: data.phone })
      });
      
      onSuccess(data.phone, "BUYER");
    } catch (err: any) {
      setApiError(err.message);
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-black text-slate-900 mb-6">Create Buyer Account</h2>
      {apiError && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl mb-6 text-center border border-red-100 flex items-center justify-center gap-2"><AlertTriangle size={16}/>{apiError}</div>}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name *</label>
          <input {...register("name")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="Rajesh Sharma" />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address *</label>
          <input type="email" {...register("email")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="rajesh@example.com" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone Number *</label>
          <input type="tel" {...register("phone")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="9876543210" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Company Name (Optional)</label>
          <input {...register("companyName")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="Tech Solutions Pvt Ltd" />
        </div>
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GST Number (Optional)</label>
          <input {...register("gstNumber")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900 uppercase" placeholder="27AAAAA1234B1Z" />
          {errors.gstNumber && <p className="text-red-500 text-xs mt-1">{errors.gstNumber.message as string}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password *</label>
            <input type="password" {...register("password")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="••••••••" />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm *</label>
            <input type="password" {...register("confirmPassword")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium text-slate-900" placeholder="••••••••" />
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message as string}</p>}
          </div>
        </div>
        
        <div className="flex items-start gap-2 mt-4">
          <input type="checkbox" {...register("termsAccepted")} id="terms" className="mt-1" />
          <label htmlFor="terms" className="text-xs text-slate-600 font-medium">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message as string}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-colors">
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <div className="mt-6 text-center">
        <p className="text-slate-500 font-medium text-sm">
          Already have an account? <button onClick={() => { onClose(); onOpenLogin(); }} className="text-indigo-600 font-bold hover:underline">Log in</button>
        </p>
      </div>
    </div>
  );
}

// ==========================================
// VENDOR FORM (Multi-step)
// ==========================================
function VendorForm({ onClose, onOpenLogin, onSuccess }: { onClose: () => void, onOpenLogin: () => void, onSuccess: (phone: string, role: string) => void }) {
  const [step, setStep] = useState(1);
  const [apiError, setApiError] = useState("");
  
  // Step 1 Form
  const form1 = useForm({ resolver: zodResolver(vendorStep1Schema) });
  // Step 2 Form
  const form2 = useForm({ resolver: zodResolver(vendorStep2Schema) });
  
  // Step 3 State
  const [files, setFiles] = useState<{ [key: string]: File | null }>({
    panFile: null, gstFile: null, aadhaarFile: null, registrationProofFile: null
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onStep1Submit = () => setStep(2);
  const onStep2Submit = () => setStep(3);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, key: string) => {
    if (e.target.files && e.target.files[0]) {
      setFiles(prev => ({ ...prev, [key]: e.target.files![0] }));
    }
  };

  const finalSubmit = async () => {
    if (!files.panFile || !files.gstFile || !files.aadhaarFile) {
      setApiError("PAN, GST, and Aadhaar documents are required.");
      return;
    }
    
    setIsSubmitting(true);
    setApiError("");

    try {
      const formData = new FormData();
      formData.append("step1", JSON.stringify(form1.getValues()));
      
      // Transform Step2 data for DB compatibility (arrays vs strings)
      const s2Data = form2.getValues();
      const transformedS2Data = {
        ...s2Data,
        serviceCategories: [s2Data.serviceCategories],
        serviceAreas: [s2Data.serviceAreas]
      };
      formData.append("step2", JSON.stringify(transformedS2Data));
      
      formData.append("panFile", files.panFile);
      formData.append("gstFile", files.gstFile);
      formData.append("aadhaarFile", files.aadhaarFile);
      if (files.registrationProofFile) {
        formData.append("registrationProofFile", files.registrationProofFile);
      }

      const response = await fetch("/api/auth/register/vendor", {
        method: "POST",
        body: formData // No Content-Type header so browser sets multipart boundary automatically
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Registration failed");
      }
      
      const resData = await response.json();
      
      // Trigger OTP Send
      await fetch("/api/auth/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: form1.getValues().phone })
      });
      
      onSuccess(form1.getValues().phone, "VENDOR");
    } catch (err: any) {
      setApiError(err.message);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black text-slate-900">Vendor Registration</h2>
        <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-md">Step {step} of 3</span>
      </div>

      {apiError && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl mb-6 text-center border border-red-100">{apiError}</div>}

      {/* STEP 1 */}
      <div className={step === 1 ? "block" : "hidden"}>
        <form onSubmit={form1.handleSubmit(onStep1Submit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Name *</label>
            <input {...form1.register("businessName")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
            {form1.formState.errors.businessName && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.businessName.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Contact Person *</label>
            <input {...form1.register("contactPersonName")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
            {form1.formState.errors.contactPersonName && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.contactPersonName.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email *</label>
            <input type="email" {...form1.register("email")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
            {form1.formState.errors.email && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.email.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Phone *</label>
            <input type="tel" {...form1.register("phone")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
            {form1.formState.errors.phone && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.phone.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Password *</label>
              <input type="password" {...form1.register("password")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
              {form1.formState.errors.password && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.password.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Confirm *</label>
              <input type="password" {...form1.register("confirmPassword")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
              {form1.formState.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{form1.formState.errors.confirmPassword.message as string}</p>}
            </div>
          </div>
          <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg mt-6">Next</button>
        </form>
      </div>

      {/* STEP 2 */}
      <div className={step === 2 ? "block" : "hidden"}>
        <form onSubmit={form2.handleSubmit(onStep2Submit)} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">GST Number *</label>
            <input {...form2.register("gstNumber")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium uppercase" />
            {form2.formState.errors.gstNumber && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.gstNumber.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">PAN Number *</label>
            <input {...form2.register("panNumber")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium uppercase" />
            {form2.formState.errors.panNumber && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.panNumber.message as string}</p>}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Business Type *</label>
              <select {...form2.register("businessType")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium">
                <option value="">Select</option>
                <option value="Proprietorship">Proprietorship</option>
                <option value="Partnership">Partnership</option>
                <option value="Pvt Ltd">Pvt Ltd</option>
              </select>
              {form2.formState.errors.businessType && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.businessType.message as string}</p>}
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Established *</label>
              <input type="number" {...form2.register("yearOfEstablishment")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium" />
              {form2.formState.errors.yearOfEstablishment && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.yearOfEstablishment.message as string}</p>}
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Employees *</label>
            <select {...form2.register("employees")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium">
              <option value="">Select Range</option>
              <option value="1-10">1-10</option>
              <option value="11-50">11-50</option>
              <option value="51-200">51-200</option>
              <option value="200+">200+</option>
            </select>
            {form2.formState.errors.employees && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.employees.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Category *</label>
            <select {...form2.register("serviceCategories")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium">
              <option value="">Select Category</option>
              <option value="Web Development">Web Development</option>
              <option value="App Development">App Development</option>
              <option value="Digital Marketing">Digital Marketing</option>
            </select>
            {form2.formState.errors.serviceCategories && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.serviceCategories.message as string}</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Primary Area *</label>
            <select {...form2.register("serviceAreas")} className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3 px-4 outline-none font-medium">
              <option value="">Select Area</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Remote">Remote</option>
            </select>
            {form2.formState.errors.serviceAreas && <p className="text-red-500 text-xs mt-1">{form2.formState.errors.serviceAreas.message as string}</p>}
          </div>
          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => setStep(1)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl">Back</button>
            <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg">Next</button>
          </div>
        </form>
      </div>

      {/* STEP 3 */}
      <div className={step === 3 ? "block" : "hidden"}>
        <div className="space-y-4">
          <p className="text-slate-500 font-medium text-sm mb-4">Please upload verification documents (Max 5MB each)</p>

          {[
            { id: "panFile", label: "PAN Card *" },
            { id: "gstFile", label: "GST Certificate *" },
            { id: "aadhaarFile", label: "Owner's Aadhaar *" },
            { id: "registrationProofFile", label: "Registration Proof (Optional)" },
          ].map(field => (
            <div key={field.id} className="border border-slate-200 rounded-xl p-3 flex items-center justify-between bg-slate-50">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">{field.label}</label>
                <div className="text-xs text-slate-500 font-medium max-w-[200px] truncate">
                  {files[field.id] ? files[field.id]?.name : "No file selected"}
                </div>
              </div>
              <label className="bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors">
                Choose File
                <input type="file" className="hidden" accept=".pdf,image/*" onChange={e => handleFileChange(e, field.id)} />
              </label>
            </div>
          ))}

          <div className="flex items-start gap-2 mt-6">
            <input type="checkbox" id="confirmData" className="mt-1" />
            <label htmlFor="confirmData" className="text-xs text-slate-600 font-medium">I confirm that all information is true and accurate.</label>
          </div>

          <div className="flex gap-4 mt-6">
            <button type="button" onClick={() => setStep(2)} disabled={isSubmitting} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-4 rounded-xl disabled:opacity-50">Back</button>
            <button type="button" onClick={finalSubmit} disabled={isSubmitting} className="flex-[2] bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-xl shadow-lg disabled:bg-indigo-400">
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}

// ==========================================
// OTP VERIFICATION
// ==========================================
function OtpVerification({ phone, role, onClose }: { phone: string, role: string, onClose: () => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  React.useEffect(() => {
    if (timeLeft > 0) {
      const t = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timeLeft]);

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, otp })
      });
      if (!res.ok) {
        const d = await res.json();
        throw new Error(d.error || "Verification failed");
      }
      const data = await res.json();
      localStorage.setItem("vendorMatchUserId", data.user.id);
      localStorage.setItem("vendorMatchToken", data.token);
      window.location.href = role === "BUYER" ? "/buyer/dashboard" : "/vendor/dashboard";
    } catch (e: any) {
      setError(e.message);
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    setTimeLeft(60);
    fetch("/api/auth/otp/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone })
    });
  };

  return (
    <div className="p-8 text-center">
      <h2 className="text-2xl font-black text-slate-900 mb-2">Verify Phone Number</h2>
      <p className="text-slate-500 font-medium mb-6">We've sent a 6-digit code to {phone}</p>
      
      {error && <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-xl mb-6">{error}</div>}

      <input 
        type="text" 
        value={otp} 
        onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0,6))}
        className="text-center text-3xl tracking-[1em] w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-4 outline-none font-bold text-slate-900 mb-6" 
        placeholder="------" 
      />

      <button onClick={handleVerify} disabled={loading || otp.length !== 6} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg transition-colors mb-4">
        {loading ? "Verifying..." : "Verify & Continue"}
      </button>

      <p className="text-sm font-bold text-slate-500">
        Didn't receive it?{" "}
        {timeLeft > 0 ? (
          <span className="text-slate-400">Resend in {timeLeft}s</span>
        ) : (
          <button onClick={resendOtp} className="text-indigo-600 hover:underline">Resend OTP</button>
        )}
      </p>
    </div>
  );
}
