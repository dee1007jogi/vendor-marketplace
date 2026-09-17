import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Calendar, Clock, CheckCircle2, X, Phone, MessageSquare, 
  User, ShieldCheck, CreditCard, Sparkles, AlertCircle 
} from "lucide-react";

export interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendorName: string;
  category?: string;
  consultationFee?: number | string;
  appointmentFee?: number | string;
  phone?: string;
  whatsapp?: string;
}

const TIME_SLOTS = [
  "09:30 AM - 10:00 AM",
  "10:30 AM - 11:00 AM",
  "11:30 AM - 12:00 PM",
  "02:00 PM - 02:30 PM",
  "03:30 PM - 04:00 PM",
  "05:00 PM - 05:30 PM",
  "06:30 PM - 07:00 PM"
];

export const AppointmentModal: React.FC<AppointmentModalProps> = ({
  isOpen,
  onClose,
  vendorName,
  category = "Professional Services",
  consultationFee = 500,
  appointmentFee = 250,
  phone = "+91 98765 43210",
  whatsapp = "+91 98765 43210"
}) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [selectedSlot, setSelectedSlot] = useState(TIME_SLOTS[0]);
  const [serviceType, setServiceType] = useState("In-Person Consultation");
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [bookingId, setBookingId] = useState("");

  if (!isOpen) return null;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim() || !clientPhone.trim()) return;
    const generatedId = "APT-" + Math.floor(100000 + Math.random() * 900000);
    setBookingId(generatedId);
    setIsBooked(true);
  };

  const resetAndClose = () => {
    setIsBooked(false);
    setClientName("");
    setClientPhone("");
    setClientNotes("");
    onClose();
  };

  const whatsappMessage = encodeURIComponent(
    `Hello ${vendorName}, I would like to schedule an appointment for ${serviceType} on ${selectedDate} at ${selectedSlot}. (Ref: ${bookingId || "New Query"})`
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-sky-100 overflow-hidden text-slate-900 my-8"
        >
          {/* Header */}
          <div className="p-5 sm:p-6 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-700 text-white flex items-center justify-between relative">
            <div>
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-[10px] font-bold uppercase tracking-wider text-sky-100 inline-block mb-1">
                Schedule Appointment
              </span>
              <h3 className="text-xl font-bold font-heading">{vendorName}</h3>
              <p className="text-xs text-sky-100 font-medium">{category}</p>
            </div>
            <button
              onClick={resetAndClose}
              className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {!isBooked ? (
            <form onSubmit={handleBook} className="p-5 sm:p-6 space-y-4">
              {/* Fee Cards Summary */}
              <div className="grid grid-cols-2 gap-3 bg-sky-50/70 p-3.5 rounded-2xl border border-sky-100">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Consultation Fee</span>
                  <span className="text-base font-black text-slate-900">
                    ₹{typeof consultationFee === "number" ? consultationFee.toLocaleString() : consultationFee}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Booking Fee</span>
                  <span className="text-base font-black text-emerald-700">
                    ₹{typeof appointmentFee === "number" ? appointmentFee.toLocaleString() : appointmentFee}
                  </span>
                </div>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                  Service / Consultation Type
                </label>
                <select
                  value={serviceType}
                  onChange={(e) => setServiceType(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold outline-none focus:border-sky-500 focus:bg-white"
                >
                  <option value="In-Person Consultation">In-Person Visit / Consultation</option>
                  <option value="Video Call Appointment">Online Video Consultation</option>
                  <option value="On-Site Service Inspection">On-Site Service / Inspection</option>
                  <option value="Emergency Consultation">Urgent / Priority Slot</option>
                </select>
              </div>

              {/* Date & Time Selection */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Calendar size={13} className="text-sky-600" /> Select Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                    <Clock size={13} className="text-sky-600" /> Select Slot
                  </label>
                  <select
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-bold outline-none focus:border-sky-500"
                  >
                    {TIME_SLOTS.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Client Details */}
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    placeholder="Enter full name"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-sky-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 text-xs font-medium outline-none focus:border-sky-500"
                    required
                  />
                </div>
              </div>

              {/* Quick Contact Triggers */}
              <div className="flex items-center gap-2 pt-1">
                <a
                  href={`tel:${phone}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-slate-200 transition-colors"
                >
                  <Phone size={14} className="text-sky-600" />
                  <span>Call Provider</span>
                </a>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center gap-1.5 border border-emerald-200 transition-colors"
                >
                  <MessageSquare size={14} className="text-emerald-600 fill-emerald-600" />
                  <span>WhatsApp Chat</span>
                </a>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-bold text-sm rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer mt-2"
              >
                Confirm Appointment Slot
              </button>
            </form>
          ) : (
            /* Confirmation Success Screen */
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 size={32} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-slate-900">Appointment Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Booking ID: <strong className="text-sky-700 font-mono font-bold">{bookingId}</strong>
                </p>
              </div>

              <div className="bg-sky-50 p-4 rounded-2xl border border-sky-100 text-left text-xs space-y-2 text-slate-700 font-medium">
                <div className="flex justify-between">
                  <span className="text-slate-500">Service:</span>
                  <span className="font-bold text-slate-900">{serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Scheduled Date:</span>
                  <span className="font-bold text-slate-900">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-bold text-sky-800 font-bold">{selectedSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Client:</span>
                  <span className="font-bold text-slate-900">{clientName} ({clientPhone})</span>
                </div>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2"
                >
                  <MessageSquare size={16} /> Send Booking Slip to WhatsApp
                </a>
                <button
                  onClick={resetAndClose}
                  className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Close Window
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AppointmentModal;
