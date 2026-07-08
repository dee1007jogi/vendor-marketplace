import React, { useState, useMemo } from 'react';
import { Search, Inbox } from 'lucide-react';

export interface Column<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  onRowClick?: (item: T) => void;
  searchPlaceholder?: string;
}

export function DataTable<T>({ data, columns, onRowClick, searchPlaceholder }: DataTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = useMemo(() => {
    if (!searchQuery) return data;
    const lowerQ = searchQuery.toLowerCase();
    return data.filter((item: any) => {
      // Basic implementation: check all string/number values of the object
      return Object.values(item).some(val => {
        if (typeof val === 'string' || typeof val === 'number') {
          return String(val).toLowerCase().includes(lowerQ);
        }
        // If it's an object with a name or email, check those too
        if (typeof val === 'object' && val !== null) {
          if ((val as any).name) return String((val as any).name).toLowerCase().includes(lowerQ);
          if ((val as any).email) return String((val as any).email).toLowerCase().includes(lowerQ);
          if ((val as any).companyName) return String((val as any).companyName).toLowerCase().includes(lowerQ);
        }
        return false;
      });
    });
  }, [data, searchQuery]);

  return (
    <div className="flex flex-col w-full">
      {/* Sticky Top Search Bar (if searchPlaceholder is provided) */}
      {searchPlaceholder && (
        <div className="sticky top-[104px] z-30 bg-slate-50/80 backdrop-blur-md pb-4 md:pb-6 border-b border-transparent">
          <div className="relative w-full shadow-sm rounded-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 h-5 w-5" />
            <input
              type="text"
              inputMode="search"
              placeholder={searchPlaceholder}
              className="w-full pl-11 pr-4 h-12 bg-white border border-slate-200 rounded-full text-base focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredData.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-slate-300 shadow-sm mt-2">
          <Inbox className="h-16 w-16 text-slate-300 mb-4" />
          <h3 className="text-lg font-bold text-slate-900">No data found</h3>
          <p className="mt-2 text-sm text-slate-500 max-w-xs leading-relaxed">
            {searchQuery 
              ? "We couldn't find any records matching your search. Try adjusting your keywords." 
              : "There are currently no records available to display here."}
          </p>
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              className="mt-6 px-6 py-3 min-h-[44px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors active:scale-95"
            >
              Clear Search
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="hidden md:block shadow-md rounded-xl bg-white overflow-hidden border border-slate-200 mt-2">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    {columns.map((col) => (
                      <th key={String(col.key)} className="px-6 py-4 font-bold tracking-wider">{col.header}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredData.map((item, idx) => (
                    <tr 
                      key={idx} 
                      onClick={() => onRowClick?.(item)} 
                      className="bg-white hover:bg-slate-50 transition-colors cursor-pointer"
                    >
                      {columns.map((col) => (
                        <td key={String(col.key)} className="px-6 py-4 font-medium text-slate-900">
                          {col.render ? col.render(item) : (item as any)[col.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="flex flex-col md:hidden gap-3 mt-2">
            {filteredData.map((item, idx) => (
              <div 
                key={idx} 
                onClick={() => onRowClick?.(item)} 
                className="flex flex-col p-4 bg-white rounded-xl border border-slate-200 shadow-sm active:scale-[0.98] transition-all"
              >
                {/* Dynamically render columns inside the card */}
                {columns.map((col, colIdx) => (
                  <div key={String(col.key)} className={`flex justify-between items-start py-2.5 ${colIdx !== columns.length - 1 ? 'border-b border-slate-100/60' : ''}`}>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-4 shrink-0 mt-0.5">{col.header}</span>
                    <div className="text-sm font-semibold text-slate-800 text-right">
                      {col.render ? col.render(item) : (item as any)[col.key]}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
