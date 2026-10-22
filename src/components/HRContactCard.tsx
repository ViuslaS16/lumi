import React from 'react';
import { Mail, Phone, Clock, Headphones } from 'lucide-react';

interface HRContactCardProps {
  onActionClick?: (action: 'menu') => void;
}

export const HRContactCard: React.FC<HRContactCardProps> = ({ onActionClick }) => {
  return (
    <div className="mt-2 rounded-2xl bg-white border border-[#E7E5E4] p-4 sm:p-5 shadow-xs max-w-md w-full">
      <div className="flex items-center gap-3 pb-3 border-b border-[#F5F5F4]">
        <div className="w-10 h-10 rounded-xl bg-[#FEF3C7] border border-[#FDE68A] flex items-center justify-center text-[#D97706]">
          <Headphones className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-sm text-[#292524]">
            Human Resources L&D Team
          </h3>
          <p className="text-xs text-[#78716C]">NovaEdge Technologies (Pvt) Ltd</p>
        </div>
      </div>

      <div className="mt-3.5 space-y-2.5 text-xs text-[#292524]">
        {/* Email */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#FFFBF5] border border-[#FEF3C7]">
          <div className="flex items-center gap-2 text-stone-700">
            <Mail className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium">Email:</span>
            <a
              href="mailto:learning@novaedge.example"
              className="text-[#92400E] font-semibold underline hover:text-[#D97706] break-all sm:break-normal"
            >
              learning@novaedge.example
            </a>
          </div>
        </div>

        {/* Extension */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-700">
            <Phone className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium">Internal Extension:</span>
            <span className="font-mono font-bold text-stone-800">214</span>
          </div>
          <span className="text-[10px] text-stone-500">Direct Desk</span>
        </div>

        {/* Operating Hours */}
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-50 border border-stone-200">
          <div className="flex items-center gap-2 text-stone-700">
            <Clock className="w-4 h-4 text-[#D97706]" />
            <span className="font-medium">Support Hours:</span>
            <span className="font-medium text-stone-800">Mon – Fri, 8:30 AM – 5:00 PM</span>
          </div>
        </div>
      </div>

      <div className="mt-3 p-2 rounded-xl bg-stone-50 border border-stone-200 text-[10px] text-stone-500 text-center leading-snug">
        These are fictional demonstration contacts for this university HRIS assignment prototype.
      </div>

      {onActionClick && (
        <div className="mt-3 pt-2.5 border-t border-[#F5F5F4] flex justify-end">
          <button
            onClick={() => onActionClick('menu')}
            className="text-xs px-2.5 py-1 rounded-lg border border-stone-200 hover:bg-stone-50 text-stone-600 transition-colors cursor-pointer"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
};
