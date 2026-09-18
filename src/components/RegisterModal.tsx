import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Building2, User, Mail, Phone, Lock, ChevronRight, Briefcase, Upload, CheckCircle2, AlertTriangle, ChevronLeft } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { PasswordFieldsWithSuggestion } from "./ui/PasswordStrengthInput";

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

  const handleClose = () => {
    setRole("");
    setOtpPhone("");
    setOtpRole("");
    onClose();
  };

  const handleRegisterSuccess = (phone: string, r: string) => {
    setOtpPhone(phone);
    setOtpRole(r);
  };

  // Close on Escape key press, Lock Body Scroll, & Reset State when Modal Closes
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    } else {
      setRole("");
      setOtpPhone("");
      setOtpRole("");
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
      data-lenis-prevent
      className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-sky-950/60 backdrop-blur-md overflow-hidden animate-in fade-in duration-200"
    >
      <div 
        data-lenis-prevent
        className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl w-full max-w-lg relative animate-in fade-in zoom-in-95 duration-200 my-auto border border-sky-100 flex flex-col max-h-[85vh] sm:max-h-[90vh] overflow-hidden"
      >
        <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px] z-30"></div>
        
        {/* Authoritative Fixed Top Header with Title & Prominent Close Button */}
        <div className="bg-white/95 backdrop-blur-md px-6 py-4 border-b border-sky-100 flex items-center justify-between z-40 shrink-0">
          <div className="flex items-center gap-3">
            {role && !otpPhone && (
              <button 
                type="button" 
                onClick={() => setRole("")} 
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
                title="Back to Buyer/Vendor selection"
              >
                <ChevronLeft size={18} />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                {otpPhone ? "Verify Mobile Number" : role === "BUYER" ? "Create Buyer Account" : role === "VENDOR" ? "Vendor Registration" : "Join Bussinest"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {otpPhone ? "Enter 6-digit OTP code" : role === "BUYER" ? "Post RFQs & source from verified suppliers" : role === "VENDOR" ? "Offer services & receive qualified leads" : "Choose account type to get started"}
              </p>
            </div>
          </div>
          <button 
            type="button"
            onClick={handleClose} 
            className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors cursor-pointer flex items-center justify-center shrink-0 ml-4 shadow-xs"
            title="Close modal (Esc)"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div 
          data-lenis-prevent
          onWheel={(e) => e.stopPropagation()}
          className="overflow-y-auto flex-1 overscroll-contain custom-scrollbar"
        >
          {otpPhone ? (
            <OtpVerification phone={otpPhone} role={otpRole} onClose={onClose} />
          ) : !role ? (
            <div className="p-6 sm:p-8">
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
              
              <div className="mt-8 text-center space-y-2">
                <p className="text-slate-500 font-medium text-sm">
                  Already have an account? <button onClick={() => { onClose(); onOpenLogin(); }} className="text-indigo-600 font-bold hover:underline">Log in</button>
                </p>
                <div>
                  <button type="button" onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer">
                    Cancel & Close Modal
                  </button>
                </div>
              </div>
            </div>
          ) : role === "BUYER" ? (
            <BuyerForm onClose={onClose} onOpenLogin={onOpenLogin} onSuccess={handleRegisterSuccess} />
          ) : (
            <VendorForm onClose={onClose} onOpenLogin={onOpenLogin} onSuccess={handleRegisterSuccess} />
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// BUYER FORM
// ==========================================
function BuyerForm({ onClose, onOpenLogin, onSuccess }: { onClose: () => void, onOpenLogin: () => void, onSuccess: (phone: string, role: string) => void }) {
  const [apiError, setApiError] = useState("");
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(buyerSchema),
    defaultValues: { termsAccepted: true, password: "", confirmPassword: "" }
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
    <div className="p-6 sm:p-8">
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
        <PasswordFieldsWithSuggestion
          passwordValue={watch("password") || ""}
          confirmValue={watch("confirmPassword") || ""}
          onPasswordChange={(val) => setValue("password", val, { shouldValidate: true })}
          onConfirmChange={(val) => setValue("confirmPassword", val, { shouldValidate: true })}
          passwordError={errors.password?.message as string}
          confirmError={errors.confirmPassword?.message as string}
        />
        
        <div className="flex items-start gap-2 mt-4">
          <input type="checkbox" {...register("termsAccepted")} id="terms" className="mt-1" />
          <label htmlFor="terms" className="text-xs text-slate-600 font-medium">I agree to the Terms of Service and Privacy Policy</label>
        </div>
        {errors.termsAccepted && <p className="text-red-500 text-xs">{errors.termsAccepted.message as string}</p>}

        <button type="submit" disabled={isSubmitting} className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold py-4 rounded-xl shadow-lg mt-6 transition-colors">
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </form>
      <div className="mt-6 text-center space-y-2 pb-2">
        <p className="text-slate-500 font-medium text-sm">
          Already have an account? <button type="button" onClick={() => { onClose(); onOpenLogin(); }} className="text-indigo-600 font-bold hover:underline">Log in</button>
        </p>
        <div>
          <button type="button" onClick={onClose} className="text-xs font-bold text-slate-400 hover:text-slate-700 underline cursor-pointer">
            Cancel & Close Modal
          </button>
        </div>
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
  const form1 = useForm({
    resolver: zodResolver(vendorStep1Schema),
    defaultValues: { password: "", confirmPassword: "" }
  });
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
    <div className="p-6 sm:p-8">
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-extrabold uppercase bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full">Step {step} of 3</span>
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
          <PasswordFieldsWithSuggestion
            passwordValue={form1.watch("password") || ""}
            confirmValue={form1.watch("confirmPassword") || ""}
            onPasswordChange={(val) => form1.setValue("password", val, { shouldValidate: true })}
            onConfirmChange={(val) => form1.setValue("confirmPassword", val, { shouldValidate: true })}
            passwordError={form1.formState.errors.password?.message as string}
            confirmError={form1.formState.errors.confirmPassword?.message as string}
          />
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
          ].map(field => {
            const isUploaded = !!files[field.id];
            const file = files[field.id];
            const sizeStr = file ? ` (${(file.size / (1024 * 1024)).toFixed(2)} MB)` : "";

            return (
              <div
                key={field.id}
                className={`rounded-2xl p-3.5 flex items-center justify-between transition-all duration-200 border-2 ${
                  isUploaded
                    ? "border-emerald-500 bg-emerald-50/70 shadow-sm shadow-emerald-500/10"
                    : "border-slate-200 bg-slate-50 hover:bg-slate-100/70"
                }`}
              >
                <div className="flex items-center gap-3 overflow-hidden pr-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isUploaded
                        ? "bg-emerald-500 text-white shadow-sm shadow-emerald-600/30"
                        : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {isUploaded ? <CheckCircle2 size={20} /> : <Upload size={18} />}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-2">
                      <label className={`block text-xs font-bold ${isUploaded ? "text-emerald-950" : "text-slate-900"}`}>
                        {field.label}
                      </label>
                      {isUploaded && (
                        <span className="inline-flex items-center text-[10px] font-extrabold text-emerald-700 bg-emerald-100/90 px-1.5 py-0.5 rounded">
                          Uploaded
                        </span>
                      )}
                    </div>
                    <div className={`text-xs font-medium truncate max-w-[200px] sm:max-w-[240px] ${isUploaded ? "text-emerald-700 font-semibold" : "text-slate-400"}`}>
                      {file ? `${file.name}${sizeStr}` : "No file selected"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <label
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-sm ${
                      isUploaded
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-white border border-slate-300 hover:border-indigo-500 text-slate-700 hover:text-indigo-600"
                    }`}
                  >
                    {isUploaded ? "Change File" : "Choose File"}
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,image/*"
                      onChange={e => handleFileChange(e, field.id)}
                    />
                  </label>
                  {isUploaded && (
                    <button
                      type="button"
                      onClick={() => setFiles(prev => ({ ...prev, [field.id]: null }))}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Remove file"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

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
  const navigate = useNavigate();
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
      onClose();
      navigate(role === "BUYER" ? "/buyer/dashboard" : "/vendor/dashboard");
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
