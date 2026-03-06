'use client';

import { useState, useEffect } from 'react';
import { 
  Paintbrush, MessageCircle, Instagram, Facebook, Linkedin, 
  Mail, MapPin, Phone, ArrowRight, Github
} from 'lucide-react';
import { 
  DEFAULT_SERVICES, DEFAULT_TESTIMONIALS, DEFAULT_SITE_DATA, 
  Service, Testimonial, SiteData 
} from '@/lib/data';
import { supabase } from '@/lib/supabase';
import Hero from '@/components/Hero';
import Portfolio from '@/components/Portfolio';
import Testimonials from '@/components/Testimonials';
import ContactModal from '@/components/ContactModal';
import ServiceModal from '@/components/ServiceModal';
import AdminPanel from '@/components/AdminPanel';
import Toast from '@/components/Toast';

const STORAGE_KEYS = {
  SERVICES: 'sia_services',
  TESTIMONIALS: 'sia_testimonials',
  SITE_DATA: 'sia_site_data',
};

export default function Home() {
  // State
  const [services, setServices] = useState<Service[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [siteData, setSiteData] = useState<SiteData>(DEFAULT_SITE_DATA);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasLoadedFromSupabase, setHasLoadedFromSupabase] = useState(false);
  
  // UI State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [toast, setToast] = useState({ title: '', message: '', isVisible: false });

  // Load data from Supabase (with localStorage fallback)
  useEffect(() => {
    const loadData = async () => {
      try {
        // Try to load from Supabase with cache busting
        const { data: servicesData } = await supabase.from('services').select('*').order('id');
        const { data: testimonialsData } = await supabase.from('testimonials').select('*').order('id', { ascending: false });
        const { data: siteConfigData } = await supabase.from('site_config').select('*').eq('id', 1).single();

        let loadedFromSupabase = false;

        if (servicesData && servicesData.length > 0) {
          setServices(servicesData);
          loadedFromSupabase = true;
        } else {
          const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
          setServices(savedServices ? JSON.parse(savedServices) : DEFAULT_SERVICES);
        }

        if (testimonialsData && testimonialsData.length > 0) {
          setTestimonials(testimonialsData);
          loadedFromSupabase = true;
        } else {
          const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
          setTestimonials(savedTestimonials ? JSON.parse(savedTestimonials) : DEFAULT_TESTIMONIALS);
        }

        if (siteConfigData) {
          setSiteData(siteConfigData.data);
          loadedFromSupabase = true;
        } else {
          const savedSiteData = localStorage.getItem(STORAGE_KEYS.SITE_DATA);
          setSiteData(savedSiteData ? JSON.parse(savedSiteData) : DEFAULT_SITE_DATA);
        }

        setHasLoadedFromSupabase(loadedFromSupabase);
      } catch (error) {
        console.error('Error loading from Supabase:', error);
        // Fallback to localStorage
        const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
        const savedTestimonials = localStorage.getItem(STORAGE_KEYS.TESTIMONIALS);
        const savedSiteData = localStorage.getItem(STORAGE_KEYS.SITE_DATA);

        setServices(savedServices ? JSON.parse(savedServices) : DEFAULT_SERVICES);
        setTestimonials(savedTestimonials ? JSON.parse(savedTestimonials) : DEFAULT_TESTIMONIALS);
        setSiteData(savedSiteData ? JSON.parse(savedSiteData) : DEFAULT_SITE_DATA);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  // Auto-save to localStorage and Supabase
  useEffect(() => {
    if (isLoaded) {
      // LocalStorage sync (immediate)
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(services));
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(testimonials));
      localStorage.setItem(STORAGE_KEYS.SITE_DATA, JSON.stringify(siteData));

      // Supabase sync (debounced to avoid hitting API limits during typing)
      const timeoutId = setTimeout(async () => {
        // Only sync to Supabase if we have successfully loaded from it or if we are the admin making changes
        // This prevents default data from overwriting the database if the fetch fails
        if (!hasLoadedFromSupabase) return;

        try {
          // Site Config
          await supabase.from('site_config').upsert({ id: 1, data: siteData });

          // Services
          if (services.length > 0) {
            await supabase.from('services').upsert(services);
          }

          // Testimonials
          if (testimonials.length > 0) {
            await supabase.from('testimonials').upsert(testimonials);
          }
        } catch (error) {
          console.error('Supabase sync error:', error);
        }
      }, 2000); // 2 second debounce

      return () => clearTimeout(timeoutId);
    }
  }, [services, testimonials, siteData, isLoaded, hasLoadedFromSupabase]);

  const showToast = (title: string, message: string) => {
    setToast({ title, message, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  const updateServices = (newServices: Service[]) => {
    setServices(newServices);
  };

  const updateTestimonials = (newTestimonials: Testimonial[]) => {
    setTestimonials(newTestimonials);
    setHasLoadedFromSupabase(true); // Allow syncing after admin update
  };

  const updateSiteData = (newData: SiteData) => {
    setSiteData(newData);
    setHasLoadedFromSupabase(true); // Allow syncing after admin update
  };

  if (!isLoaded) return null;

  return (
    <main className="min-h-screen">
      <Hero data={siteData} onOpenContact={() => setIsContactOpen(true)} />
      
      <Portfolio 
        services={services} 
        onOpenService={setSelectedService} 
        onOpenContact={() => setIsContactOpen(true)} 
      />
      
      <Testimonials testimonials={testimonials} />
      
      {/* CTA Final */}
      <section className="py-16 md:py-20 relative overflow-hidden bg-dark">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent"></div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black italic text-text-secondary mb-4 md:mb-6">
            {siteData.cta.title}
          </h2>
          <p className="text-text-primary/80 max-w-xl mx-auto mb-6 md:mb-8 text-base md:text-lg px-4">
            {siteData.cta.description}
          </p>
          <button 
            onClick={() => setIsContactOpen(true)}
            className="btn-primary px-8 md:px-12 py-5 md:py-6 rounded-2xl shadow-2xl uppercase italic text-lg md:text-xl inline-flex items-center gap-3"
          >
            <MessageCircle className="w-6 h-6 md:w-8 md:h-8" /> <span>{siteData.cta.button}</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark border-t border-primary/20 py-10 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 mb-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                  <Paintbrush className="text-dark w-5 h-5" />
                </div>
                <span className="text-lg md:text-xl font-black italic text-text-secondary">SIA CRIATIVE</span>
              </div>
              <p className="text-text-primary/70 text-sm leading-relaxed">
                Transformando ideias em realidade digital desde 2020.
              </p>
            </div>
            <div>
              <h4 className="text-text-secondary font-bold mb-3 md:mb-4 uppercase text-xs md:text-sm tracking-wider">Serviços</h4>
              <ul className="space-y-2 text-text-primary/70 text-xs md:text-sm">
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Criação de Sites</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Identidade Visual</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Social Media</a></li>
                <li><a href="#portfolio" className="hover:text-primary transition-colors">Marketing Digital</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-text-secondary font-bold mb-3 md:mb-4 uppercase text-xs md:text-sm tracking-wider">Contato</h4>
              <ul className="space-y-2 text-text-primary/70 text-xs md:text-sm">
                <li className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-primary" /> <span>{siteData.contact.phone}</span></li>
                <li className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary" /> <span>{siteData.contact.email}</span></li>
                <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-primary" /> <span>{siteData.contact.address}</span></li>
              </ul>
            </div>
            <div>
              <h4 className="text-text-secondary font-bold mb-3 md:mb-4 uppercase text-xs md:text-sm tracking-wider">Redes Sociais</h4>
              <div className="flex gap-3">
                <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-card border border-primary/20 rounded-lg flex items-center justify-center text-text-primary/70 hover:bg-primary hover:text-dark hover:border-primary transition-all">
                  <Instagram className="w-4 h-4 md:w-5 md:h-5" />
                </a>
                <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-card border border-primary/20 rounded-lg flex items-center justify-center text-text-primary/70 hover:bg-primary hover:text-dark hover:border-primary transition-all">
                  <Facebook className="w-4 h-4 md:w-5 md:h-5" />
                </a>
                <a href="#" className="w-9 h-9 md:w-10 md:h-10 bg-card border border-primary/20 rounded-lg flex items-center justify-center text-text-primary/70 hover:bg-primary hover:text-dark hover:border-primary transition-all">
                  <Linkedin className="w-4 h-4 md:w-5 md:h-5" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-primary/20 pt-6 md:pt-8 text-center text-text-primary/50 text-xs md:text-sm">
            <p>&copy; 2024 SIA Site Criative. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <ContactModal 
        isOpen={isContactOpen} 
        onClose={() => setIsContactOpen(false)} 
        data={siteData} 
        onShowToast={showToast} 
      />
      
      <ServiceModal 
        service={selectedService} 
        onClose={() => setSelectedService(null)} 
        contactData={siteData.contact} 
        onShowToast={showToast} 
      />
      
      <AdminPanel 
        services={services}
        testimonials={testimonials}
        siteData={siteData}
        onUpdateServices={updateServices}
        onUpdateTestimonials={updateTestimonials}
        onUpdateSiteData={updateSiteData}
        onShowToast={showToast}
      />
      
      <Toast {...toast} />
    </main>
  );
}
