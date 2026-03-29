import React from "react";
import { Link } from "react-router-dom";
// ✅ Import only utility icons from lucide
import { 
  Shield, Mail, Phone, MapPin, 
  ArrowUpRight, Heart 
} from "lucide-react";
// ✅ Import brand icons from react-icons/fa (Standard for social media)
import { FaFacebook, FaTwitter, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }} className="bg-white border-t border-slate-100 pt-20 pb-10">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;800;900&display=swap');
        
        .footer-label {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 2px;
          text-transform: uppercase;
          color: #94a3b8;
          margin-bottom: 24px;
          display: block;
        }
        .footer-link {
          font-size: 14px;
          font-weight: 600;
          color: #64748b;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          gap: 4px;
        }
        .footer-link:hover {
          color: #2563eb;
          transform: translateX(4px);
        }
        .brand-font {
          font-family: 'Fraunces', serif;
        }
        .emergency-card {
          background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
          box-shadow: 0 10px 20px -5px rgba(239, 68, 68, 0.3);
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* COLUMN 1: BRAND */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
                <Shield size={20} className="text-white" />
              </div>
              <div>
                <span className="brand-font text-slate-900 text-xl font-black leading-none block">e-Society</span>
                <span className="text-[9px] font-bold text-blue-600 uppercase tracking-widest mt-1 block">Management</span>
              </div>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed">
              Elevating community living through smart automation, robust security, and seamless financial transparency.
            </p>
            
            {/* ✅ FIXED SOCIAL LINKS: Using Fa Icons */}
            <div className="flex gap-3">
              {[
                { Icon: FaFacebook, href: "#" },
                { Icon: FaTwitter, href: "#" },
                { Icon: FaLinkedin, href: "#" },
                { Icon: FaInstagram, href: "#" }
              ].map((item, i) => (
                <a key={i} href={item.href} className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 hover:bg-blue-600 hover:text-white transition-all">
                  <item.Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <span className="footer-label">Resources</span>
            <div className="space-y-4">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/about" className="footer-link">About Society</Link>
              <Link to="/notices" className="footer-link">Notice Board</Link>
              <Link to="/events" className="footer-link">Events Calendar</Link>
            </div>
          </div>

          {/* COLUMN 3: SERVICES */}
          <div>
            <span className="footer-label">Services</span>
            <div className="space-y-4">
              <Link to="/visitors" className="footer-link">Visitor Tracking</Link>
              <Link to="/maintenance" className="footer-link">Pay Maintenance</Link>
              <Link to="/facilities" className="footer-link">Facility Booking</Link>
              <Link to="/complaints" className="footer-link">Support Desk</Link>
            </div>
          </div>

          {/* COLUMN 4: CONTACT & EMERGENCY */}
          <div className="space-y-6">
            <span className="footer-label">Get in Touch</span>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <MapPin size={16} className="text-blue-500" />
                Galaxy Heights, Block C, Ahmedabad
              </div>
              <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                <Mail size={16} className="text-blue-500" />
                admin@esociety.in
              </div>
            </div>

            <div className="emergency-card p-5 rounded-2xl text-white">
              <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-2">Security Response</p>
              <a href="tel:+919999988888" className="flex items-center justify-between group">
                <span className="text-lg font-bold">+91 99999 88888</span>
                <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
                  <Phone size={16} fill="white" />
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* BOTTOM DIVIDER */}
        <div className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
            © {currentYear} e-Society System <span className="hidden md:inline">•</span> 
            <span className="flex items-center gap-1">Made with <Heart size={12} className="text-red-500 fill-red-500" /> for community living</span>
          </div>
          
          <div className="flex gap-8">
            <Link to="/privacy" className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest">Privacy Policy</Link>
            <Link to="/terms" className="text-slate-400 hover:text-slate-600 text-xs font-bold uppercase tracking-widest">Terms of Use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;