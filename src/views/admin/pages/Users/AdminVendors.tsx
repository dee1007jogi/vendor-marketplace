import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminApi } from '../../hooks/useAdminApi';
import { 
  Search, Filter, Users, MapPin, Folder, Calendar, Download, 
  FileSpreadsheet, FileJson, Printer, ShieldCheck, Eye, EyeOff, 
  Phone, Mail, Building2, CreditCard, Award, ExternalLink, 
  ChevronRight, ChevronDown, CheckCircle2, AlertCircle, Clock,
  ArrowUpDown, RefreshCw, X, FileText, Lock, Sparkles, Navigation, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Extended Enriched Vendor Interface
export interface EnrichedVendor {
  id: string;
  userId: string;
  businessName: string;
  contactPerson: string;
  designation: string;
  email: string;
  phone: string;
  altPhone?: string;
  avatar?: string;
  category: string;
  categories: string[];
  services: string[];
  location: string;
  city: string;
  state: string;
  address: string;
  pincode: string;
  coordinates: [number, number];
  gstNumber: string;
  panNumber: string;
  msmeUdyamNumber: string;
  cinNumber: string;
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  creditScore: string;
  dealVolume: string;
  capacity: string;
  moq: string;
  pricingMin: number;
  pricingModel: string;
  responseTime: string;
  availability: string;
  verificationStatus: "approved" | "pending" | "rejected" | "suspended";
  subscriptionPlan: "free" | "silver" | "gold" | "enterprise";
  ratings: {
    avg: number;
    count: number;
    quality: number;
    timeliness: number;
    communication: number;
  };
  escrowProtected: boolean;
  joinedAt: string;
  leadCredits?: number;
}

// Fallback seed data generator if DB items are minimal
function generateFallbackEnrichedVendors(): EnrichedVendor[] {
  return [
    {
      id: "v-apex-1",
      userId: "user-vendor-1",
      businessName: "Apex Precision Forgings Pvt Ltd",
      contactPerson: "Rajeshwar Patil",
      designation: "Managing Director",
      email: "rajeshwar.patil@apexforge.co.in",
      phone: "+91 98220 11456",
      altPhone: "+91 20 2712 3450",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
      category: "Industrial Machinery & CNC",
      categories: ["Industrial Machinery & CNC", "Forging & Die Casting", "Automotive Parts"],
      services: ["Heavy CNC Turning", "Drop Forged Gear Blanks", "Custom Alloy Flanges", "Heat Treatment Annealing"],
      location: "Pune Auto Cluster, Maharashtra",
      city: "Pune",
      state: "Maharashtra",
      address: "Plot 42, Sector 10, MIDC Bhosari Industrial Belt",
      pincode: "411026",
      coordinates: [18.6279, 73.8447],
      gstNumber: "27AAACA1234F1Z5",
      panNumber: "AAACA1234F",
      msmeUdyamNumber: "UDYAM-MH-26-0014890",
      cinNumber: "U28910MH2018PTC304123",
      bankName: "HDFC Bank Ltd",
      accountHolderName: "Apex Precision Forgings Private Limited",
      accountNumber: "918020045678912",
      ifscCode: "HDFC0001234",
      creditScore: "CRISIL AAA (895/900)",
      dealVolume: "₹18.5 Crore",
      capacity: "150 Metric Tons / Month",
      moq: "100 Units / 1 Ton",
      pricingMin: 12000,
      pricingModel: "fixed",
      responseTime: "< 15 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "enterprise",
      ratings: { avg: 4.9, count: 48, quality: 4.9, timeliness: 4.8, communication: 5.0 },
      escrowProtected: true,
      joinedAt: "2024-03-15T09:00:00Z"
    },
    {
      id: "v-surat-tex",
      userId: "user-vendor-2",
      businessName: "Surat TexFab Mills & Weaving",
      contactPerson: "Hareshbhai Patel",
      designation: "Founder & Chief Executive",
      email: "haresh@surattexfab.com",
      phone: "+91 98980 44221",
      altPhone: "+91 261 289 1100",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80",
      category: "Textiles & Garments",
      categories: ["Textiles & Garments", "Industrial Uniforms", "Technical Fabrics"],
      services: ["High-Tenacity Polyester Fabrics", "Flame Retardant Workwear", "Poly-Cotton Twill Weaving", "Custom Reactive Dyeing"],
      location: "Surat Textile Belt, Gujarat",
      city: "Surat",
      state: "Gujarat",
      address: "Shed 108-112, Sachin GIDC Industrial Area, Road No. 4",
      pincode: "394230",
      coordinates: [21.0833, 72.8833],
      gstNumber: "24AACCS5678K1Z2",
      panNumber: "AACCS5678K",
      msmeUdyamNumber: "UDYAM-GJ-22-0045129",
      cinNumber: "U17120GJ2016PTC201889",
      bankName: "State Bank of India",
      accountHolderName: "Surat TexFab Mills LLP",
      accountNumber: "389201948572019",
      ifscCode: "SBIN0004567",
      creditScore: "CRISIL AAA (880/900)",
      dealVolume: "₹14.2 Crore",
      capacity: "25,000 Meters / Day",
      moq: "500 Meters",
      pricingMin: 8500,
      pricingModel: "hybrid",
      responseTime: "< 30 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "gold",
      ratings: { avg: 4.8, count: 36, quality: 4.8, timeliness: 4.7, communication: 4.9 },
      escrowProtected: true,
      joinedAt: "2024-05-20T11:30:00Z"
    },
    {
      id: "v-bharat-steel",
      userId: "user-vendor-3",
      businessName: "Bharat TMT & Structural Steels",
      contactPerson: "Amandeep Singh",
      designation: "Executive Director - Sales",
      email: "amandeep@bharattmt.co.in",
      phone: "+91 98140 33990",
      altPhone: "+91 161 501 8820",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80",
      category: "Raw Steel & Metals",
      categories: ["Raw Steel & Metals", "TMT Rebars", "Structural MS Beams"],
      services: ["Fe 550D TMT Bar Rolling", "MS Equal Angles & Channels", "Galvanized ERW Pipes", "Custom Cut-to-Length Billets"],
      location: "Ludhiana Steel Works, Punjab",
      city: "Ludhiana",
      state: "Punjab",
      address: "Industrial Focal Point, Phase VII, Dhandari Kalan",
      pincode: "141010",
      coordinates: [30.9010, 75.8573],
      gstNumber: "03AABCB9012M1Z8",
      panNumber: "AABCB9012M",
      msmeUdyamNumber: "UDYAM-PB-12-0089123",
      cinNumber: "U27100PB2014PLC038912",
      bankName: "ICICI Bank Ltd",
      accountHolderName: "Bharat TMT & Structural Steels Limited",
      accountNumber: "002905018923",
      ifscCode: "ICIC0000987",
      creditScore: "CRISIL AAA (890/900)",
      dealVolume: "₹24.6 Crore",
      capacity: "500 Metric Tons / Month",
      moq: "10 Tons",
      pricingMin: 45000,
      pricingModel: "fixed",
      responseTime: "< 20 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "enterprise",
      ratings: { avg: 4.9, count: 52, quality: 5.0, timeliness: 4.8, communication: 4.9 },
      escrowProtected: true,
      joinedAt: "2024-01-10T14:15:00Z"
    },
    {
      id: "v-zenith-pack",
      userId: "user-vendor-4",
      businessName: "Zenith Corrugated & Packaging Solutions",
      contactPerson: "Kavita Narayanan",
      designation: "Head of Operations & Quality",
      email: "kavita.n@zenithpack.in",
      phone: "+91 98400 66778",
      altPhone: "+91 44 2680 1234",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&q=80",
      category: "Packaging & Corrugated Boxes",
      categories: ["Packaging & Corrugated Boxes", "Heavy-Duty Master Cartons", "Eco-Friendly Poly Films"],
      services: ["5-Ply & 7-Ply Heavy Corrugated Boxes", "Die-Cut Electronics Packaging", "Bubble Liners & Air Cushions", "Offset Printed Retail Packaging"],
      location: "Chennai Heavy Engineering, Tamil Nadu",
      city: "Chennai",
      state: "Tamil Nadu",
      address: "Ambattur Industrial Estate, 3rd Main Road",
      pincode: "600058",
      coordinates: [13.0827, 80.2707],
      gstNumber: "33AABCZ4567P1Z1",
      panNumber: "AABCZ4567P",
      msmeUdyamNumber: "UDYAM-TN-02-0034981",
      cinNumber: "U21022TN2017PTC115678",
      bankName: "Axis Bank Ltd",
      accountHolderName: "Zenith Corrugated & Packaging Solutions Pvt Ltd",
      accountNumber: "921020038917892",
      ifscCode: "UTIB0001122",
      creditScore: "CRISIL AA+ (875/900)",
      dealVolume: "₹9.8 Crore",
      capacity: "100,000 Boxes / Month",
      moq: "1,000 Boxes",
      pricingMin: 5000,
      pricingModel: "hybrid",
      responseTime: "< 45 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "gold",
      ratings: { avg: 4.7, count: 29, quality: 4.8, timeliness: 4.6, communication: 4.8 },
      escrowProtected: true,
      joinedAt: "2024-06-18T10:20:00Z"
    },
    {
      id: "v-solaria-solar",
      userId: "user-vendor-5",
      businessName: "Solaria PV Panels & Power Grid Systems",
      contactPerson: "Vikram Sengupta",
      designation: "Chief Technical Director",
      email: "vikram@solariacleantech.com",
      phone: "+91 98300 88991",
      altPhone: "+91 33 2289 4500",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80",
      category: "Electricals, Solar & Power",
      categories: ["Electricals, Solar & Power", "Commercial Inverters", "HT Transformers"],
      services: ["550W Mono PERC Half-Cut Solar Modules", "Commercial 100kW On-Grid Inverters", "HT Step-Down Distribution Transformers", "Switchgear Panels"],
      location: "Kolkata Metals & Heavy Power, West Bengal",
      city: "Kolkata",
      state: "West Bengal",
      address: "Sector V, Salt Lake City Industrial Complex",
      pincode: "700091",
      coordinates: [22.5726, 88.3639],
      gstNumber: "19AABCS8901D1Z4",
      panNumber: "AABCS8901D",
      msmeUdyamNumber: "UDYAM-WB-10-0067823",
      cinNumber: "U31900WB2019PTC229810",
      bankName: "Kotak Mahindra Bank",
      accountHolderName: "Solaria Power Grid Systems India Pvt Ltd",
      accountNumber: "781290384729",
      ifscCode: "KKBK0002233",
      creditScore: "CRISIL AAA (885/900)",
      dealVolume: "₹16.4 Crore",
      capacity: "10 MW Modules / Month",
      moq: "25 Panels",
      pricingMin: 28000,
      pricingModel: "fixed",
      responseTime: "< 15 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "enterprise",
      ratings: { avg: 4.9, count: 41, quality: 4.9, timeliness: 4.8, communication: 5.0 },
      escrowProtected: true,
      joinedAt: "2024-04-05T08:45:00Z"
    },
    {
      id: "v-chem-pharma",
      userId: "user-vendor-6",
      businessName: "Deccan Pharma & Pure Solvents Corp",
      contactPerson: "Dr. Srinivas Rao",
      designation: "Managing Partner",
      email: "srinivas@deccanpharma.in",
      phone: "+91 98490 12345",
      altPhone: "+91 40 2300 6789",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80",
      category: "Bulk Chemicals & Pharma",
      categories: ["Bulk Chemicals & Pharma", "Active Pharma APIs", "Industrial Solvents"],
      services: ["Pharma Grade Isopropyl Alcohol (IPA 99.9%)", "USP Methanol & Ethyl Acetate", "Active Pharmaceutical Intermediates", "Cleanroom Chemical Dispensing"],
      location: "Hyderabad Pharma Corridor, Telangana",
      city: "Hyderabad",
      state: "Telangana",
      address: "Genome Valley, Phase III, Shamirpet",
      pincode: "500078",
      coordinates: [17.3850, 78.4867],
      gstNumber: "36AABCD1234E1Z7",
      panNumber: "AABCD1234E",
      msmeUdyamNumber: "UDYAM-TS-09-0091234",
      cinNumber: "U24230TG2015PTC098124",
      bankName: "HDFC Bank Ltd",
      accountHolderName: "Deccan Pharma & Pure Solvents Corporation",
      accountNumber: "50200049182390",
      ifscCode: "HDFC0001234",
      creditScore: "CRISIL AAA (892/900)",
      dealVolume: "₹21.3 Crore",
      capacity: "200 KL / Month",
      moq: "5 Barrels (1,000 L)",
      pricingMin: 35000,
      pricingModel: "fixed",
      responseTime: "< 25 mins",
      availability: "immediate",
      verificationStatus: "approved",
      subscriptionPlan: "enterprise",
      ratings: { avg: 4.95, count: 64, quality: 5.0, timeliness: 4.9, communication: 4.9 },
      escrowProtected: true,
      joinedAt: "2024-02-14T12:00:00Z"
    }
  ];
}

export function AdminVendors() {
  const navigate = useNavigate();
  const api = useAdminApi();
  const [vendors, setVendors] = useState<EnrichedVendor[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPlan, setSelectedPlan] = useState("all");
  
  // Organization View Mode: 'category' | 'location' | 'table' | 'grid'
  const [viewMode, setViewMode] = useState<"category" | "location" | "table" | "grid">("category");
  
  // Selected Vendor for 360-Degree Detail Dossier Modal
  const [activeDossierVendor, setActiveDossierVendor] = useState<EnrichedVendor | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<"overview" | "location" | "tax_banking" | "services" | "credit">("overview");
  const [showAccountNumber, setShowAccountNumber] = useState(false);
  
  // Collapsed accordion state for category/location views
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({});

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupKey]: !prev[groupKey] }));
  };

  // Fetch / Sync Vendor Data
  const loadData = () => {
    setLoading(true);
    api.getVendors()
      .then((res: any) => {
        const items = res.items || [];
        if (items.length > 0) {
          setVendors(items);
        } else {
          setVendors(generateFallbackEnrichedVendors());
        }
        setLoading(false);
      })
      .catch((err: any) => {
        console.error("API error, using enriched fallback data:", err);
        setVendors(generateFallbackEnrichedVendors());
        setLoading(false);
      });
  };

  useEffect(() => {
    loadData();
    window.addEventListener('dashboard_refresh', loadData);
    return () => window.removeEventListener('dashboard_refresh', loadData);
  }, []);

  // Unique Lists for Dropdown Filters
  const allCategoriesList = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach(v => {
      if (v.category) set.add(v.category);
    });
    return Array.from(set).sort();
  }, [vendors]);

  const allLocationsList = useMemo(() => {
    const set = new Set<string>();
    vendors.forEach(v => {
      if (v.city) set.add(v.city);
      else if (v.location) set.add(v.location.split(",")[0].trim());
    });
    return Array.from(set).sort();
  }, [vendors]);

  // Master Filtered Vendors List
  const filteredVendors = useMemo(() => {
    return vendors.filter(v => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matches = 
          (v.businessName || "").toLowerCase().includes(q) ||
          (v.contactPerson || "").toLowerCase().includes(q) ||
          (v.email || "").toLowerCase().includes(q) ||
          (v.phone || "").toLowerCase().includes(q) ||
          (v.gstNumber || "").toLowerCase().includes(q) ||
          (v.panNumber || "").toLowerCase().includes(q) ||
          (v.city || "").toLowerCase().includes(q) ||
          (v.location || "").toLowerCase().includes(q) ||
          (v.category || "").toLowerCase().includes(q) ||
          (v.pincode || "").toLowerCase().includes(q) ||
          (v.services || []).some(s => s.toLowerCase().includes(q));
        if (!matches) return false;
      }

      // 2. Category Filter
      if (selectedCategory !== "all" && v.category !== selectedCategory) {
        return false;
      }

      // 3. Location Filter
      if (selectedLocation !== "all") {
        const vendorCity = v.city || v.location.split(",")[0].trim();
        if (vendorCity.toLowerCase() !== selectedLocation.toLowerCase()) {
          return false;
        }
      }

      // 4. Status Filter
      if (selectedStatus !== "all" && v.verificationStatus !== selectedStatus) {
        return false;
      }

      // 5. Plan Filter
      if (selectedPlan !== "all" && v.subscriptionPlan !== selectedPlan) {
        return false;
      }

      return true;
    });
  }, [vendors, searchQuery, selectedCategory, selectedLocation, selectedStatus, selectedPlan]);

  // Grouped by Category
  const groupedByCategory = useMemo(() => {
    const map: Record<string, EnrichedVendor[]> = {};
    filteredVendors.forEach(v => {
      const cat = v.category || "Other Industrial Sectors";
      if (!map[cat]) map[cat] = [];
      map[cat].push(v);
    });
    return map;
  }, [filteredVendors]);

  // Grouped by Location / Cluster
  const groupedByLocation = useMemo(() => {
    const map: Record<string, EnrichedVendor[]> = {};
    filteredVendors.forEach(v => {
      const loc = v.location || "Pan-India Sourcing";
      if (!map[loc]) map[loc] = [];
      map[loc].push(v);
    });
    return map;
  }, [filteredVendors]);

  // =========================================================================
  // EXPORT UTILITIES (CSV, JSON, INDIVIDUAL DOSSIER)
  // =========================================================================

  const exportVendorsToCsv = (items: EnrichedVendor[], filenamePrefix: string = "bussinest_vendors_master") => {
    if (items.length === 0) {
      alert("No vendor records to export for current selection.");
      return;
    }

    const headers = [
      "Vendor ID", "Business Name", "Owner / Contact Person", "Designation",
      "Official Email", "Primary Phone", "Alt / Emergency Phone", "Industry Category",
      "Sub-Categories", "Products & Services", "City", "State", "Full Factory Address",
      "Pincode", "Latitude", "Longitude", "GSTIN", "PAN Number", "MSME Udyam Number",
      "CIN Number", "Bank Name", "Account Holder Name", "Bank Account Number", "IFSC Code",
      "Credit Rating", "Completed PO Volume", "Monthly Capacity", "MOQ",
      "Response Time SLA", "Verification Status", "Subscription Tier", "Registration Date"
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [
      headers.join(","),
      ...items.map(v => [
        escapeCsv(v.id || v.userId),
        escapeCsv(v.businessName),
        escapeCsv(v.contactPerson),
        escapeCsv(v.designation),
        escapeCsv(v.email),
        escapeCsv(v.phone),
        escapeCsv(v.altPhone || "N/A"),
        escapeCsv(v.category),
        escapeCsv((v.categories || []).join("; ")),
        escapeCsv((v.services || []).join("; ")),
        escapeCsv(v.city),
        escapeCsv(v.state),
        escapeCsv(v.address),
        escapeCsv(v.pincode),
        escapeCsv(v.coordinates ? v.coordinates[0] : ""),
        escapeCsv(v.coordinates ? v.coordinates[1] : ""),
        escapeCsv(v.gstNumber),
        escapeCsv(v.panNumber),
        escapeCsv(v.msmeUdyamNumber),
        escapeCsv(v.cinNumber),
        escapeCsv(v.bankName),
        escapeCsv(v.accountHolderName),
        escapeCsv(v.accountNumber),
        escapeCsv(v.ifscCode),
        escapeCsv(v.creditScore),
        escapeCsv(v.dealVolume),
        escapeCsv(v.capacity),
        escapeCsv(v.moq),
        escapeCsv(v.responseTime),
        escapeCsv(v.verificationStatus),
        escapeCsv(v.subscriptionPlan),
        escapeCsv(v.joinedAt)
      ].join(","))
    ];

    const csvString = csvRows.join("\r\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenamePrefix}_${timestamp}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportVendorsToJson = (items: EnrichedVendor[], filenamePrefix: string = "bussinest_vendors_master") => {
    if (items.length === 0) {
      alert("No vendor records to export.");
      return;
    }

    const exportPayload = {
      exportMetadata: {
        system: "Bussinest Enterprise Vendor Marketplace Admin Intelligence",
        exportTimestamp: new Date().toISOString(),
        totalVendorsExported: items.length,
        filterCategory: selectedCategory,
        filterLocation: selectedLocation
      },
      vendors: items
    };

    const jsonString = JSON.stringify(exportPayload, null, 2);
    const blob = new Blob([jsonString], { type: "application/json;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const timestamp = new Date().toISOString().split("T")[0];
    link.setAttribute("href", url);
    link.setAttribute("download", `${filenamePrefix}_${timestamp}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printMasterOrIndividualDossier = (vendor?: EnrichedVendor) => {
    window.print();
  };

  return (
    <div className="flex flex-col min-h-full bg-slate-50/70 pb-20 w-full font-sans">
      
      {/* ========================================================================= */}
      {/* 1. TOP EXECUTIVE HEADER BAR */}
      {/* ========================================================================= */}
      <div className="bg-white border-b border-sky-100 px-4 sm:px-8 py-6 shadow-xs sticky top-[104px] z-30 backdrop-blur-md bg-white/95">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 text-[10px] font-black uppercase tracking-wider border border-sky-200">
                ⭐ Admin Intelligence Command
              </div>
              <span className="text-xs text-slate-400 font-mono">• Live Synchronized</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight font-heading">
              Vendor Directory & Personal Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 font-medium">
              Location-wise & business category-wise organized repository with full personal contacts, tax/KYC files, and multi-format exports.
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => exportVendorsToCsv(filteredVendors, "bussinest_vendors_filtered")}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              title="Download filtered selection as CSV"
            >
              <FileSpreadsheet size={16} />
              <span>Export CSV ({filteredVendors.length})</span>
            </button>

            <button
              onClick={() => exportVendorsToJson(filteredVendors, "bussinest_vendors_data")}
              className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer active:scale-95"
              title="Download structured JSON bundle"
            >
              <FileJson size={16} />
              <span>Export JSON</span>
            </button>

            <button
              onClick={() => printMasterOrIndividualDossier()}
              className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all border border-slate-200 flex items-center gap-1.5 cursor-pointer"
              title="Print master dossier summary"
            >
              <Printer size={16} />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={loadData}
              className="p-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition-colors cursor-pointer"
              title="Refresh database"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        {/* 4 Quick Intelligence Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6">
          <div className="bg-sky-50/60 border border-sky-100 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Vendors</span>
              <span className="text-xl sm:text-2xl font-black text-slate-900 font-mono">{vendors.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center">
              <Users size={20} />
            </div>
          </div>

          <div className="bg-emerald-50/60 border border-emerald-100 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Verified / KYC Passed</span>
              <span className="text-xl sm:text-2xl font-black text-emerald-700 font-mono">
                {vendors.filter(v => v.verificationStatus === 'approved').length}
              </span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <ShieldCheck size={20} />
            </div>
          </div>

          <div className="bg-amber-50/60 border border-amber-100 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Industrial Sectors</span>
              <span className="text-xl sm:text-2xl font-black text-amber-900 font-mono">{allCategoriesList.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Folder size={20} />
            </div>
          </div>

          <div className="bg-indigo-50/60 border border-indigo-100 p-3.5 sm:p-4 rounded-2xl flex items-center justify-between">
            <div>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Geographic Clusters</span>
              <span className="text-xl sm:text-2xl font-black text-indigo-900 font-mono">{allLocationsList.length}</span>
            </div>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <MapPin size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. MULTI-DIMENSION FILTER & VIEW MODE SELECTOR TOOLBAR */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-8 py-5">
        <div className="bg-white p-4 rounded-2xl border border-sky-100 shadow-xs space-y-4">
          
          {/* Row 1: Search Input + View Mode Tabs */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by company name, owner, email, phone, GSTIN, PAN, city, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery("")} 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl shrink-0 self-start md:self-auto border border-slate-200">
              <button
                onClick={() => setViewMode("category")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "category" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grouped by Industry Category"
              >
                <Folder size={14} />
                <span>By Category</span>
              </button>

              <button
                onClick={() => setViewMode("location")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "location" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Grouped by Geographic Location / Cluster"
              >
                <MapPin size={14} />
                <span>By Location</span>
              </button>

              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "table" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="High-density Table View"
              >
                <Layers size={14} />
                <span>Data Table</span>
              </button>

              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  viewMode === "grid" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                }`}
                title="Executive Card Grid View"
              >
                <Users size={14} />
                <span>Cards</span>
              </button>
            </div>

          </div>

          {/* Row 2: Deep Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-100 text-xs">
            
            {/* Category Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Industry Sector</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="all">All Sectors ({vendors.length})</option>
                {allCategoriesList.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Location / City</label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="all">All Cities ({allLocationsList.length})</option>
                {allLocationsList.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Verification Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="all">All Statuses</option>
                <option value="approved">Approved & Verified</option>
                <option value="pending">Pending Review</option>
                <option value="rejected">Rejected</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>

            {/* Plan Filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Subscription Plan</label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-semibold text-slate-800 outline-none focus:border-sky-500"
              >
                <option value="all">All Membership Plans</option>
                <option value="enterprise">Enterprise Elite</option>
                <option value="gold">Gold Supplier</option>
                <option value="silver">Silver Tier</option>
                <option value="free">Free Listing</option>
              </select>
            </div>

          </div>

          {/* Active Filter Chips Bar */}
          {(selectedCategory !== "all" || selectedLocation !== "all" || selectedStatus !== "all" || selectedPlan !== "all" || searchQuery) && (
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="text-slate-400 font-medium text-[11px]">Active Filters:</span>
              
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">
                  Sector: {selectedCategory}
                  <button onClick={() => setSelectedCategory("all")} className="hover:text-rose-500 ml-1">×</button>
                </span>
              )}

              {selectedLocation !== "all" && (
                <span className="inline-flex items-center gap-1 bg-sky-50 text-sky-800 px-2.5 py-0.5 rounded-lg border border-sky-200 font-bold">
                  City: {selectedLocation}
                  <button onClick={() => setSelectedLocation("all")} className="hover:text-rose-500 ml-1">×</button>
                </span>
              )}

              {selectedStatus !== "all" && (
                <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-lg border border-emerald-200 font-bold">
                  Status: {selectedStatus}
                  <button onClick={() => setSelectedStatus("all")} className="hover:text-rose-500 ml-1">×</button>
                </span>
              )}

              {selectedPlan !== "all" && (
                <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-800 px-2.5 py-0.5 rounded-lg border border-amber-200 font-bold">
                  Plan: {selectedPlan}
                  <button onClick={() => setSelectedPlan("all")} className="hover:text-rose-500 ml-1">×</button>
                </span>
              )}

              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setSelectedLocation("all");
                  setSelectedStatus("all");
                  setSelectedPlan("all");
                }}
                className="text-rose-600 font-bold hover:underline ml-auto text-[11px] cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          )}

        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. MAIN CONTENT: ORGANIZED VIEWS (CATEGORY / LOCATION / TABLE / GRID) */}
      {/* ========================================================================= */}
      <div className="px-4 sm:px-8 space-y-6">
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 text-slate-500">
            <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-600 rounded-full animate-spin mb-4" />
            <p className="font-bold text-slate-700">Compiling vendor intelligence records...</p>
          </div>
        ) : filteredVendors.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center max-w-lg mx-auto my-8">
            <Users size={48} className="mx-auto text-slate-300 mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No vendor records match your query</h3>
            <p className="text-xs text-slate-500 mt-1">Try modifying your sector, city, or status filter.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
                setSelectedLocation("all");
                setSelectedStatus("all");
                setSelectedPlan("all");
              }}
              className="mt-4 px-4 py-2 bg-sky-50 text-sky-700 rounded-xl text-xs font-bold hover:bg-sky-100"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <>
            {/* VIEW MODE A: GROUPED BY BUSINESS CATEGORY */}
            {viewMode === "category" && (
              <div className="space-y-6">
                {(Object.entries(groupedByCategory) as [string, EnrichedVendor[]][]).map(([categoryName, items]) => {
                  const isCollapsed = !!collapsedGroups[`cat_${categoryName}`];
                  
                  return (
                    <div key={categoryName} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                      {/* Category Header Strip */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-sky-50/80 via-white to-sky-50/40 border-b border-sky-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div 
                          className="flex items-center gap-3 cursor-pointer select-none"
                          onClick={() => toggleGroupCollapse(`cat_${categoryName}`)}
                        >
                          <button className="p-1 rounded-lg hover:bg-sky-100 text-sky-700 transition-transform">
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div>
                            <h2 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                              <span>{categoryName}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-sky-600 text-white text-xs font-mono font-bold">
                                {items.length} {items.length === 1 ? "Vendor" : "Vendors"}
                              </span>
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                              Total Verified Capacity: {items.map(i => i.capacity).filter(Boolean).slice(0, 2).join(" • ")}
                            </p>
                          </div>
                        </div>

                        {/* 1-Click Category Export Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportVendorsToCsv(items, `bussinest_${categoryName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                            className="px-3 py-1.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 text-xs font-bold border border-sky-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title={`Download all ${categoryName} vendors (.CSV)`}
                          >
                            <Download size={14} />
                            <span>Download Sector CSV ({items.length})</span>
                          </button>
                        </div>
                      </div>

                      {/* Category Cards Grid */}
                      {!isCollapsed && (
                        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                          {items.map(v => (
                            <VendorSummaryCard 
                              key={v.id} 
                              vendor={v} 
                              onOpenDossier={() => {
                                setActiveDossierVendor(v);
                                setActiveModalTab("overview");
                              }}
                              onDownloadCsv={() => exportVendorsToCsv([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                              onDownloadJson={() => exportVendorsToJson([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE B: GROUPED BY GEOGRAPHIC LOCATION / CLUSTER */}
            {viewMode === "location" && (
              <div className="space-y-6">
                {(Object.entries(groupedByLocation) as [string, EnrichedVendor[]][]).map(([locationName, items]) => {
                  const isCollapsed = !!collapsedGroups[`loc_${locationName}`];
                  
                  return (
                    <div key={locationName} className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                      {/* Location Header Strip */}
                      <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-50/80 via-white to-emerald-50/40 border-b border-emerald-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div 
                          className="flex items-center gap-3 cursor-pointer select-none"
                          onClick={() => toggleGroupCollapse(`loc_${locationName}`)}
                        >
                          <button className="p-1 rounded-lg hover:bg-emerald-100 text-emerald-700 transition-transform">
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronDown size={18} />}
                          </button>
                          <div>
                            <h2 className="font-black text-slate-900 text-base sm:text-lg flex items-center gap-2">
                              <MapPin size={18} className="text-emerald-600" />
                              <span>{locationName}</span>
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-700 text-white text-xs font-mono font-bold">
                                {items.length} {items.length === 1 ? "Supplier" : "Suppliers"}
                              </span>
                            </h2>
                            <p className="text-xs text-slate-500 font-medium">
                              Sectors: {Array.from(new Set(items.map(i => i.category))).join(", ")}
                            </p>
                          </div>
                        </div>

                        {/* 1-Click Location Export Button */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => exportVendorsToCsv(items, `bussinest_hub_${locationName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            title={`Download all ${locationName} vendors (.CSV)`}
                          >
                            <Download size={14} />
                            <span>Download Hub CSV ({items.length})</span>
                          </button>
                        </div>
                      </div>

                      {/* Location Cards Grid */}
                      {!isCollapsed && (
                        <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
                          {items.map(v => (
                            <VendorSummaryCard 
                              key={v.id} 
                              vendor={v} 
                              onOpenDossier={() => {
                                setActiveDossierVendor(v);
                                setActiveModalTab("overview");
                              }}
                              onDownloadCsv={() => exportVendorsToCsv([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                              onDownloadJson={() => exportVendorsToJson([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* VIEW MODE C: HIGH-DENSITY MASTER DATA TABLE */}
            {viewMode === "table" && (
              <div className="bg-white rounded-2xl border border-sky-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50/90 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                        <th className="p-3.5 pl-5">Business & Owner</th>
                        <th className="p-3.5">Industry Category</th>
                        <th className="p-3.5">Location & Hub</th>
                        <th className="p-3.5">Contact (Email & WhatsApp)</th>
                        <th className="p-3.5">GSTIN & PAN</th>
                        <th className="p-3.5">Credit Score</th>
                        <th className="p-3.5">Volume & Capacity</th>
                        <th className="p-3.5">Status</th>
                        <th className="p-3.5 pr-5 text-right">Dossier Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredVendors.map((v) => (
                        <tr key={v.id} className="hover:bg-sky-50/40 transition-colors group">
                          {/* Business & Owner */}
                          <td className="p-3.5 pl-5">
                            <div className="flex items-center gap-3">
                              <img 
                                src={v.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
                                alt={v.contactPerson} 
                                className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0" 
                              />
                              <div>
                                <h4 className="font-bold text-slate-900 text-xs sm:text-sm group-hover:text-sky-600 transition-colors">
                                  {v.businessName}
                                </h4>
                                <p className="text-[11px] text-slate-500 font-medium">
                                  {v.contactPerson} <span className="text-slate-400">({v.designation})</span>
                                </p>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="p-3.5">
                            <span className="inline-block px-2 py-0.5 rounded-md bg-sky-50 text-sky-800 font-bold text-[11px] border border-sky-100">
                              {v.category}
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[140px]">
                              {(v.categories || []).slice(0, 2).join(", ")}
                            </span>
                          </td>

                          {/* Location */}
                          <td className="p-3.5">
                            <span className="font-bold text-slate-800 flex items-center gap-1">
                              <MapPin size={12} className="text-emerald-600 shrink-0" />
                              <span>{v.city}, {v.state}</span>
                            </span>
                            <span className="block text-[10px] text-slate-400 mt-0.5 truncate max-w-[150px]">
                              {v.address}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="p-3.5 font-mono text-[11px]">
                            <a href={`mailto:${v.email}`} className="text-sky-700 hover:underline block truncate max-w-[160px]">
                              {v.email}
                            </a>
                            <a href={`tel:${v.phone}`} className="text-slate-600 hover:underline block font-semibold mt-0.5">
                              {v.phone}
                            </a>
                          </td>

                          {/* GSTIN & PAN */}
                          <td className="p-3.5 font-mono text-[11px]">
                            <span className="block font-bold text-slate-800">{v.gstNumber}</span>
                            <span className="block text-[10px] text-slate-400">PAN: {v.panNumber}</span>
                          </td>

                          {/* Credit Score */}
                          <td className="p-3.5">
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 border border-amber-200 font-black text-[11px]">
                              <Award size={12} className="text-amber-600" />
                              <span>{v.creditScore.split(" ")[0]} {v.creditScore.split(" ")[1]}</span>
                            </span>
                          </td>

                          {/* Volume & Capacity */}
                          <td className="p-3.5">
                            <span className="font-bold text-slate-900 block">{v.dealVolume}</span>
                            <span className="text-[10px] text-slate-500 block truncate max-w-[130px]">{v.capacity}</span>
                          </td>

                          {/* Status */}
                          <td className="p-3.5">
                            <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase border ${
                              v.verificationStatus === 'approved'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}>
                              {v.verificationStatus}
                            </span>
                          </td>

                          {/* Actions */}
                          <td className="p-3.5 pr-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => {
                                  setActiveDossierVendor(v);
                                  setActiveModalTab("overview");
                                }}
                                className="px-2.5 py-1.5 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold transition-colors cursor-pointer border border-sky-200"
                                title="View Full 360° Dossier"
                              >
                                View Dossier
                              </button>

                              <button
                                onClick={() => exportVendorsToCsv([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer border border-slate-200"
                                title="Download Vendor CSV"
                              >
                                <Download size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* VIEW MODE D: EXECUTIVE CARD GRID */}
            {viewMode === "grid" && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredVendors.map((v) => (
                  <VendorSummaryCard 
                    key={v.id} 
                    vendor={v} 
                    onOpenDossier={() => {
                      setActiveDossierVendor(v);
                      setActiveModalTab("overview");
                    }}
                    onDownloadCsv={() => exportVendorsToCsv([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                    onDownloadJson={() => exportVendorsToJson([v], `vendor_${v.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                  />
                ))}
              </div>
            )}
          </>
        )}

      </div>

      {/* ========================================================================= */}
      {/* 4. FULL 360-DEGREE VENDOR DOSSIER MODAL WITH DOWNLOAD CAPABILITIES */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {activeDossierVendor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/60 backdrop-blur-md overflow-y-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="bg-white rounded-3xl max-w-4xl w-full border border-sky-200 shadow-2xl overflow-hidden relative max-h-[92vh] flex flex-col"
            >
              {/* Top Animated Gold Line */}
              <div className="gold-line-animated absolute top-0 left-0 right-0 h-[3px]" />

              {/* Modal Header Strip */}
              <div className="p-5 sm:p-7 bg-gradient-to-r from-slate-900 via-[#0a275e] to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0 relative">
                <div className="flex items-center gap-4">
                  <img 
                    src={activeDossierVendor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
                    alt={activeDossierVendor.contactPerson} 
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl object-cover border-2 border-amber-400/60 shadow-md shrink-0 bg-slate-800" 
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider">
                        {activeDossierVendor.subscriptionPlan} Tier
                      </span>
                      <span className="text-[11px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <CheckCircle2 size={12} /> {activeDossierVendor.verificationStatus.toUpperCase()}
                      </span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black font-heading tracking-tight text-white leading-tight">
                      {activeDossierVendor.businessName}
                    </h2>
                    <p className="text-xs text-sky-200/90 font-medium">
                      {activeDossierVendor.contactPerson} • <span className="text-amber-300 font-semibold">{activeDossierVendor.designation}</span>
                    </p>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setActiveDossierVendor(null)}
                  className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Modal Navigation Tabs */}
              <div className="flex items-center gap-2 p-2 bg-slate-100 border-b border-slate-200 overflow-x-auto shrink-0 text-xs font-bold">
                <button
                  onClick={() => setActiveModalTab("overview")}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeModalTab === "overview" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  1. Overview & Contacts
                </button>

                <button
                  onClick={() => setActiveModalTab("location")}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeModalTab === "location" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  2. Factory & Location
                </button>

                <button
                  onClick={() => setActiveModalTab("tax_banking")}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeModalTab === "tax_banking" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  3. Tax, Legal & Banking
                </button>

                <button
                  onClick={() => setActiveModalTab("services")}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeModalTab === "services" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  4. Products & Capacity
                </button>

                <button
                  onClick={() => setActiveModalTab("credit")}
                  className={`px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    activeModalTab === "credit" ? "bg-white text-sky-900 shadow-xs" : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  5. Credit & Telemetry
                </button>
              </div>

              {/* Modal Tab Content Area */}
              <div className="p-5 sm:p-7 overflow-y-auto flex-1 space-y-6 text-xs sm:text-sm">
                
                {/* TAB 1: OVERVIEW & PERSONAL CONTACTS */}
                {activeModalTab === "overview" && (
                  <div className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Personal Details Card */}
                      <div className="p-4 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-2.5">
                        <h4 className="font-bold text-sky-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <Users size={14} className="text-sky-600" /> Executive & Owner Information
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between py-1 border-b border-sky-100">
                            <span className="text-slate-500">Contact Person:</span>
                            <span className="font-bold text-slate-900">{activeDossierVendor.contactPerson}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-sky-100">
                            <span className="text-slate-500">Designation / Role:</span>
                            <span className="font-bold text-slate-900">{activeDossierVendor.designation}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-sky-100">
                            <span className="text-slate-500">Official Email:</span>
                            <a href={`mailto:${activeDossierVendor.email}`} className="font-bold text-sky-700 hover:underline">
                              {activeDossierVendor.email}
                            </a>
                          </div>
                          <div className="flex justify-between py-1 border-b border-sky-100">
                            <span className="text-slate-500">Primary WhatsApp:</span>
                            <a href={`tel:${activeDossierVendor.phone}`} className="font-bold text-slate-900 font-mono">
                              {activeDossierVendor.phone}
                            </a>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Emergency Desk Phone:</span>
                            <span className="font-bold text-slate-800 font-mono">{activeDossierVendor.altPhone || "N/A"}</span>
                          </div>
                        </div>
                      </div>

                      {/* Business Entity Profile */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <Building2 size={14} className="text-slate-600" /> Commercial Business Profile
                        </h4>
                        <div className="space-y-1.5 text-xs">
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Registered Name:</span>
                            <span className="font-bold text-slate-900">{activeDossierVendor.businessName}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Primary Industry:</span>
                            <span className="font-bold text-sky-800">{activeDossierVendor.category}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">SLA Response Speed:</span>
                            <span className="font-bold text-emerald-700">{activeDossierVendor.responseTime}</span>
                          </div>
                          <div className="flex justify-between py-1 border-b border-slate-200">
                            <span className="text-slate-500">Pricing Model:</span>
                            <span className="font-bold text-slate-800 uppercase">{activeDossierVendor.pricingModel}</span>
                          </div>
                          <div className="flex justify-between py-1">
                            <span className="text-slate-500">Registration Date:</span>
                            <span className="font-mono text-slate-700">{new Date(activeDossierVendor.joinedAt).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 2: FACTORY, LOCATION & GPS */}
                {activeModalTab === "location" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <MapPin size={15} className="text-emerald-600" /> Factory Location & Geographic Coordinates
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Industrial Cluster:</span>
                          <span className="font-bold text-slate-900 text-sm">{activeDossierVendor.location}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">City & State:</span>
                          <span className="font-bold text-slate-900 text-sm">{activeDossierVendor.city}, {activeDossierVendor.state}</span>
                        </div>
                        <div className="sm:col-span-2">
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Full Physical Street Address:</span>
                          <span className="font-medium text-slate-800">{activeDossierVendor.address}, PIN: {activeDossierVendor.pincode}</span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">GPS Geodetic Coordinates:</span>
                          <span className="font-mono font-bold text-sky-800">
                            {activeDossierVendor.coordinates[0]}° N, {activeDossierVendor.coordinates[1]}° E
                          </span>
                        </div>
                        <div>
                          <span className="block text-slate-400 text-[10px] uppercase font-bold">Navigation Route:</span>
                          <a 
                            href={`https://www.google.com/maps/search/?api=1&query=${activeDossierVendor.coordinates[0]},${activeDossierVendor.coordinates[1]}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sky-600 font-bold hover:underline"
                          >
                            <span>Open in Google Maps</span>
                            <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: TAX, LEGAL & BANKING */}
                {activeModalTab === "tax_banking" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      
                      {/* Legal Registrations */}
                      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5">
                        <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-sky-600" /> Statutory & Tax Identifiers
                        </h4>
                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">GSTIN Identification:</span>
                            <span className="font-mono font-black text-slate-900 text-sm tracking-wider">{activeDossierVendor.gstNumber}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Income Tax PAN:</span>
                            <span className="font-mono font-black text-slate-900 text-sm tracking-wider">{activeDossierVendor.panNumber}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">MSME Udyam Registration:</span>
                            <span className="font-mono font-bold text-slate-800 text-xs">{activeDossierVendor.msmeUdyamNumber}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Corporate CIN No:</span>
                            <span className="font-mono font-bold text-slate-800 text-xs">{activeDossierVendor.cinNumber}</span>
                          </div>
                        </div>
                      </div>

                      {/* Banking & Escrow Details */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-amber-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                            <CreditCard size={14} className="text-amber-600" /> Escrow Payout Bank Account
                          </h4>
                          <button
                            type="button"
                            onClick={() => setShowAccountNumber(!showAccountNumber)}
                            className="text-[11px] font-bold text-amber-800 hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            {showAccountNumber ? <EyeOff size={13} /> : <Eye size={13} />}
                            <span>{showAccountNumber ? "Mask" : "Reveal"}</span>
                          </button>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Bank Name:</span>
                            <span className="font-bold text-slate-900 text-sm">{activeDossierVendor.bankName}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Account Holder:</span>
                            <span className="font-bold text-slate-900 text-xs">{activeDossierVendor.accountHolderName}</span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">Account Number:</span>
                            <span className="font-mono font-black text-slate-900 text-sm tracking-wider">
                              {showAccountNumber 
                                ? activeDossierVendor.accountNumber 
                                : `••••••••${activeDossierVendor.accountNumber.slice(-4)}`}
                            </span>
                          </div>
                          <div className="p-2.5 rounded-xl bg-white border border-amber-200">
                            <span className="block text-[10px] uppercase font-bold text-slate-400">IFSC Code:</span>
                            <span className="font-mono font-bold text-amber-900 text-xs">{activeDossierVendor.ifscCode}</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* TAB 4: PRODUCTS, MOQ & CAPACITY */}
                {activeModalTab === "services" && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <h4 className="font-bold text-slate-900 uppercase tracking-wider text-xs">
                        Core Products & Manufacturing Capabilities
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {(activeDossierVendor.services || []).map((srv, idx) => (
                          <span key={idx} className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-800 text-xs font-semibold shadow-xs">
                            ✓ {srv}
                          </span>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-3 border-t border-slate-200 text-xs">
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Monthly Capacity:</span>
                          <span className="font-black text-slate-900 text-xs sm:text-sm">{activeDossierVendor.capacity}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Minimum Order (MOQ):</span>
                          <span className="font-black text-slate-900 text-xs sm:text-sm">{activeDossierVendor.moq}</span>
                        </div>
                        <div className="p-3 bg-white rounded-xl border border-slate-200">
                          <span className="block text-[10px] uppercase font-bold text-slate-400">Escrow PO Volume:</span>
                          <span className="font-black text-emerald-700 text-xs sm:text-sm">{activeDossierVendor.dealVolume}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 5: CREDIT & TELEMETRY */}
                {activeModalTab === "credit" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-2">
                        <h4 className="font-bold text-amber-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <Award size={15} className="text-amber-600" /> CRISIL Solvency Scoring
                        </h4>
                        <div className="p-3 rounded-xl bg-white border border-amber-200">
                          <span className="text-2xl font-black text-amber-950 font-mono">{activeDossierVendor.creditScore}</span>
                          <p className="text-xs text-slate-500 mt-1">Certified financial health with 0 loan defaults or payment delays.</p>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                        <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-xs flex items-center gap-1.5">
                          <ShieldCheck size={15} className="text-emerald-600" /> Milestone Escrow Status
                        </h4>
                        <div className="p-3 rounded-xl bg-white border border-emerald-200">
                          <span className="text-base font-bold text-emerald-900">100% Protected (50/50 Split)</span>
                          <p className="text-xs text-slate-500 mt-1">Disputes: 0 open • Dispute Resolution SLA: &lt; 24 hrs.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Modal Footer Actions Strip */}
              <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <button
                  onClick={() => setActiveDossierVendor(null)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Close
                </button>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => exportVendorsToCsv([activeDossierVendor], `vendor_${activeDossierVendor.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <FileSpreadsheet size={15} />
                    <span>Download Vendor CSV</span>
                  </button>

                  <button
                    onClick={() => exportVendorsToJson([activeDossierVendor], `vendor_${activeDossierVendor.businessName.toLowerCase().replace(/[^a-z0-9]/g, '_')}`)}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 cursor-pointer active:scale-95"
                  >
                    <FileJson size={15} />
                    <span>Download JSON Dossier</span>
                  </button>

                  <button
                    onClick={() => printMasterOrIndividualDossier(activeDossierVendor)}
                    className="px-3.5 py-2.5 rounded-xl bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs border border-sky-200 flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer size={15} />
                    <span>Print Dossier</span>
                  </button>
                </div>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// =========================================================================
// SUBCOMPONENT: VENDOR SUMMARY CARD
// =========================================================================
interface VendorSummaryCardProps {
  vendor: EnrichedVendor;
  onOpenDossier: () => void;
  onDownloadCsv: () => void;
  onDownloadJson: () => void;
  key?: React.Key;
}

const VendorSummaryCard: React.FC<VendorSummaryCardProps> = ({ vendor, onOpenDossier, onDownloadCsv, onDownloadJson }) => {
  const isVerified = vendor.verificationStatus === "approved";

  return (
    <div className="bg-white rounded-2xl border border-sky-100 p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all group relative overflow-hidden">
      
      {/* Top Gold Hairline Accent */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

      <div>
        {/* Header Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${
            isVerified 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-amber-50 text-amber-700 border-amber-200'
          }`}>
            {isVerified ? "✓ Verified Supplier" : vendor.verificationStatus}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            <Award size={12} className="text-amber-500" /> {vendor.creditScore.split(" ")[0]}
          </span>
        </div>

        {/* Business & Owner Info */}
        <div className="flex items-start gap-3 mb-3.5">
          <img 
            src={vendor.avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"} 
            alt={vendor.contactPerson} 
            className="w-12 h-12 rounded-xl object-cover border border-slate-200 shadow-xs shrink-0" 
          />
          <div className="min-w-0">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-sky-600 transition-colors leading-tight truncate">
              {vendor.businessName}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5 font-medium truncate">
              {vendor.contactPerson} <span className="text-slate-400 font-normal">({vendor.designation})</span>
            </p>
            <p className="text-[11px] font-bold text-sky-800 mt-0.5">{vendor.category}</p>
          </div>
        </div>

        {/* Location & Tax Strip */}
        <div className="space-y-1.5 p-2.5 rounded-xl bg-slate-50 text-xs font-medium text-slate-600 mb-3.5 border border-slate-100">
          <div className="flex items-center gap-1.5">
            <MapPin size={13} className="text-emerald-600 shrink-0" />
            <span className="truncate">{vendor.location}</span>
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-slate-500">GSTIN: <strong className="text-slate-800">{vendor.gstNumber}</strong></span>
            <span className="text-slate-500">PAN: <strong className="text-slate-800">{vendor.panNumber}</strong></span>
          </div>
        </div>

        {/* Contact Links */}
        <div className="grid grid-cols-2 gap-2 text-xs mb-3.5">
          <a
            href={`mailto:${vendor.email}`}
            className="p-2 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-800 font-semibold flex items-center gap-1.5 truncate border border-sky-100 transition-colors"
            title={vendor.email}
          >
            <Mail size={12} className="shrink-0" />
            <span className="truncate">{vendor.email}</span>
          </a>
          <a
            href={`tel:${vendor.phone}`}
            className="p-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold flex items-center gap-1.5 truncate border border-emerald-100 transition-colors font-mono"
            title={vendor.phone}
          >
            <Phone size={12} className="shrink-0" />
            <span className="truncate">{vendor.phone}</span>
          </a>
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <button
          onClick={onOpenDossier}
          className="flex-1 py-2 px-3 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold transition-all text-center cursor-pointer shadow-xs min-h-[38px] flex items-center justify-center gap-1.5"
        >
          <Eye size={14} />
          <span>Full 360° Dossier</span>
        </button>

        <button
          onClick={onDownloadCsv}
          className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all cursor-pointer border border-slate-200 min-h-[38px]"
          title="Download Vendor CSV"
        >
          <Download size={14} />
        </button>
      </div>

    </div>
  );
}

