// Contenido legal — adaptado de https://girasomnis.com/aviso-legal/ y
// https://girasomnis.com/politica-privacidad/ (misma titularidad que MAIGIA by
// Girasomnis) para su publicación en maigia.tech.

export type LegalBlock =
  | { type: 'p'; es: string; en: string }
  | { type: 'list'; es: string[]; en: string[] }
  | { type: 'table'; rows: { es: string; en: string; value: string }[] }

export type LegalSection = {
  heading: { es: string; en: string }
  blocks: LegalBlock[]
}

export type LegalDoc = {
  title: { es: string; en: string }
  updated: string
  intro?: { es: string; en: string }
  sections: LegalSection[]
}

const IDENTITY_TABLE: LegalBlock = {
  type: 'table',
  rows: [
    { es: 'Nombre / Razón social', en: 'Name / Legal entity', value: 'Francisco Javier Gramaje Calatayud' },
    { es: 'NIF', en: 'Tax ID (NIF)', value: '20162131D' },
    { es: 'Actividad', en: 'Activity', value: 'AV Shows · Video mapping · Events & Performing Arts — MAIGIA by Girasomnis' },
    { es: 'Domicilio', en: 'Address', value: 'Carrer Encarnació 180 A 3, 08025 — Barcelona' },
    { es: 'Email', en: 'Email', value: 'info@girasomnis.com' },
    { es: 'Página web', en: 'Website', value: 'https://maigia.tech' },
  ],
}

export const AVISO_LEGAL: LegalDoc = {
  title: { es: 'Aviso legal', en: 'Legal notice' },
  updated: '2026',
  intro: {
    es: 'En cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico, se exponen a continuación los datos identificativos de la empresa.',
    en: 'In compliance with Article 10 of Spanish Law 34/2002, of 11 July, on Information Society Services and Electronic Commerce, the company\'s identifying details are set out below.',
  },
  sections: [
    { heading: { es: 'Datos identificativos', en: 'Identifying details' }, blocks: [IDENTITY_TABLE] },
    {
      heading: { es: 'Condiciones generales de uso', en: 'General terms of use' },
      blocks: [
        { type: 'p',
          es: 'Este portal web tiene como objeto facilitar al público el conocimiento de las actividades que esta organización realiza y de los productos y servicios que presta.',
          en: 'This website is intended to inform the public about the activities carried out by this organisation and the products and services it provides.' },
        { type: 'p',
          es: 'El uso de cualquiera de las funcionalidades del sitio web implica la expresa y plena aceptación de las condiciones aquí expuestas, sin perjuicio de aquellas particulares que pudieran aplicarse a algunos de los servicios concretos ofrecidos.',
          en: 'Use of any of the website\'s features implies express and full acceptance of the terms set out here, without prejudice to any specific terms that may apply to particular services offered.' },
        { type: 'p',
          es: 'El titular del sitio web se reserva la facultad de efectuar, en cualquier momento y sin necesidad de previo aviso, modificaciones y actualizaciones de la información contenida en la web o en su configuración y presentación.',
          en: 'The website owner reserves the right to make changes and updates to the information contained on the site, or to its configuration and presentation, at any time and without prior notice.' },
      ],
    },
    {
      heading: { es: 'Propiedad intelectual e industrial', en: 'Intellectual and industrial property' },
      blocks: [
        { type: 'p',
          es: 'Todos los elementos que forman el sitio web, así como su estructura, diseño, código fuente, logotipos, marcas y demás signos distintivos, son titularidad de Paco Gramaje Studio o de sus colaboradores y están protegidos por los correspondientes derechos de propiedad intelectual e industrial.',
          en: 'All elements that make up the website, as well as its structure, design, source code, logos, trademarks and other distinctive signs, are owned by Paco Gramaje Studio or its collaborators and are protected by the corresponding intellectual and industrial property rights.' },
        { type: 'p',
          es: 'Queda expresamente prohibida la realización de «framing» o la utilización por parte de terceros de cualesquiera mecanismos que alteren el diseño, la configuración original o los contenidos del sitio web.',
          en: '«Framing», or the use by third parties of any mechanism that alters the design, original configuration or content of the website, is expressly prohibited.' },
        { type: 'p',
          es: 'Se autoriza la reproducción total o parcial de los textos y contenidos del sitio web únicamente si se mantiene su integridad, se cita expresamente al titular como fuente, el uso es compatible con los fines de la web y no tiene carácter comercial.',
          en: 'Full or partial reproduction of the website\'s texts and content is only permitted if their integrity is preserved, the owner is expressly cited as the source, the use is compatible with the purposes of the website, and it is not for commercial purposes.' },
      ],
    },
    {
      heading: { es: 'Responsabilidad', en: 'Liability' },
      blocks: [
        { type: 'p',
          es: 'El titular del sitio web no garantiza la inexistencia de errores en el acceso a la web ni en su contenido, ni que este se encuentre siempre actualizado, aunque desarrollará sus mejores esfuerzos para evitarlos, subsanarlos o actualizarlos.',
          en: 'The website owner does not guarantee that access to the site or its content will be free of errors, or that it will always be up to date, although it will make its best efforts to prevent, correct or update it.' },
        { type: 'p',
          es: 'Tanto el acceso al sitio web como el uso que pueda hacerse de la información contenida en él es de la exclusiva responsabilidad de quien lo realiza.',
          en: 'Both access to the website and any use made of the information it contains are the sole responsibility of the person doing so.' },
      ],
    },
    {
      heading: { es: 'Enlaces a terceros', en: 'Third-party links' },
      blocks: [
        { type: 'p',
          es: 'Los enlaces contenidos en este sitio web pueden dirigir a contenidos de terceros. Dichas páginas no pertenecen al titular del sitio web, que no revisa sus contenidos y no asume responsabilidad alguna por ellos.',
          en: 'The links contained on this website may lead to third-party content. Those pages do not belong to the website owner, who does not review their content and assumes no responsibility for it.' },
      ],
    },
    {
      heading: { es: 'Protección de datos personales', en: 'Personal data protection' },
      blocks: [
        { type: 'p',
          es: 'Para aquellos casos en los que se recaben, traten o almacenen datos personales, se hará en conformidad con la Política de Privacidad publicada en este sitio web.',
          en: 'Where personal data is collected, processed or stored, this will be done in accordance with the Privacy Policy published on this website.' },
      ],
    },
    {
      heading: { es: 'Ley aplicable y jurisdicción', en: 'Applicable law and jurisdiction' },
      blocks: [
        { type: 'p',
          es: 'La ley aplicable en caso de disputa o conflicto de interpretación de los términos que conforman este Aviso Legal, así como cualquier cuestión relacionada con los servicios de este portal, será la ley española.',
          en: 'The applicable law in the event of a dispute or conflict regarding the interpretation of the terms of this Legal Notice, as well as any matter related to the services of this site, shall be Spanish law.' },
      ],
    },
  ],
}

export const PRIVACIDAD: LegalDoc = {
  title: { es: 'Política de privacidad', en: 'Privacy policy' },
  updated: '2026',
  intro: {
    es: 'En cumplimiento del Reglamento (UE) 2016/679 (Reglamento General de Protección de Datos) y de la Ley Orgánica 3/2018, de 5 de diciembre, de Protección de Datos y garantía de derechos digitales, le ofrecemos la siguiente información sobre el tratamiento de sus datos personales.',
    en: 'In compliance with Regulation (EU) 2016/679 (General Data Protection Regulation) and Spanish Organic Law 3/2018, of 5 December, on Data Protection and the guarantee of digital rights, we provide the following information on the processing of your personal data.',
  },
  sections: [
    {
      heading: { es: 'Responsable del tratamiento', en: 'Data controller' },
      blocks: [
        { type: 'p',
          es: 'Sus datos serán tratados por Francisco Javier Gramaje Calatayud, con NIF 20162131D y domicilio en Carrer Encarnació 180 A 3, 08025 — Barcelona, email: info@girasomnis.com.',
          en: 'Your data will be processed by Francisco Javier Gramaje Calatayud, Tax ID (NIF) 20162131D, address at Carrer Encarnació 180 A 3, 08025 — Barcelona, email: info@girasomnis.com.' },
      ],
    },
    {
      heading: { es: 'Finalidad del tratamiento y legitimación', en: 'Purpose of processing and legal basis' },
      blocks: [
        { type: 'p', es: 'Solamente utilizaremos sus datos para finalidades legítimas, tales como:', en: 'We will only use your data for legitimate purposes, such as:' },
        { type: 'list',
          es: [
            'Cumplir nuestra relación contractual y/o comercial.',
            'Cumplir obligaciones legales (Agencia Tributaria, acciones judiciales, etc.).',
            'Enviar comunicaciones informativas sobre incidencias o brechas de seguridad.',
            'Cualquier otra finalidad previa y expresamente autorizada por usted, como el envío de ofertas y promociones comerciales.',
          ],
          en: [
            'Fulfilling our contractual and/or commercial relationship.',
            'Complying with legal obligations (tax authorities, judicial actions, etc.).',
            'Sending informational communications about security incidents or breaches.',
            'Any other purpose you have previously and expressly authorised, such as sending commercial offers and promotions.',
          ] },
      ],
    },
    {
      heading: { es: '¿A quién facilitamos sus datos?', en: 'Who do we share your data with?' },
      blocks: [
        { type: 'p',
          es: 'Sus datos podrán ser cedidos o comunicados a aquellas entidades o administraciones estrictamente necesarias para prestarle los servicios contratados, para cumplir una obligación legal, o a aquellas que usted nos haya autorizado expresamente.',
          en: 'Your data may be shared or communicated to entities or authorities strictly necessary to provide the contracted services, to comply with a legal obligation, or to those you have expressly authorised.' },
      ],
    },
    {
      heading: { es: 'Plazo de conservación', en: 'Data retention period' },
      blocks: [
        { type: 'p',
          es: 'Sus datos serán conservados mientras dure nuestra relación contractual y/o comercial, el tiempo necesario para cumplir las obligaciones legales, y el plazo de prescripción de las acciones judiciales pertinentes. Procederemos a borrarlos cuando nos solicite su supresión en los términos previstos por la ley.',
          en: 'Your data will be kept for as long as our contractual and/or commercial relationship lasts, for the time necessary to comply with legal obligations, and for the statute-of-limitations period of any relevant legal actions. We will delete it upon your request for erasure, as provided by law.' },
      ],
    },
    {
      heading: { es: 'Sus derechos', en: 'Your rights' },
      blocks: [
        { type: 'p',
          es: 'Podrá ejercitar cualquiera de los siguientes derechos enviándonos una solicitud por escrito junto a una fotocopia de su DNI/pasaporte, por email a info@girasomnis.com:',
          en: 'You may exercise any of the following rights by sending us a written request, together with a copy of your ID/passport, by email to info@girasomnis.com:' },
        { type: 'list',
          es: [
            'Información: saber si tratamos sus datos personales.',
            'Acceso: conocer qué datos personales hemos incluido en nuestros ficheros y para qué finalidad.',
            'Rectificación: modificar sus datos cuando sean inexactos o incompletos.',
            'Supresión: solicitar la eliminación de sus datos cuando ya no sean necesarios.',
            'Oposición: solicitar que no se traten sus datos personales.',
            'Limitación: solicitar la limitación del tratamiento en los supuestos previstos por la ley.',
            'Portabilidad: recibir sus datos en un formato estructurado, de uso común y lectura mecánica.',
          ],
          en: [
            'Information: to know whether we process your personal data.',
            'Access: to know which personal data we hold about you and for what purpose.',
            'Rectification: to correct your data when it is inaccurate or incomplete.',
            'Erasure: to request deletion of your data when it is no longer necessary.',
            'Objection: to request that your personal data not be processed.',
            'Restriction: to request restriction of processing in the cases provided by law.',
            'Portability: to receive your data in a structured, commonly used, machine-readable format.',
          ] },
      ],
    },
    {
      heading: { es: 'Menores de edad', en: 'Minors' },
      blocks: [
        { type: 'p',
          es: 'En el caso de personas menores de 14 años, deberá otorgar el consentimiento para el tratamiento de los datos personales el padre, la madre o el tutor legal.',
          en: 'In the case of persons under 14 years of age, consent for the processing of personal data must be given by the parent or legal guardian.' },
      ],
    },
    {
      heading: { es: 'Medidas de seguridad', en: 'Security measures' },
      blocks: [
        { type: 'p',
          es: 'De conformidad con la legislación vigente, nos obligamos a implementar las medidas técnicas y organizativas necesarias en cada momento para garantizar la seguridad de sus datos y evitar su alteración, pérdida o tratamiento no autorizado.',
          en: 'In accordance with current legislation, we undertake to implement the technical and organisational measures necessary at all times to guarantee the security of your data and prevent its alteration, loss or unauthorised processing.' },
      ],
    },
  ],
}

export const COOKIES: LegalDoc = {
  title: { es: 'Política de cookies', en: 'Cookie policy' },
  updated: '2026',
  intro: {
    es: 'Esta página explica qué es una cookie, qué tipo de almacenamiento utiliza maigia.tech y cómo puede gestionarlo.',
    en: 'This page explains what a cookie is, what kind of storage maigia.tech uses, and how you can manage it.',
  },
  sections: [
    {
      heading: { es: '¿Qué son las cookies?', en: 'What are cookies?' },
      blocks: [
        { type: 'p',
          es: 'Las cookies son pequeños archivos que un sitio web puede enviar a su navegador y que quedan almacenados en su dispositivo. No nos proporcionan información sobre su nombre ni sobre otros datos de carácter personal, y no pueden leer archivos ni cookies de otros sitios.',
          en: 'Cookies are small files that a website can send to your browser, which are then stored on your device. They do not give us information about your name or other personal data, and they cannot read files or cookies from other sites.' },
      ],
    },
    {
      heading: { es: 'Qué usa maigia.tech', en: 'What maigia.tech uses' },
      blocks: [
        { type: 'p',
          es: 'Esta web no utiliza cookies de publicidad ni de seguimiento de terceros. Guarda una única preferencia técnica en el almacenamiento local de su navegador (localStorage), no en una cookie: el idioma que ha elegido (español o inglés), para que se mantenga al navegar entre páginas. Este dato no sale de su dispositivo ni se comparte con nadie.',
          en: 'This website does not use advertising or third-party tracking cookies. It stores a single technical preference in your browser\'s local storage (localStorage), not a cookie: the language you chose (Spanish or English), so it stays the same as you move between pages. This information never leaves your device and is not shared with anyone.' },
        { type: 'p',
          es: 'Como en cualquier sitio web, nuestro servidor de alojamiento registra automáticamente datos técnicos de conexión (como la dirección IP y la hora de la visita) necesarios para poder atender su petición y servirle la página.',
          en: 'As with any website, our hosting server automatically logs technical connection data (such as IP address and time of visit) needed to handle your request and serve you the page.' },
      ],
    },
    {
      heading: { es: 'Cómo gestionarlas', en: 'How to manage them' },
      blocks: [
        { type: 'p',
          es: 'Puede configurar su navegador para que le avise antes de aceptar cookies, o para rechazarlas directamente, desde su panel de ajustes de privacidad. Al no usar cookies de seguimiento, bloquearlas no afecta al funcionamiento de esta web; borrar el almacenamiento local del navegador solo restablecerá su preferencia de idioma a español.',
          en: 'You can set your browser to warn you before accepting cookies, or to reject them outright, from its privacy settings panel. Since this site does not use tracking cookies, blocking them does not affect how it works; clearing your browser\'s local storage will simply reset your language preference back to Spanish.' },
      ],
    },
  ],
}
