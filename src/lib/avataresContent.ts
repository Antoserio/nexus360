// Contenido del dossier comercial de avatares (https://proposal.immerso.live/dossier-maigia,
// agosto 2026). Bilingüe ES/EN. Los datos de contacto personales del dossier no se
// publican aquí: la página usa el formulario de contacto del sitio.

export type T = { es: string; en: string }

export const OPPORTUNITY = {
  eyebrow: { es: 'La oportunidad', en: 'The opportunity' },
  title: { es: 'Convertir una pantalla en una experiencia que atiende', en: 'Turning a screen into an experience that serves' },
  text: {
    es: 'Joy combina presencia visual, conversación natural e información conectada para ofrecer una atención memorable, coherente con la marca y disponible durante toda la jornada.',
    en: 'Joy combines visual presence, natural conversation and connected information to deliver memorable service that is consistent with your brand and available all day long.',
  },
  pillars: [
    { title: { es: 'Más impacto', en: 'More impact' },
      text: { es: 'Un personaje 3D animado atrae la atención y diferencia el stand, la recepción o el punto de información.', en: 'An animated 3D character draws attention and sets your stand, reception or information point apart.' } },
    { title: { es: 'Más capacidad de atención', en: 'More capacity to serve' },
      text: { es: 'Responde consultas frecuentes sin limitar la disponibilidad del equipo humano.', en: 'Answers frequent questions without tying up your human team.' } },
    { title: { es: 'Más personalización', en: 'More personalisation' },
      text: { es: 'Adapta identidad, voz, idiomas, conocimientos, estética y comportamiento a cada cliente.', en: 'Adapts identity, voice, languages, knowledge, look and behaviour to each client.' } },
    { title: { es: 'Más conexión', en: 'More connection' },
      text: { es: 'Puede consultar datos, buscar información, enfocar elementos de un mapa, mostrar vídeo y registrar oportunidades.', en: 'Can query data, look up information, focus elements on a map, play video and capture leads.' } },
  ],
  tis: {
    title: { es: 'La experiencia TIS como demostrador', en: 'The TIS experience as a showcase' },
    text: {
      es: 'Para el TIS 2026, Joy está configurada como anfitriona de inteligencia artificial: informa sobre agenda, ponentes y stands; orienta en el recinto; recomienda planes en Sevilla; cambia de idioma automáticamente y puede señalar ubicaciones en un mapa interactivo que se proyecta en una pantalla táctil independiente, aparte de la del avatar. Esta implantación demuestra cómo la misma plataforma puede reconfigurarse para otros sectores, marcas, eventos y espacios.',
      en: 'For TIS 2026, Joy is set up as an AI host: she provides information on the agenda, speakers and stands; guides visitors around the venue; recommends things to do in Seville; switches language automatically and can point out locations on an interactive map shown on a separate touchscreen, apart from the avatar\'s own. This deployment shows how the same platform can be reconfigured for other sectors, brands, events and spaces.',
    },
  },
}

export const MODULES = {
  eyebrow: { es: 'Arquitectura modular', en: 'Modular architecture' },
  title: { es: 'Componentes que podemos vender', en: 'Components we can deliver' },
  note: {
    es: 'Los módulos se combinan según el caso de uso. La oferta final debe definir alcance, fuentes de datos, hardware, integraciones y nivel de personalización.',
    en: 'Modules are combined according to the use case. The final offer must define scope, data sources, hardware, integrations and level of customisation.',
  },
  items: [
    { name: { es: 'Núcleo conversacional', en: 'Conversational core' },
      what: { es: 'IA de voz en tiempo real, diálogo contextual, cambio automático de idioma y personalidad configurable.', en: 'Real-time voice AI, contextual dialogue, automatic language switching and configurable personality.' },
      mode: { es: 'Base', en: 'Core' } },
    { name: { es: 'Avatar y animación', en: 'Avatar & animation' },
      what: { es: 'Modelo 3D, lipsync, expresiones, respiración, parpadeo, mirada, gestos y modo holograma.', en: '3D model, lip sync, expressions, breathing, blinking, gaze, gestures and hologram mode.' },
      mode: { es: 'Base / a medida', en: 'Core / custom' } },
    { name: { es: 'Conocimiento privado', en: 'Private knowledge' },
      what: { es: 'Información de producto, agenda, catálogo, espacios, normativa, preguntas frecuentes y contenidos del cliente.', en: 'Product information, agenda, catalogue, venues, regulations, FAQs and client content.' },
      mode: { es: 'Configurable', en: 'Configurable' } },
    { name: { es: 'Visión y presencia', en: 'Vision & presence' },
      what: { es: 'Detección de persona, seguimiento de mirada, saludo automático y descripción visual cuando el caso lo requiere.', en: 'Person detection, gaze tracking, automatic greeting and visual description when the case requires it.' },
      mode: { es: 'Opcional', en: 'Optional' } },
    { name: { es: 'Herramientas conectadas', en: 'Connected tools' },
      what: { es: 'Mapa interactivo, agenda, buscador web, bases de datos, APIs y activación de contenidos externos.', en: 'Interactive map, agenda, web search, databases, APIs and triggering of external content.' },
      mode: { es: 'Opcional', en: 'Optional' } },
    { name: { es: 'Contenido en pantalla', en: 'On-screen content' },
      what: { es: 'Vídeos, planos, llamadas a la acción y paneles asociados a la conversación.', en: 'Videos, floor plans, calls to action and panels tied to the conversation.' },
      mode: { es: 'Opcional', en: 'Optional' } },
    { name: { es: 'Captura de oportunidades', en: 'Lead capture' },
      what: { es: 'Formulario de contacto y envío automatizado de leads al equipo comercial.', en: 'Contact form and automated delivery of leads to the sales team.' },
      mode: { es: 'Opcional', en: 'Optional' } },
    { name: { es: 'Operación y control', en: 'Operation & control' },
      what: { es: 'Reconexión automática, optimización para tótem, telemetría, logs, consumo y monitorización remota.', en: 'Automatic reconnection, kiosk optimisation, telemetry, logs, usage and remote monitoring.' },
      mode: { es: 'Servicio', en: 'Service' } },
  ],
}

export const DEPLOYMENT = {
  eyebrow: { es: 'Despliegue físico', en: 'Physical deployment' },
  title: { es: 'Tótem y pantallas táctiles', en: 'Totem & touchscreens' },
  text: {
    es: 'Para la implantación en sala, el avatar puede alojarse en un tótem negro táctil autoportante o en pantallas táctiles de gran formato. El suministro, la integración y el montaje del hardware corren a cargo de Fluge Audiovisuales Barcelona, si fueran necesarios para el proyecto.',
    en: 'For on-site installation, the avatar can run on a free-standing black touch totem or on large-format touchscreens. Supply, integration and assembly of the hardware are handled by Fluge Audiovisuales Barcelona, if required for the project.',
  },
  chip: { es: 'Hardware y montaje', en: 'Hardware & installation' },
}

export const CAPABILITIES = {
  eyebrow: { es: 'Capacidades', en: 'Capabilities' },
  title: { es: 'Una conversación que también actúa', en: 'A conversation that also acts' },
  items: [
    { title: { es: 'Habla y escucha', en: 'Speaks and listens' },
      text: { es: 'Conversación por voz en tiempo real, detección de turnos, cancelación de eco, supresión de ruido y respuesta natural.', en: 'Real-time voice conversation, turn detection, echo cancellation, noise suppression and natural responses.' } },
    { title: { es: 'Mira y reacciona', en: 'Sees and reacts' },
      text: { es: 'Seguimiento visual, contacto con la mirada y saludos activados por presencia para iniciar la experiencia sin fricción.', en: 'Visual tracking, eye contact and presence-triggered greetings to start the experience with no friction.' } },
    { title: { es: 'Sabe y consulta', en: 'Knows and looks things up' },
      text: { es: 'Base de conocimiento propia más conexión a fuentes vivas cuando la información necesita estar actualizada.', en: 'Its own knowledge base plus a connection to live sources when information needs to be up to date.' } },
    { title: { es: 'Muestra y orienta', en: 'Shows and guides' },
      text: { es: 'Puede abrir contenidos, reproducir vídeo, señalar ubicaciones y acompañar verbalmente lo que sucede en pantalla.', en: 'Can open content, play video, point out locations and verbally accompany what happens on screen.' } },
    { title: { es: 'Recuerda el contexto', en: 'Remembers context' },
      text: { es: 'Mantiene la continuidad de la conversación y evita repetir información dentro de la experiencia.', en: 'Keeps the conversation continuous and avoids repeating information within the experience.' } },
    { title: { es: 'Opera durante el evento', en: 'Runs through the event' },
      text: { es: 'Modo optimizado para equipos integrados, reconexión automática y diagnóstico remoto para reducir incidencias.', en: 'Mode optimised for embedded hardware, automatic reconnection and remote diagnostics to reduce incidents.' } },
  ],
  voiceTitle: { es: 'Opciones de voz y lenguaje', en: 'Voice and language options' },
  voice: [
    { title: { es: 'Voces seleccionables', en: 'Selectable voices' },
      text: { es: 'Diferentes timbres y estilos según personaje, marca y público.', en: 'Different timbres and styles to suit the character, brand and audience.' } },
    { title: { es: 'Multilingüe automático', en: 'Automatic multilingual' },
      text: { es: 'El avatar responde en el idioma utilizado por la persona y puede cambiar durante la conversación.', en: 'The avatar replies in the language the person uses and can switch mid-conversation.' } },
    { title: { es: 'Tono de marca', en: 'Brand tone' },
      text: { es: 'Formal, cercano, técnico, turístico, institucional, comercial o lúdico.', en: 'Formal, friendly, technical, touristic, institutional, commercial or playful.' } },
  ],
}

export const MARKETS = {
  eyebrow: { es: 'Soluciones por mercado', en: 'Solutions by market' },
  title: { es: 'Dónde genera valor', en: 'Where it creates value' },
  items: [
    { title: { es: 'Ferias y congresos', en: 'Trade fairs & conferences' },
      text: { es: 'Bienvenida, agenda, ponentes, localización de stands, activación de marca y cualificación de visitantes.', en: 'Welcome, agenda, speakers, stand finding, brand activation and visitor qualification.' } },
    { title: { es: 'Turismo y destinos', en: 'Tourism & destinations' },
      text: { es: 'Información del destino, rutas personalizadas, recomendaciones, movilidad y atención multilingüe.', en: 'Destination information, personalised routes, recommendations, mobility and multilingual service.' } },
    { title: { es: 'Hoteles y hospitality', en: 'Hotels & hospitality' },
      text: { es: 'Recepción complementaria, servicios, horarios, experiencias locales y orientación del huésped.', en: 'Complementary reception, services, opening hours, local experiences and guest guidance.' } },
    { title: { es: 'Retail y centros comerciales', en: 'Retail & shopping centres' },
      text: { es: 'Catálogo, promociones, ubicación de tiendas, recomendación de producto y campañas interactivas.', en: 'Catalogue, promotions, store locations, product recommendations and interactive campaigns.' } },
    { title: { es: 'Empresas y showrooms', en: 'Companies & showrooms' },
      text: { es: 'Presentación corporativa, portfolio, visitas guiadas, onboarding y demostraciones de producto.', en: 'Corporate presentation, portfolio, guided tours, onboarding and product demos.' } },
    { title: { es: 'Museos y cultura', en: 'Museums & culture' },
      text: { es: 'Mediación cultural, personajes históricos, recorridos adaptados y contenidos en varios idiomas.', en: 'Cultural mediation, historical characters, tailored routes and multilingual content.' } },
    { title: { es: 'Educación y formación', en: 'Education & training' },
      text: { es: 'Tutor conversacional, simulaciones, divulgación y aprendizaje mediante personaje.', en: 'Conversational tutor, simulations, outreach and character-led learning.' } },
    { title: { es: 'Sanidad y servicios públicos', en: 'Healthcare & public services' },
      text: { es: 'Orientación inicial, información de procesos y reducción de consultas repetitivas, con alcance controlado.', en: 'Initial guidance, process information and fewer repetitive enquiries, with a controlled scope.' } },
  ],
}

export const OFFER = {
  eyebrow: { es: 'Oferta', en: 'Offer' },
  title: { es: 'Tres niveles para construir la propuesta', en: 'Three levels to build your proposal' },
  popular: { es: 'Más popular', en: 'Most popular' },
  tiers: [
    { name: 'Essential', tagline: { es: 'Presencia conversacional', en: 'Conversational presence' }, popular: false,
      items: [
        { es: 'Avatar de catálogo', en: 'Catalogue avatar' },
        { es: 'Identidad y conocimiento del cliente', en: 'Client identity and knowledge' },
        { es: 'Voz en tiempo real y multilingüe', en: 'Real-time multilingual voice' },
        { es: 'Lipsync y animación base', en: 'Lip sync and base animation' },
        { es: 'Despliegue web en pantalla o tótem', en: 'Web deployment on screen or totem' },
      ] },
    { name: 'Experience', tagline: { es: 'Interacción avanzada', en: 'Advanced interaction' }, popular: true,
      items: [
        { es: 'Todo Essential', en: 'Everything in Essential' },
        { es: 'Avatar y escena personalizados', en: 'Custom avatar and scene' },
        { es: 'Visión, mirada y saludo automático', en: 'Vision, gaze and automatic greeting' },
        { es: 'Vídeo, planos o contenidos activables', en: 'Video, floor plans or triggerable content' },
        { es: 'Adaptación al entorno y optimización de rendimiento', en: 'Adaptation to the environment and performance tuning' },
      ] },
    { name: 'Connected', tagline: { es: 'Ecosistema integrado', en: 'Integrated ecosystem' }, popular: false,
      items: [
        { es: 'Todo Experience', en: 'Everything in Experience' },
        { es: 'APIs, mapas, agenda o datos en vivo', en: 'APIs, maps, agenda or live data' },
        { es: 'Captura de leads y automatizaciones', en: 'Lead capture and automations' },
        { es: 'Panel de monitorización y telemetría', en: 'Monitoring dashboard and telemetry' },
        { es: 'Soporte operativo y evolución continua', en: 'Operational support and continuous evolution' },
      ] },
  ],
  investment: {
    title: { es: 'Inversión', en: 'Investment' },
    text: {
      es: 'Presupuesto a medida según avatar, duración, integraciones, hardware, idiomas, contenidos, soporte y derechos de uso. Solicita tu propuesta personalizada.',
      en: 'Tailored quote based on avatar, duration, integrations, hardware, languages, content, support and usage rights. Request your personalised proposal.',
    },
  },
  cta: { es: 'Solicitar propuesta', en: 'Request a proposal' },
  credit: {
    es: 'Tecnología desarrollada por IMMERSO LIVE S.L. · Co-producción con Fluge Audiovisuales',
    en: 'Technology developed by IMMERSO LIVE S.L. · Co-produced with Fluge Audiovisuales',
  },
}

// Preguntas frecuentes (F19 auditoría / ficha Avatares del plan AEO).
// Respuestas validadas por Antonio Lo Riso (30/10/2026). No incluir aquí
// capacidades en desarrollo como si estuvieran disponibles.
export const FAQ = {
  eyebrow: { es: 'Antes de contratar', en: 'Before you hire' },
  title: { es: 'Preguntas frecuentes', en: 'Frequently asked questions' },
  items: [
    {
      q: { es: '¿Qué hay que instalar en el evento?', en: 'What needs to be installed at the event?' },
      a: {
        es: 'Un tótem o pantalla, micrófono, altavoces y conexión a red. Algunos de nuestros tótems vienen con todo preinstalado y algunos incluyen cámara.',
        en: 'A totem or screen, a microphone, speakers and a network connection. Some of our totems come with everything pre-installed, and some include a camera.',
      },
    },
    {
      q: { es: '¿Funciona en un recinto ruidoso?', en: 'Does it work in a noisy venue?' },
      a: {
        es: 'Sí. Lo hemos comprobado en ferias y eventos con público, como DES Málaga 2026 y el Tourism Innovation Summit de Sevilla.',
        en: 'Yes. We have tested it at trade fairs and live events, such as DES Málaga 2026 and the Tourism Innovation Summit in Seville.',
      },
    },
    {
      q: { es: '¿Funciona sin conexión a internet?', en: 'Does it work without an internet connection?' },
      a: {
        es: 'No. Necesita una conexión estable. Estamos desarrollando un modo sin conexión.',
        en: 'No. It needs a stable connection. We are developing an offline mode.',
      },
    },
    {
      q: { es: '¿En qué idiomas habla?', en: 'Which languages does it speak?' },
      a: {
        es: 'Muchos. Lo hemos probado con público en español, inglés, portugués, ruso, japonés y azerí, entre otros.',
        en: 'Many. We have tested it with real audiences in Spanish, English, Portuguese, Russian, Japanese and Azerbaijani, among others.',
      },
    },
    {
      q: { es: '¿Se graban las conversaciones?', en: 'Are conversations recorded?' },
      a: {
        es: 'Solo si el proyecto lo requiere: la grabación es opcional y se acuerda con cada cliente.',
        en: 'Only if the project requires it: recording is optional and agreed with each client.',
      },
    },
    {
      q: { es: '¿Para qué se usa la cámara?', en: 'What is the camera used for?' },
      a: {
        es: 'Es opcional. Puede usarse para identificar a la persona o para que el avatar siga con la mirada a quien le habla.',
        en: 'It is optional. It can be used to identify the person or to let the avatar follow the speaker with its gaze.',
      },
    },
  ],
}

// Interacciones medidas en eventos reales (mismas cifras que immerso.live).
export const PROOF = {
  eyebrow: { es: 'En eventos reales', en: 'At real events' },
  title: { es: 'Interacciones con público', en: 'Audience interactions' },
  items: [
    { n: '800+', t: { es: 'conversaciones en DES Málaga 2026, con Viky', en: 'conversations at DES Málaga 2026, with Viky' } },
    { n: '1.200', t: { es: 'interacciones en el Tourism Innovation Summit de Sevilla 2026', en: 'interactions at the Tourism Innovation Summit, Seville 2026' } },
    { n: '600', t: { es: 'de ellas las atendió Joy sola, recibiendo en la puerta', en: 'of them handled by Joy alone, greeting at the door' } },
  ],
}
