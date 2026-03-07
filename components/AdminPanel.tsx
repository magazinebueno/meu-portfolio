'use client';

import { useState, useEffect } from 'react';
import { 
  Fingerprint, Lock, LogOut, Cog, Briefcase, Home, ChartBar, 
  MessageSquare, Contact, Megaphone, Plus, Edit, Trash, 
  Save, X, Check, Star, AlertTriangle, Loader2, Upload,
  Image as ImageIcon
} from 'lucide-react';
import { Service, Testimonial, SiteData } from '@/lib/data';
import { motion, AnimatePresence } from 'motion/react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';

interface AdminPanelProps {
  services: Service[];
  testimonials: Testimonial[];
  siteData: SiteData;
  onUpsertService: (service: Service) => Promise<void>;
  onDeleteService: (id: number) => Promise<void>;
  onUpsertTestimonial: (testimonial: Testimonial) => Promise<void>;
  onDeleteTestimonial: (id: number) => Promise<void>;
  onUpdateSiteData: (data: SiteData) => Promise<void>;
  onShowToast: (title: string, message: string) => void;
  isSyncing: boolean;
}

const CATEGORIES = ['Sites', 'Identidade Visual', 'Social Media', 'Marketing'];

export default function AdminPanel({
  services, testimonials, siteData,
  onUpsertService, onDeleteService, 
  onUpsertTestimonial, onDeleteTestimonial,
  onUpdateSiteData,
  onShowToast,
  isSyncing
}: AdminPanelProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('services');
  
  // Login state
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  // Service Edit State
  const [isServiceModalOpen, setIsServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
  
  // Testimonial Edit State
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

  // Delete State
  const [deleteConfirm, setDeleteConfirm] = useState<{ id: number; type: 'service' | 'testimonial'; name: string } | null>(null);

  // Upload State
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File, type: 'service' | 'testimonial') => {
    try {
      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${type}s/${fileName}`;

      const { error: uploadError, data } = await supabase.storage
        .from('portfolio')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error);
      onShowToast('Erro no Upload', error.message || 'Não foi possível subir a imagem.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (user === 'andre' && pass === '929130ab#') {
      setIsLoggedIn(true);
      setIsLoginOpen(false);
      setIsPanelOpen(true);
      onShowToast('Bem-vindo!', 'Login realizado com sucesso');
    } else {
      onShowToast('Erro', 'Usuário ou senha incorretos');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setIsPanelOpen(false);
    onShowToast('Até logo', 'Logout realizado com sucesso');
  };

  // Service Handlers
  const openAddService = () => {
    setEditingService({
      id: Date.now(),
      title: '',
      category: 'Sites',
      price: 0,
      duration: '',
      revisions: '',
      image: '',
      description: '',
      features: ['']
    });
    setIsServiceModalOpen(true);
  };

  const openEditService = (service: Service) => {
    setEditingService({ ...service });
    setIsServiceModalOpen(true);
  };

  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;

    const success = await onUpsertService(editingService as Service);
    if (success) {
      setIsServiceModalOpen(false);
      onShowToast('Sucesso', 'Serviço salvo com sucesso');
    }
  };

  // Testimonial Handlers
  const openAddTestimonial = () => {
    setEditingTestimonial({
      id: Date.now(),
      name: '',
      company: '',
      text: '',
      rating: 5,
      image: ''
    });
    setIsTestimonialModalOpen(true);
  };

  const openEditTestimonial = (t: Testimonial) => {
    setEditingTestimonial({ ...t });
    setIsTestimonialModalOpen(true);
  };

  const handleTestimonialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;

    const success = await onUpsertTestimonial(editingTestimonial as Testimonial);
    if (success) {
      setIsTestimonialModalOpen(false);
      onShowToast('Sucesso', 'Depoimento salvo com sucesso');
    }
  };

  const confirmDelete = async () => {
    if (!deleteConfirm) return;

    let success = false;
    if (deleteConfirm.type === 'service') {
      success = await onDeleteService(deleteConfirm.id);
    } else {
      success = await onDeleteTestimonial(deleteConfirm.id);
    }

    if (success) {
      setDeleteConfirm(null);
      onShowToast('Sucesso', 'Item excluído');
    }
  };

  return (
    <>
      {/* Admin Fingerprint Icon */}
      {!isPanelOpen && (
        <div className="admin-fingerprint flex items-center gap-2" onClick={() => setIsLoginOpen(true)} title="Área Administrativa">
          <Fingerprint className="w-6 h-6 text-primary" />
          {isSyncing && <Loader2 className="w-4 h-4 text-primary animate-spin" />}
        </div>
      )}

      {/* Save All Button - Removed as auto-save is implemented */}

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="admin-login-modal">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="login-box"
            >
              <div className="relative z-10">
                <div className="w-20 h-20 bg-primary/10 border-2 border-primary/30 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-slow">
                  <Fingerprint className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-2xl font-black italic text-center text-text-secondary mb-2">Acesso Restrito</h2>
                <p className="text-text-primary/60 text-center text-sm mb-6">Área Administrativa</p>
                
                <form onSubmit={handleLogin}>
                  <div className="mb-4">
                    <label className="block text-primary text-xs font-bold uppercase mb-2">Usuário</label>
                    <input 
                      type="text" 
                      value={user}
                      onChange={(e) => setUser(e.target.value)}
                      className="w-full bg-dark/50 border border-primary/30 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      placeholder="Digite o usuário" 
                      required 
                    />
                  </div>
                  <div className="mb-6">
                    <label className="block text-primary text-xs font-bold uppercase mb-2">Senha</label>
                    <input 
                      type="password" 
                      value={pass}
                      onChange={(e) => setPass(e.target.value)}
                      className="w-full bg-dark/50 border border-primary/30 rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" 
                      placeholder="Digite a senha" 
                      required 
                    />
                  </div>
                  <button type="submit" className="w-full btn-primary py-4 rounded-xl font-black uppercase italic shadow-lg flex items-center justify-center gap-2">
                    <Lock className="w-5 h-5" /> Entrar
                  </button>
                </form>
                
                <button onClick={() => setIsLoginOpen(false)} className="mt-4 w-full text-text-primary/50 hover:text-text-primary text-sm transition-colors">
                  Voltar ao site
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Admin Panel */}
      <AnimatePresence>
        {isPanelOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="admin-panel"
          >
            <div className="admin-header sticky top-0 z-20 bg-dark/95 backdrop-blur-md border-b border-primary/10">
              <div className="container mx-auto px-4 py-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-lg flex items-center justify-center">
                      <Cog className="text-dark w-5 h-5" />
                    </div>
                    <div>
                      <h1 className="text-xl font-black italic text-text-secondary">Painel Administrativo</h1>
                      <p className="text-xs text-text-primary/60">Gerenciamento Completo</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-text-primary/60 text-sm hidden sm:inline">Bem-vindo, <strong className="text-primary">André</strong></span>
                    <button onClick={handleLogout} className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
                      <LogOut className="w-4 h-4" /> Sair
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="container mx-auto px-4 py-8">
              <div className="admin-nav no-scrollbar flex gap-2 overflow-x-auto mb-8">
                {[
                  { id: 'services', icon: Briefcase, label: 'Serviços' },
                  { id: 'hero', icon: Home, label: 'Hero Section' },
                  { id: 'stats', icon: ChartBar, label: 'Estatísticas' },
                  { id: 'testimonials', icon: MessageSquare, label: 'Depoimentos' },
                  { id: 'contact', icon: Contact, label: 'Contato' },
                  { id: 'cta', icon: Megaphone, label: 'CTA Final' }
                ].map(section => (
                  <button 
                    key={section.id}
                    onClick={() => setActiveSection(section.id)} 
                    className={`admin-nav-btn ${activeSection === section.id ? 'active' : ''}`}
                  >
                    <section.icon className="w-4 h-4 mr-2 inline" /> {section.label}
                  </button>
                ))}
              </div>

              {/* Services Section */}
              {activeSection === 'services' && (
                <div className="animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-text-secondary mb-1">Gerenciar Serviços</h2>
                      <p className="text-text-primary/60 text-sm">Adicione, edite ou remova serviços do portfólio</p>
                    </div>
                    <button onClick={openAddService} className="admin-btn-add flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Novo Serviço
                    </button>
                  </div>

                  <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Serviço</th>
                            <th>Categoria</th>
                            <th>Preço</th>
                            <th>Duração</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {services.map(s => (
                            <tr key={s.id}>
                              <td className="font-mono text-primary">#{s.id}</td>
                              <td>
                                <div className="relative w-16 h-12 rounded-lg overflow-hidden border border-primary/20">
                                  <Image src={s.image} alt={s.title} fill className="object-cover" referrerPolicy="no-referrer" />
                                </div>
                              </td>
                              <td className="font-bold text-text-secondary">{s.title}</td>
                              <td>
                                <span className="tag text-[10px] px-2 py-1 rounded-full">{s.category}</span>
                              </td>
                              <td className="font-bold text-primary">R$ {s.price.toFixed(2)}</td>
                              <td className="text-sm text-text-primary/70">{s.duration}</td>
                              <td>
                                <button onClick={() => openEditService(s)} className="admin-btn admin-btn-edit">
                                  <Edit className="w-3 h-3" /> Editar
                                </button>
                                <button onClick={() => setDeleteConfirm({ id: s.id, type: 'service', name: s.title })} className="admin-btn admin-btn-delete">
                                  <Trash className="w-3 h-3" /> Excluir
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Hero Section */}
              {activeSection === 'hero' && (
                <div className="animate-fade-in">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-text-secondary mb-1">Editar Hero Section</h2>
                    <p className="text-text-primary/60 text-sm">Personalize a página inicial</p>
                  </div>
                  
                  <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="admin-form">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label>Tagline Superior</label>
                          <input 
                            type="text" 
                            value={siteData.hero.tagline} 
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, tagline: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Título Principal - Linha 1</label>
                          <input 
                            type="text" 
                            value={siteData.hero.title1}
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, title1: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Título Principal - Linha 2</label>
                          <input 
                            type="text" 
                            value={siteData.hero.title2}
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, title2: e.target.value } })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label>Descrição</label>
                          <textarea 
                            rows={3} 
                            value={siteData.hero.description}
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, description: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Texto Botão Principal</label>
                          <input 
                            type="text" 
                            value={siteData.hero.btn1}
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, btn1: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Texto Botão Secundário</label>
                          <input 
                            type="text" 
                            value={siteData.hero.btn2}
                            onChange={(e) => onUpdateSiteData({ ...siteData, hero: { ...siteData.hero, btn2: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Section */}
              {activeSection === 'stats' && (
                <div className="animate-fade-in">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-text-secondary mb-1">Editar Estatísticas</h2>
                    <p className="text-text-primary/60 text-sm">Números exibidos na hero section</p>
                  </div>
                  
                  <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="admin-form">
                      <div className="grid md:grid-cols-3 gap-6">
                        <div>
                          <label>Projetos Realizados</label>
                          <input 
                            type="text" 
                            value={siteData.stats.projects}
                            onChange={(e) => onUpdateSiteData({ ...siteData, stats: { ...siteData.stats, projects: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Clientes Atendidos</label>
                          <input 
                            type="text" 
                            value={siteData.stats.clients}
                            onChange={(e) => onUpdateSiteData({ ...siteData, stats: { ...siteData.stats, clients: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Avaliação Média</label>
                          <input 
                            type="text" 
                            value={siteData.stats.rating}
                            onChange={(e) => onUpdateSiteData({ ...siteData, stats: { ...siteData.stats, rating: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Testimonials Section */}
              {activeSection === 'testimonials' && (
                <div className="animate-fade-in">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
                    <div>
                      <h2 className="text-2xl font-black text-text-secondary mb-1">Gerenciar Depoimentos</h2>
                      <p className="text-text-primary/60 text-sm">Opiniões dos clientes exibidas no site</p>
                    </div>
                    <button onClick={openAddTestimonial} className="admin-btn-add flex items-center gap-2">
                      <Plus className="w-5 h-5" /> Novo Depoimento
                    </button>
                  </div>

                  <div className="glass-panel rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>Foto</th>
                            <th>Nome</th>
                            <th>Empresa</th>
                            <th>Depoimento</th>
                            <th>Nota</th>
                            <th>Ações</th>
                          </tr>
                        </thead>
                        <tbody>
                          {testimonials.map(t => (
                            <tr key={t.id}>
                              <td>
                                <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                                  <Image src={t.image} alt={t.name} fill className="object-cover" referrerPolicy="no-referrer" />
                                </div>
                              </td>
                              <td className="font-bold text-text-secondary">{t.name}</td>
                              <td className="text-sm text-text-primary/70">{t.company}</td>
                              <td className="text-sm text-text-primary/70 max-w-xs truncate">{t.text}</td>
                              <td>
                                <div className="flex gap-1">
                                  {Array.from({ length: t.rating }).map((_, i) => (
                                    <Star key={i} className="w-3 h-3 text-primary fill-primary" />
                                  ))}
                                </div>
                              </td>
                              <td>
                                <button onClick={() => openEditTestimonial(t)} className="admin-btn admin-btn-edit">
                                  <Edit className="w-3 h-3" />
                                </button>
                                <button onClick={() => setDeleteConfirm({ id: t.id, type: 'testimonial', name: t.name })} className="admin-btn admin-btn-delete">
                                  <Trash className="w-3 h-3" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Contact Section */}
              {activeSection === 'contact' && (
                <div className="animate-fade-in">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-text-secondary mb-1">Informações de Contato</h2>
                    <p className="text-text-primary/60 text-sm">Dados exibidos no site e modal de contato</p>
                  </div>
                  
                  <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="admin-form">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label>WhatsApp (com DDD)</label>
                          <input 
                            type="text" 
                            value={siteData.contact.whatsapp}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, whatsapp: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Telefone Formatado</label>
                          <input 
                            type="text" 
                            value={siteData.contact.phone}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, phone: e.target.value } })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label>E-mail</label>
                          <input 
                            type="email" 
                            value={siteData.contact.email}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, email: e.target.value } })}
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label>Endereço</label>
                          <input 
                            type="text" 
                            value={siteData.contact.address}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, address: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Instagram</label>
                          <input 
                            type="text" 
                            value={siteData.contact.instagram}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, instagram: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Facebook</label>
                          <input 
                            type="text" 
                            value={siteData.contact.facebook}
                            onChange={(e) => onUpdateSiteData({ ...siteData, contact: { ...siteData.contact, facebook: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* CTA Section */}
              {activeSection === 'cta' && (
                <div className="animate-fade-in">
                  <div className="mb-8">
                    <h2 className="text-2xl font-black text-text-secondary mb-1">Editar CTA Final</h2>
                    <p className="text-text-primary/60 text-sm">Seção de chamada para ação no final da página</p>
                  </div>
                  
                  <div className="glass-panel rounded-2xl p-6 md:p-8">
                    <div className="admin-form">
                      <div className="grid md:grid-cols-1 gap-6">
                        <div>
                          <label>Título</label>
                          <input 
                            type="text" 
                            value={siteData.cta.title}
                            onChange={(e) => onUpdateSiteData({ ...siteData, cta: { ...siteData.cta, title: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Descrição</label>
                          <textarea 
                            rows={3} 
                            value={siteData.cta.description}
                            onChange={(e) => onUpdateSiteData({ ...siteData, cta: { ...siteData.cta, description: e.target.value } })}
                          />
                        </div>
                        <div>
                          <label>Texto do Botão</label>
                          <input 
                            type="text" 
                            value={siteData.cta.button}
                            onChange={(e) => onUpdateSiteData({ ...siteData, cta: { ...siteData.cta, button: e.target.value } })}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Service Edit Modal */}
      <AnimatePresence>
        {isServiceModalOpen && editingService && (
          <div className="fixed inset-0 z-[100] modal-overlay overflow-y-auto p-4 flex items-start justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-primary/20 rounded-2xl md:rounded-3xl shadow-2xl max-w-xl mx-auto p-5 md:p-6 relative w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsServiceModalOpen(false)} className="absolute top-4 right-4 text-primary/60 hover:text-primary z-10">
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-4">
                <h3 className="text-2xl font-black italic text-text-secondary mb-1">
                  {editingService.id ? 'Editar Serviço' : 'Novo Serviço'}
                </h3>
                <p className="text-text-primary/60 text-xs">Preencha os dados do serviço abaixo</p>
              </div>
              
              <form onSubmit={handleServiceSubmit} className="admin-form">
                <div className="grid md:grid-cols-2 gap-x-4 gap-y-1">
                  <div className="md:col-span-2">
                    <label>Título do Serviço</label>
                    <input 
                      type="text" 
                      value={editingService.title} 
                      onChange={(e) => setEditingService({ ...editingService, title: e.target.value })}
                      required 
                      className="py-2"
                    />
                  </div>
                  <div>
                    <label>Categoria</label>
                    <select 
                      value={editingService.category} 
                      onChange={(e) => setEditingService({ ...editingService, category: e.target.value })}
                      required
                      className="py-2"
                    >
                      {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label>Preço (R$)</label>
                    <input 
                      type="number" 
                      value={editingService.price} 
                      onChange={(e) => setEditingService({ ...editingService, price: parseFloat(e.target.value) })}
                      step="0.01" 
                      required 
                      className="py-2"
                    />
                  </div>
                  <div>
                    <label>Duração</label>
                    <input 
                      type="text" 
                      value={editingService.duration} 
                      onChange={(e) => setEditingService({ ...editingService, duration: e.target.value })}
                      required 
                      className="py-2"
                    />
                  </div>
                  <div>
                    <label>Revisões</label>
                    <input 
                      type="text" 
                      value={editingService.revisions} 
                      onChange={(e) => setEditingService({ ...editingService, revisions: e.target.value })}
                      required 
                      className="py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Imagem do Serviço</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="relative w-32 h-24 rounded-xl overflow-hidden border-2 border-primary/20 bg-dark flex-shrink-0">
                        {editingService.image ? (
                          <Image src={editingService.image} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/40">
                            <ImageIcon className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-3">
                        <div className="flex gap-2">
                          <input 
                            type="url" 
                            placeholder="URL da Imagem (ou use o botão de upload)"
                            value={editingService.image} 
                            onChange={(e) => setEditingService({ ...editingService, image: e.target.value })}
                            className="py-2 mb-0 flex-1"
                          />
                        </div>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleImageUpload(file, 'service');
                                if (url) setEditingService({ ...editingService, image: url });
                              }
                            }}
                            className="hidden"
                            id="service-image-upload"
                            disabled={isUploading}
                          />
                          <label 
                            htmlFor="service-image-upload"
                            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold cursor-pointer hover:bg-primary/10 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isUploading ? 'Enviando...' : 'Fazer Upload do Computador'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label>Descrição</label>
                    <textarea 
                      rows={2} 
                      value={editingService.description} 
                      onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                      required 
                      className="py-2"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Funcionalidades Incluídas</label>
                    <div className="space-y-2">
                      {editingService.features?.map((feat, idx) => (
                        <div key={idx} className="flex gap-2">
                          <input 
                            type="text" 
                            value={feat} 
                            onChange={(e) => {
                              const newFeatures = [...(editingService.features || [])];
                              newFeatures[idx] = e.target.value;
                              setEditingService({ ...editingService, features: newFeatures });
                            }}
                            required 
                            className="py-2 mb-0"
                          />
                          <button 
                            type="button" 
                            onClick={() => {
                              const newFeatures = editingService.features?.filter((_, i) => i !== idx);
                              setEditingService({ ...editingService, features: newFeatures });
                            }}
                            className="bg-red-500/20 text-red-400 p-2 rounded-lg flex-shrink-0"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setEditingService({ ...editingService, features: [...(editingService.features || []), ''] })}
                      className="w-full py-2 border border-dashed border-primary/30 text-primary rounded-lg mt-2 text-sm"
                    >
                      + Adicionar Funcionalidade
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <button type="button" onClick={() => setIsServiceModalOpen(false)} className="flex-1 btn-secondary py-3 rounded-xl font-bold">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-3 rounded-xl font-black uppercase italic">
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Testimonial Edit Modal */}
      <AnimatePresence>
        {isTestimonialModalOpen && editingTestimonial && (
          <div className="fixed inset-0 z-[100] modal-overlay overflow-y-auto p-4 flex items-start justify-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-primary/20 rounded-2xl md:rounded-3xl shadow-2xl max-w-xl mx-auto p-5 md:p-6 relative w-full my-8 max-h-[90vh] overflow-y-auto"
            >
              <button onClick={() => setIsTestimonialModalOpen(false)} className="absolute top-4 right-4 text-primary/60 hover:text-primary">
                <X className="w-6 h-6" />
              </button>
              
              <div className="mb-4">
                <h3 className="text-2xl font-black italic text-text-secondary mb-1">
                  {editingTestimonial.id ? 'Editar Depoimento' : 'Novo Depoimento'}
                </h3>
              </div>
              
              <form onSubmit={handleTestimonialSubmit} className="admin-form">
                <div className="grid md:grid-cols-2 gap-3">
                  <div>
                    <label>Nome do Cliente</label>
                    <input 
                      type="text" 
                      value={editingTestimonial.name} 
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                      required 
                    />
                  </div>
                  <div>
                    <label>Nome da Empresa</label>
                    <input 
                      type="text" 
                      value={editingTestimonial.company} 
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, company: e.target.value })}
                      required 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label>Foto do Cliente</label>
                    <div className="flex flex-col md:flex-row gap-4 items-start">
                      <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-primary/20 bg-dark flex-shrink-0">
                        {editingTestimonial.image ? (
                          <Image src={editingTestimonial.image} alt="Preview" fill className="object-cover" referrerPolicy="no-referrer" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/40">
                            <Contact className="w-8 h-8" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 w-full space-y-3">
                        <div className="flex gap-2">
                          <input 
                            type="url" 
                            placeholder="URL da Foto (ou use o botão de upload)"
                            value={editingTestimonial.image} 
                            onChange={(e) => setEditingTestimonial({ ...editingTestimonial, image: e.target.value })}
                            className="py-2 mb-0 flex-1"
                          />
                        </div>
                        <div className="relative">
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const url = await handleImageUpload(file, 'testimonial');
                                if (url) setEditingTestimonial({ ...editingTestimonial, image: url });
                              }
                            }}
                            className="hidden"
                            id="testimonial-image-upload"
                            disabled={isUploading}
                          />
                          <label 
                            htmlFor="testimonial-image-upload"
                            className={`flex items-center justify-center gap-2 w-full py-2 px-4 rounded-xl border-2 border-dashed border-primary/30 text-primary font-bold cursor-pointer hover:bg-primary/10 transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            {isUploading ? 'Enviando...' : 'Fazer Upload do Computador'}
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label>Nota (1-5)</label>
                    <select 
                      value={editingTestimonial.rating} 
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })}
                      required
                    >
                      {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} estrelas</option>)}
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label>Depoimento</label>
                    <textarea 
                      rows={3} 
                      value={editingTestimonial.text} 
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, text: e.target.value })}
                      required 
                    />
                  </div>
                </div>
                
                <div className="flex gap-3 mt-4">
                  <button type="button" onClick={() => setIsTestimonialModalOpen(false)} className="flex-1 btn-secondary py-3 rounded-xl font-bold">
                    Cancelar
                  </button>
                  <button type="submit" className="flex-1 btn-primary py-3 rounded-xl font-black uppercase italic">
                    Salvar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-[110] modal-overlay flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-card border border-red-500/30 rounded-2xl shadow-2xl max-w-md w-full p-6 md:p-8"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-400" />
                </div>
                <h3 className="text-xl font-black text-text-secondary mb-2">Confirmar Exclusão</h3>
                <p className="text-text-primary/60 text-sm">
                  Tem certeza que deseja excluir <strong className="text-primary">{deleteConfirm.name}</strong>? Esta ação não pode ser desfeita.
                </p>
              </div>
              
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 btn-secondary py-3 rounded-xl font-bold">
                  Cancelar
                </button>
                <button onClick={confirmDelete} className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-black uppercase transition-all">
                  Excluir
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
