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
  const [isSyncing, setIsSyncing] = useState(false);
  
  // UI State
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [toast, setToast] = useState({ title: '', message: '', isVisible: false });

  // Load data from Supabase (with localStorage fallback)
  useEffect(() => {
    const loadData = async () => {
      try {
        console.log('Iniciando carregamento de dados do Supabase...');
        // Try to load from Supabase with cache busting
        const { data: servicesData, error: sError } = await supabase.from('services').select('*').order('id');
        const { data: testimonialsData, error: tError } = await supabase.from('testimonials').select('*').order('id', { ascending: false });
        const { data: siteConfigData, error: cError } = await supabase.from('site_config').select('*').eq('id', 1).single();

        if (sError) {
          console.warn('Erro ao carregar serviços:', sError);
          if (sError.code === '42P01') console.error('TABELA "services" NÃO EXISTE NO SUPABASE!');
        }
        if (tError) {
          console.warn('Erro ao carregar depoimentos:', tError);
          if (tError.code === '42P01') console.error('TABELA "testimonials" NÃO EXISTE NO SUPABASE!');
        }
        if (cError) {
          console.warn('Erro ao carregar config:', cError);
          if (cError.code === '42P01') console.error('TABELA "site_config" NÃO EXISTE NO SUPABASE!');
        }

        let loadedFromSupabase = false;

        if (servicesData && servicesData.length > 0) {
          console.log('Serviços carregados do Supabase:', servicesData.length);
          setServices(servicesData);
          loadedFromSupabase = true;
        } else {
          const savedServices = localStorage.getItem(STORAGE_KEYS.SERVICES);
          setServices(savedServices ? JSON.parse(savedServices) : DEFAULT_SERVICES);
        }

        if (testimonialsData && testimonialsData.length > 0) {
          console.log('Depoimentos carregados do Supabase:', testimonialsData.length);
          // Map Supabase columns (content, avatar) to frontend properties (text, image)
          const mappedTestimonials = testimonialsData.map((t: any) => ({
            ...t,
            text: t.content || t.text || '',
            image: t.avatar || t.image || ''
          }));
          setTestimonials(mappedTestimonials);
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

    // Subscribe to Realtime changes
    const servicesChannel = supabase.channel('services-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => loadData())
      .subscribe();

    const testimonialsChannel = supabase.channel('testimonials-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, () => loadData())
      .subscribe();

    const siteConfigChannel = supabase.channel('site-config-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_config' }, () => loadData())
      .subscribe();

    return () => {
      supabase.removeChannel(servicesChannel);
      supabase.removeChannel(testimonialsChannel);
      supabase.removeChannel(siteConfigChannel);
    };
  }, []);

  const showToast = (title: string, message: string) => {
    setToast({ title, message, isVisible: true });
    setTimeout(() => setToast(prev => ({ ...prev, isVisible: false })), 3000);
  };

  // Surgical Update Handlers
  const handleUpsertService = async (service: Service) => {
    setIsSyncing(true);
    try {
      // If ID is very large, it's a temporary ID from Date.now(), so we let Supabase generate a real one
      const isNew = service.id > 2147483647 || service.id <= 0;
      
      // Explicitly pick fields and ensure types to avoid circular structures
      const serviceData = {
        category: String(service.category || ''),
        title: String(service.title || ''),
        description: String(service.description || ''),
        price: Number(service.price || 0),
        duration: String(service.duration || ''),
        revisions: String(service.revisions || ''),
        image: String(service.image || ''),
        features: Array.isArray(service.features) ? [...service.features].map(f => String(f)) : []
      };
      
      let result;
      if (isNew) {
        result = await supabase.from('services').insert(serviceData).select();
      } else {
        result = await supabase.from('services').upsert({ ...serviceData, id: service.id }).select();
      }

      const { data, error } = result;
      if (error) {
        const errorMsg = `Erro ${error.code || '?'}: ${error.message || 'Erro desconhecido'}`;
        console.error('Supabase error saving service:', error);
        showToast('Erro do Banco', errorMsg);
        return false;
      }
      
      const savedService = data?.[0] as Service;
      if (!savedService) throw new Error('O servidor não retornou os dados salvos.');

      const updated = services.map(s => s.id === service.id ? savedService : s);
      if (!updated.find(s => s.id === savedService.id)) {
        updated.push(savedService);
      }
      
      setServices(updated);
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      setHasLoadedFromSupabase(true);
      return true;
    } catch (error: any) {
      console.error('Error saving service:', error);
      showToast('Erro ao Salvar', error.message || 'Erro desconhecido ao salvar o serviço.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteService = async (id: number) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) throw error;
      
      const updated = services.filter(s => s.id !== id);
      setServices(updated);
      localStorage.setItem(STORAGE_KEYS.SERVICES, JSON.stringify(updated));
      setHasLoadedFromSupabase(true);
      return true;
    } catch (error) {
      console.error('Error deleting service:', error);
      showToast('Erro', 'Não foi possível excluir o serviço.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpsertTestimonial = async (testimonial: Testimonial) => {
    setIsSyncing(true);
    try {
      // If ID is very large, it's a temporary ID from Date.now(), so we let Supabase generate a real one
      const isNew = testimonial.id > 2147483647 || testimonial.id <= 0;
      
      // Explicitly pick fields and ensure types to avoid circular structures
      const testimonialData = {
        name: String(testimonial.name || '').trim(),
        company: String(testimonial.company || '').trim(),
        content: String(testimonial.text || '').trim(),
        rating: Math.floor(Number(testimonial.rating || 5)),
        avatar: String(testimonial.image || '').trim()
      };
      
      console.log('Tentando salvar depoimento no Supabase:', testimonialData);
      
      let result;
      if (isNew) {
        result = await supabase.from('testimonials').insert(testimonialData).select();
      } else {
        result = await supabase.from('testimonials').upsert({ ...testimonialData, id: testimonial.id }).select();
      }

      if (!result) {
        console.error('Supabase result is undefined');
        showToast('Erro Crítico', 'O servidor não respondeu à solicitação.');
        return false;
      }

      const { data, error } = result;
      if (error) {
        const errorMsg = `Erro ${error.code || '?'}: ${error.message || 'Erro desconhecido'}`;
        console.error('Supabase error saving testimonial:', error);
        showToast('Erro do Banco', errorMsg);
        
        if (error.code === '42P01') {
          showToast('Tabela Faltando', 'A tabela "testimonials" não existe no seu Supabase.');
        } else if (error.code === '42501') {
          showToast('Permissão Negada', 'Verifique as políticas de RLS no seu Supabase.');
        } else if (error.code === 'PGRST204') {
          const missingCol = error.message.match(/'([^']+)'/)?.[1] || 'desconhecida';
          showToast('Coluna Faltando', `A coluna "${missingCol}" está faltando na tabela "testimonials".`);
          console.warn(`DICA SQL: ALTER TABLE testimonials ADD COLUMN ${missingCol} TEXT;`);
        }
        
        return false;
      }
      
      const rawSaved = data?.[0];
      if (!rawSaved) throw new Error('O servidor não retornou os dados salvos.');

      // Map Supabase columns back to frontend properties
      const savedTestimonial: Testimonial = {
        ...rawSaved,
        text: rawSaved.content || rawSaved.text || '',
        image: rawSaved.avatar || rawSaved.image || ''
      };

      const updated = [...testimonials];
      const index = updated.findIndex(t => t.id === testimonial.id);
      
      if (index !== -1) {
        updated[index] = savedTestimonial;
      } else {
        updated.unshift(savedTestimonial);
      }
      
      setTestimonials(updated);
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(updated));
      setHasLoadedFromSupabase(true);
      return true;
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      showToast('Erro ao Salvar', error.message || 'Erro desconhecido ao salvar o depoimento.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('testimonials').delete().eq('id', id);
      if (error) throw error;
      
      const updated = testimonials.filter(t => t.id !== id);
      setTestimonials(updated);
      localStorage.setItem(STORAGE_KEYS.TESTIMONIALS, JSON.stringify(updated));
      setHasLoadedFromSupabase(true);
      return true;
    } catch (error) {
      console.error('Error deleting testimonial:', error);
      showToast('Erro', 'Não foi possível excluir o depoimento.');
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  const handleUpdateSiteData = async (newData: SiteData) => {
    setSiteData(newData);
    setIsSyncing(true);
    try {
      const { error } = await supabase.from('site_config').upsert({ id: 1, data: newData });
      if (error) throw error;
      localStorage.setItem(STORAGE_KEYS.SITE_DATA, JSON.stringify(newData));
      setHasLoadedFromSupabase(true);
      return true;
    } catch (error) {
      console.error('Error updating site config:', error);
      showToast('Erro', 'Não foi possível salvar as configurações.');
      return false;
    } finally {
      setIsSyncing(false);
    }
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
      
      <Testimonials testimonials={testimonials.slice(0, 6)} />
      
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
        onUpsertService={handleUpsertService}
        onDeleteService={handleDeleteService}
        onUpsertTestimonial={handleUpsertTestimonial}
        onDeleteTestimonial={handleDeleteTestimonial}
        onUpdateSiteData={handleUpdateSiteData}
        onShowToast={showToast}
        isSyncing={isSyncing}
      />
      
      <Toast {...toast} />
    </main>
  );
}
