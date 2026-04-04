import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; 
import { 
  Shield, Mail, Phone, MapPin, 
  Heart, Sparkles 
} from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVars = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { staggerChildren: 0.15, duration: 0.8, ease: "easeOut" } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <footer className="relative bg-[#020617] border-t border-slate-800/50 pt-24 pb-12 overflow-hidden font-sans text-slate-300">
      {/* Background Neon Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[140px] rounded-full pointer-events-none" />

      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Fraunces:wght@700;800;900&display=swap');
        
        .footer-brand-font { font-family: 'Fraunces', serif; }
        
        @keyframes pulse-blue {
          0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(59, 130, 246, 0); }
          100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
        }
        .emergency-glow-dark { animation: pulse-blue 2s infinite; }
      `}} />

      <motion.div 
        variants={containerVars}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 relative z-10"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">

          {/* COLUMN 1: BRAND & SOCIAL */}
          <motion.div variants={itemVars} className="space-y-8">
            <div className="flex items-center gap-4 group cursor-default">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(37,99,235,0.3)] group-hover:rotate-12 transition-transform duration-500">
                <Shield size={28} className="text-white" />
              </div>
              <div>
                <span className="footer-brand-font text-white text-2xl font-black leading-none block tracking-tight">e-Society</span>
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mt-1 block">Digital Hub</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs font-medium">
              Elevating community living through smart automation, robust security, and seamless financial transparency.
            </p>
            
            <div className="flex gap-4">
              {[
                { Icon: FaFacebook, href: "https://facebook.com", color: "hover:bg-blue-600" },
                { Icon: FaWhatsapp, href: "https://wa.me/919999988888", color: "hover:bg-emerald-500" }, // WhatsApp Added
                { Icon: FaLinkedin, href: "https://linkedin.com", color: "hover:bg-blue-700" },
                { Icon: FaInstagram, href: "https://instagram.com", color: "hover:bg-pink-600" }
              ].map((item, i) => (
                <motion.a 
                  key={i} 
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ y: -8, scale: 1.1 }}
                  className={`w-11 h-11 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-300 shadow-lg ${item.color}`}
                >
                  <item.Icon size={20} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* COLUMN 2: RESOURCES */}
          <motion.div variants={itemVars}>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-10">Quick Access</span>
            <ul className="space-y-5">
              {['Home', 'About Society', 'Notice Board', 'Events Calendar'].map((text, i) => (
                <li key={i}>
                  <Link to={`/${text.toLowerCase().replace(/\s+/g, '')}`} className="group flex items-center gap-3 text-slate-400 hover:text-blue-400 text-sm font-bold transition-all">
                    <span className="w-0 group-hover:w-3 h-[2px] bg-blue-500 transition-all duration-300" />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 3: SERVICES */}
          <motion.div variants={itemVars}>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-10">Resident Portal</span>
            <ul className="space-y-5">
              {['Visitor Tracking', 'Pay Maintenance', 'Facility Booking', 'Support Desk'].map((text, i) => (
                <li key={i}>
                  <Link to={`/${text.toLowerCase().replace(/\s+/g, '')}`} className="group flex items-center gap-3 text-slate-400 hover:text-indigo-400 text-sm font-bold transition-all">
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-700 group-hover:bg-indigo-500 transition-colors" />
                    {text}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* COLUMN 4: CONTACT & EMERGENCY */}
          <motion.div variants={itemVars} className="space-y-10">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 block mb-2">Location</span>
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <div className="mt-1 p-2 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <p className="text-slate-400 text-sm font-bold leading-relaxed">
                  Galaxy Heights, Block C,<br />
                  Ahmedabad, Gujarat
                </p>
              </div>
              <a href="mailto:admin@esociety.in" className="flex items-center gap-4 group">
                <div className="p-2 bg-slate-900 border border-slate-800 text-blue-400 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
                  <Mail size={18} />
                </div>
                <p className="text-slate-400 text-sm font-bold">admin@esociety.in</p>
              </a>
            </div>

            {/* Premium Emergency Card */}
            <motion.div 
              whileHover={{ scale: 1.03 }}
              className="emergency-glow-dark bg-gradient-to-br from-blue-600/90 to-indigo-700/90 p-6 rounded-[24px] text-white relative overflow-hidden group cursor-pointer shadow-2xl"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-150 transition-transform duration-700">
                <Sparkles size={48} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-80 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Security Response
              </p>
              <a href="tel:+919999988888" className="flex items-center justify-between">
                <span className="text-xl font-black tracking-tight">+91 99999 88888</span>
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md group-hover:bg-white group-hover:text-blue-700 transition-all duration-300">
                  <Phone size={20} fill="currentColor" />
                </div>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="pt-12 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-10">
          <motion.div variants={itemVars} className="text-slate-500 text-[11px] font-black uppercase tracking-[0.2em] flex flex-wrap items-center justify-center gap-3">
            © {currentYear} e-Society Hub 
            <span className="hidden md:inline text-slate-800">|</span> 
            <span className="flex items-center gap-2 bg-slate-900 border border-slate-800 px-4 py-1.5 rounded-full text-slate-400">
              Made with <Heart size={14} className="text-rose-500 fill-rose-500 animate-pulse" /> for community
            </span>
          </motion.div>
          
          <motion.div variants={itemVars} className="flex gap-12">
            {['Privacy Policy', 'Terms of Use'].map((text, i) => (
              <Link 
                key={i} 
                to={`/${text.toLowerCase().replace(/\s+/g, '')}`} 
                className="text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group"
              >
                {text}
                <span className="absolute -bottom-2 left-0 w-0 h-[2px] bg-blue-500 group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </footer>
  );
};

export default Footer;