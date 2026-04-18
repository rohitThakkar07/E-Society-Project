import React from "react";
import { Link } from "react-router-dom";
import { Shield, Mail, Phone, MapPin, Heart, Sparkles } from "lucide-react";
import { FaFacebook, FaWhatsapp, FaLinkedin, FaInstagram } from "react-icons/fa";
import societyConfig from "../../assets/societyConfig";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const containerVars = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.12, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0 },
  };

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Notice Board", to: "/notices" },
    { label: "Events", to: "/events" },
    { label: "Polls", to: "/polls" },
  ];

  const serviceLinks = [
    { label: "Visitor Management", to: "/visitors" },
    { label: "Pay Maintenance", to: "/maintenance" },
    { label: "Book Facility", to: "/facilities" },
    { label: "Help Desk", to: "/raise-complaint" },
  ];

  return (
    <footer
      className="relative pt-20 sm:pt-24 pb-10 sm:pb-12 overflow-hidden font-sans border-t transition-colors duration-500"
      style={{
        background: "var(--footer-bg)",
        borderColor: "var(--footer-border)",
        color: "var(--footer-text)",
      }}
    >
      <div
        className="absolute top-0 right-0 w-[min(100%,28rem)] h-[28rem] rounded-full pointer-events-none opacity-40 blur-[100px]"
        style={{ background: "var(--accent)" }}
      />
      <div
        className="absolute bottom-0 left-0 w-[min(100%,24rem)] h-64 rounded-full pointer-events-none opacity-25 blur-[90px]"
        style={{ background: "#8B5CF6" }}
      />

      <div
       
       
        className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-16 mb-16 sm:mb-20">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex items-center gap-4 group cursor-default">
              <div
               
               
                className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg"
                style={{
                  background: "linear-gradient(135deg, var(--accent), #6366f1)",
                  boxShadow: "0 12px 40px color-mix(in srgb, var(--accent) 35%, transparent)",
                }}
              >
                <Shield size={28} className="text-white" />
              </div>
              <div>
                <span className="text-white text-2xl font-black leading-none block tracking-tight">{societyConfig.name}</span>
                <span className="text-[10px] font-black uppercase tracking-[0.25em] mt-1.5 block opacity-80">
                  Digital Hub
                </span>
              </div>
            </div>
            <p className="text-sm leading-relaxed max-w-xs font-medium opacity-90">
              Elevating community living through smart automation, robust security, and transparent finances.
            </p>

            <div className="flex flex-wrap gap-3">
              {[
                { Icon: FaFacebook, href: "https://facebook.com", hover: "hover:bg-blue-600" },
                { Icon: FaWhatsapp, href: `https://wa.me/91${societyConfig.contact.phone}`, hover: "hover:bg-emerald-500" },
                { Icon: FaLinkedin, href: "https://linkedin.com", hover: "hover:bg-blue-700" },
                { Icon: FaInstagram, href: "https://instagram.com", hover: "hover:bg-pink-600" },
              ].map((item, i) => (
                <a
                  key={i}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                 
                 
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center text-slate-400 hover:text-white transition-colors duration-300 shadow-lg bg-white/5 border-white/10 ${item.hover}`}
                >
                  <item.Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 block mb-8">Explore</span>
            <ul className="space-y-4">
              {quickLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-3 text-sm font-bold opacity-90 hover:opacity-100 hover:text-white transition-all"
                  >
                    <span className="w-0 group-hover:w-3 h-0.5 bg-[var(--accent)] transition-all duration-300 rounded-full" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 block mb-8">Resident portal</span>
            <ul className="space-y-4">
              {serviceLinks.map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="group flex items-center gap-3 text-sm font-bold opacity-90 hover:opacity-100 hover:text-white transition-all"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 group-hover:bg-[var(--accent)] transition-colors" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <span className="text-[11px] font-black uppercase tracking-[0.3em] opacity-60 block">Contact</span>
            <div className="space-y-4">
              <div className="flex items-start gap-4 group">
                <div className="mt-0.5 p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                  <MapPin size={18} />
                </div>
                <p className="text-sm font-bold leading-relaxed opacity-90">
                  {societyConfig.address},
                  <br />
                  {societyConfig.city}, {societyConfig.state}
                </p>
              </div>
              <a href={`mailto:${societyConfig.contact.email}`} className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 border border-white/10 text-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-white transition-all duration-300">
                  <Mail size={18} />
                </div>
                <span className="text-sm font-bold opacity-90">{societyConfig.contact.email}</span>
              </a>
            </div>

            <div
             
              className="rounded-3xl p-6 text-white relative overflow-hidden cursor-pointer shadow-2xl border border-white/10"
              style={{
                background: "linear-gradient(135deg, color-mix(in srgb, var(--accent) 90%, #1e1b4b), #4338ca)",
              }}
            >
              <div className="absolute top-0 right-0 p-4 opacity-15 group-hover:scale-125 transition-transform duration-700">
                <Sparkles size={44} />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-90 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                Security desk
              </p>
              <a href={`tel:+91${societyConfig.contact.phone}`} className="flex items-center justify-between gap-2">
                <span className="text-lg sm:text-xl font-black tracking-tight">+91 {societyConfig.contact.phone.replace(/(\d{5})(\d{5})/, "$1 $2")}</span>
                <div className="bg-white/20 p-2.5 rounded-xl backdrop-blur-md shrink-0">
                  <Phone size={20} fill="currentColor" />
                </div>
              </a>
            </div>
          </div>
        </div>

        <div
          className="pt-10 border-t flex flex-col md:flex-row items-center justify-between gap-8"
          style={{ borderColor: "var(--footer-border)" }}
        >
          <div
           
            className="text-[11px] font-black uppercase tracking-[0.18em] flex flex-wrap items-center justify-center gap-3 opacity-70"
          >
            © {currentYear} {societyConfig.name} Hub
            <span className="hidden md:inline opacity-30">|</span>
            <span className="flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
              Made with <Heart size={14} className="text-rose-400 fill-rose-400" /> for community
            </span>
          </div>

          <div className="flex flex-wrap justify-center gap-8">
            {["Privacy", "Terms"].map((text) => (
              <Link
                key={text}
                to="/"
                className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 hover:opacity-100 transition-opacity relative group"
              >
                {text}
                <span className="absolute -bottom-1.5 left-0 w-0 h-0.5 bg-[var(--accent)] group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
