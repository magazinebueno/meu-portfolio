export interface Service {
  id: number;
  category: string;
  title: string;
  description: string;
  price: number;
  duration: string;
  revisions: string;
  image: string;
  features: string[];
}

export interface Testimonial {
  id: number;
  name: string;
  company: string;
  text: string;
  rating: number;
  image: string;
}

export interface SiteData {
  hero: {
    tagline: string;
    title1: string;
    title2: string;
    description: string;
    btn1: string;
    btn2: string;
  };
  stats: {
    projects: string;
    clients: string;
    rating: string;
  };
  contact: {
    whatsapp: string;
    phone: string;
    email: string;
    address: string;
    instagram: string;
    facebook: string;
  };
  cta: {
    title: string;
    description: string;
    button: string;
  };
}

export const DEFAULT_SERVICES: Service[] = [
  {
    id: 1,
    category: 'Sites',
    title: 'Site Institucional Profissional',
    description: 'Site completo e responsivo para sua empresa, com design moderno, otimizado para SEO e pronto para converter visitantes em clientes. Inclui até 5 páginas, formulário de contato e integração com WhatsApp.',
    price: 1200.00,
    duration: '7-10 dias úteis',
    revisions: '3 revisões incluídas',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    features: ['Design responsivo (mobile, tablet, desktop)', 'SEO básico otimizado', 'Integração WhatsApp', 'Formulário de contato', '1 ano de hospedagem grátis', 'Certificado SSL incluso']
  },
  {
    id: 2,
    category: 'Sites',
    title: 'E-commerce Completo',
    description: 'Loja virtual profissional integrada com meios de pagamento (Pix, cartão, boleto), gestão de estoque, frete automático e painel administrativo completo. Pronto para vender 24h por dia.',
    price: 2500.00,
    duration: '15-20 dias úteis',
    revisions: '5 revisões incluídas',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&q=80&w=800',
    features: ['Integração PagSeguro/Mercado Pago', 'Gestão de produtos e estoque', 'Cálculo automático de frete', 'Área do cliente', 'Relatórios de vendas', 'Suporte técnico 30 dias']
  },
  {
    id: 3,
    category: 'Identidade Visual',
    title: 'Logo + Identidade Visual',
    description: 'Criação de marca completa: logotipo, paleta de cores, tipografia, cartão de visita digital e manual de uso da marca. Tudo que você precisa para profissionalizar sua empresa.',
    price: 800.00,
    duration: '5-7 dias úteis',
    revisions: 'Revisões ilimitadas',
    image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=800',
    features: ['3 propostas de logo', 'Paleta de cores oficial', 'Tipografia definida', 'Cartão de visita digital', 'Manual da marca', 'Arquivos em todos formatos']
  },
  {
    id: 4,
    category: 'Social Media',
    title: 'Gestão de Redes Sociais',
    description: 'Administração completa das suas redes sociais com posts diários, stories, interação com seguidores e relatórios mensais de crescimento. Aumente sua presença digital.',
    price: 600.00,
    duration: 'Mensal',
    revisions: 'Ajustes semanais',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&q=80&w=800',
    features: ['12 posts/mês + stories', 'Legendas estratégicas', 'Agendamento profissional', 'Relatório de métricas', 'Interação com seguidores', 'Suporte via WhatsApp']
  },
  {
    id: 5,
    category: 'Marketing',
    title: 'Tráfego Pago (Ads)',
    description: 'Campanhas otimizadas no Google Ads, Facebook e Instagram Ads para trazer clientes qualificados para seu negócio. Gestão completa com relatórios de ROI.',
    price: 900.00,
    duration: 'Mensal + investimento em mídia',
    revisions: 'Otimização contínua',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&q=80&w=800',
    features: ['Criação de campanhas', 'Segmentação estratégica', 'Anúncios criativos', 'Relatório semanal', 'Otimização de conversão', 'Suporte prioritário']
  },
  {
    id: 6,
    category: 'Sites',
    title: 'Landing Page de Vendas',
    description: 'Página de vendas otimizada para conversão, com copywriting persuasivo, design profissional e integração com ferramentas de e-mail marketing. Ideal para lançamentos.',
    price: 800.00,
    duration: '5-7 dias úteis',
    revisions: '3 revisões incluídas',
    image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?auto=format&fit=crop&q=80&w=800',
    features: ['Copywriting persuasivo', 'Design focado em conversão', 'Formulário de captura', 'Integração e-mail marketing', 'Teste A/B incluso', 'Análise de heatmap']
  },
  {
    id: 7,
    category: 'Identidade Visual',
    title: 'Pack de Artes Social Media',
    description: '30 artes profissionais para redes sociais, incluindo posts, stories, capas e destaques. Designs modernos alinhados com a identidade da sua marca.',
    price: 450.00,
    duration: '3-5 dias úteis',
    revisions: '2 revisões inclusas',
    image: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?auto=format&fit=crop&q=80&w=800',
    features: ['30 artes personalizadas', 'Posts e stories', 'Capas para destaques', 'Templates editáveis', 'Alinhamento de marca', 'Entrega em alta resolução']
  },
  {
    id: 8,
    category: 'Sites',
    title: 'Sistema Web Personalizado',
    description: 'Desenvolvimento de sistemas web sob medida: painéis administrativos, áreas de cliente, automações e integrações específicas para seu negócio.',
    price: 3500.00,
    duration: 'Sob consulta',
    revisions: 'Testes inclusos',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
    features: ['Análise de requisitos', 'Desenvolvimento sob medida', 'Banco de dados', 'Painel administrativo', 'Treinamento de uso', 'Suporte técnico estendido']
  }
];

export const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Carlos Mendes',
    company: 'Auto Peças Force',
    text: 'A SIA Criative transformou nossa presença digital. O catálogo online aumentou nossas vendas em 40% no primeiro mês!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 2,
    name: 'Ana Paula',
    company: 'Boutique Elegance',
    text: 'Profissionalismo incrível. Entregaram o e-commerce antes do prazo e com qualidade excepcional. Super recomendo!',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=100'
  },
  {
    id: 3,
    name: 'Roberto Silva',
    company: 'Consultoria Silva',
    text: 'O site institucional ficou perfeito. Design moderno, carregamento rápido e já estou aparecendo no Google.',
    rating: 5,
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100'
  }
];

export const DEFAULT_SITE_DATA: SiteData = {
  hero: {
    tagline: "Criatividade & Inovação Digital",
    title1: "SIA SITE",
    title2: "CRIATIVE",
    description: "Transformamos ideias em experiências digitais extraordinárias. Design, desenvolvimento e marketing que impulsionam seu negócio.",
    btn1: "Ver Serviços",
    btn2: "Falar Agora"
  },
  stats: {
    projects: "150+",
    clients: "50+",
    rating: "5★"
  },
  contact: {
    whatsapp: "5521987537876",
    phone: "(21) 98753-7876",
    email: "contato@siasitecriative.com.br",
    address: "Rio de Janeiro, RJ",
    instagram: "@siacriative",
    facebook: "SIA Criative"
  },
  cta: {
    title: "Pronto para começar?",
    description: "Transforme sua presença digital hoje mesmo. Solicite um orçamento gratuito e sem compromisso.",
    button: "Solicitar Orçamento"
  }
};
