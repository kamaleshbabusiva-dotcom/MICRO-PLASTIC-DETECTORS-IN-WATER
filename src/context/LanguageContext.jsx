import { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext({})

export const useLanguage = () => useContext(LanguageContext)

export const languages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'hi', name: 'हिन्दी', flag: '🇮🇳' },
    { code: 'zh', name: '中文', flag: '🇨🇳' },
    { code: 'ar', name: 'العربية', flag: '🇸🇦' },
    { code: 'ta', name: 'தமிழ்', flag: '🇮🇳' },
]

const translations = {
    en: {
        login: 'Login',
        try_demo: 'Try Demo',
        continue_google: 'Continue with Google',
        hero_title_1: 'Detecting the Invisible,',
        hero_title_2: 'Protecting Our Water',
        hero_desc: 'Combat microplastic pollution with AI-powered detection. Monitor water purity, file complaints, and join the global movement for cleaner oceans and rivers.',
        rev_wellness: 'Revolutionizing Water Purity Analysis',
        connecting: 'Connecting...',
        setup_info: 'Real-time analysis • IoT Integrated • Enterprise ready',
        features: {
            title1: 'Smart Water Analysis',
            desc1: 'AI-powered detection of microplastics and contaminants in real-time',
            title2: 'Global Purity Rankings',
            desc2: 'Track and compare water quality standards across regions and rivers',
            title3: 'Pollution Community',
            desc3: 'Connect with environmentalists and share local water quality findings',
            title4: 'Complaint Dashboard',
            desc4: 'Report water quality issues directly to local authorities and tracking agencies',
            title5: 'Purity Waveforms',
            desc5: 'Analyze water vibration patterns and acoustic purity signatures',
            title6: 'Advanced Analytics',
            desc6: 'Deep dive into microplastic density trends and chemical compositions',
        },
        stats: {
            users: 'Active Detectors',
            steps: 'Pollution Reduction',
            active: 'Water Safety Rate',
            sick: 'Fewer Contamination Incidents',
        },
        profile: {
            title: 'Water Security Profile',
            age: 'Certification Level',
            streak: 'day monitoring streak',
            achievements: 'certificates earned',
            today: 'Today',
            week: 'Week',
            month: 'Month',
            goals: 'Daily Water Parameters',
            daily_goal: 'pH Testing Samples',
            weekly_goal: 'Turbidity Reports',
            monthly_goal: 'Chemical Analysis',
            calc_based: 'Targets based on:',
            safety: 'Action Protocols',
            emergency: 'Crisis Contact (Pollution Control)',
            gps: 'Sensor Location:',
            gps_active: 'Active',
            locations: 'monitored sites saved',
            gallery: 'Certification Gallery',
            history: '30-Day Purity History',
            lang_settings: 'Language Settings',
            lang_desc: 'Select your preferred language',
            level: 'Rank',
            profession: 'Specialty',
            health: 'Purity Score'
        },
        chatbot: {
            header: 'AQUA AI',
            online: 'Online',
            placeholder: 'Inquire about water or health...',
            welcome: "Hello! I'm your AquaPure assistant. How can I help you analyze water or stay healthy today?",
            need_help: 'Need assistance?',
            drag_me: 'Position me!',
            responses: {
                hi: "Hello! Ready to conduct some water quality tests or discuss health tips?",
                workout: "You can view your sampling protocols in the Protocols tab.",
                music: "The Acoustic Analytics tool helps you analyze spectral signatures of water.",
                stats: "Historical purity data is available in the Purity Trends page.",
                leaderboard: "Check the Global Rankings to see how your region's water compares.",
                health: "For health safety: Do not drink water without proper filtration. Use a high-quality filter to remove microplastics and prefer boiled water. Avoid plastic containers; use steel or glass bottles instead. Check the 'AI Scanner' for personal purity reports.",
                water: "To protect our resources: Report contaminated sources to local authorities immediately. Avoid washing plastic items in water bodies. Use eco-friendly products and participate in community clean-ups. Use 'Incident Reports' to log issues.",
                microplastics: "Microplastics are tiny plastic particles under 5mm. Our AI helps detect them using infrared spectroscopy. Always use proper filtration to remove these harmful contaminants.",
                default: "I can help you with microplastic detection, water reporting, health tips, and purity analysis. Ask me anything!"
            }
        }
    },
    es: {
        login: 'Iniciar sesión',
        try_demo: 'Probar Demo',
        continue_google: 'Continuar con Google',
        hero_title_1: 'Detectando lo Invisible,',
        hero_title_2: 'Protegiendo Nuestra Agua',
        hero_desc: 'Combate la contaminación por microplásticos con detección impulsada por IA. Monitorea la pureza del agua, presenta quejas y únete al movimiento global por océanos y ríos más limpios.',
        rev_wellness: 'Revolucionando el análisis de pureza del agua',
        connecting: 'Conectando...',
        setup_info: 'Análisis en tiempo real • IoT integrado • Listo para empresas',
        features: {
            title1: 'Análisis de Agua Inteligente',
            desc1: 'Detección de microplásticos y contaminantes impulsada por IA en tiempo real',
            title2: 'Clasificaciones Globales de Pureza',
            desc2: 'Rastrea y compara los estándares de calidad del agua en regiones y ríos',
            title3: 'Comunidad de Contaminación',
            desc3: 'Conéctate con ambientalistas y comparte hallazgos locales sobre la calidad del agua',
            title4: 'Panel de Quejas',
            desc4: 'Reporta problemas de calidad del agua directamente a las autoridades locales',
            title5: 'Formas de Onda de Pureza',
            desc5: 'Analiza patrones de vibración del agua y firmas acústicas de pureza',
            title6: 'Análisis Avanzado',
            desc6: 'Profundiza en las tendencias de densidad de microplásticos y composiciones químicas',
        },
        stats: {
            users: 'Detectores Activos',
            steps: 'Reducción de Contaminación',
            active: 'Tasa de Seguridad del Agua',
            sick: 'Menos Incidentes de Contaminación',
        },
        profile: {
            title: 'Perfil de Seguridad del Agua',
            age: 'Nivel de Certificación',
            streak: 'días de racha de monitoreo',
            achievements: 'certificados obtenidos',
            today: 'Hoy',
            week: 'Semana',
            month: 'Mes',
            goals: 'Parámetros Diarios del Agua',
            daily_goal: 'Muestras de Prueba de pH',
            weekly_goal: 'Informes de Turbidez',
            monthly_goal: 'Análisis Químico',
            calc_based: 'Objetivos basados en:',
            safety: 'Protocolos de Acción',
            emergency: 'Contacto de Crisis (Control de Contaminación)',
            gps: 'Ubicación del Sensor:',
            gps_active: 'Activo',
            locations: 'sitios monitoreados guardados',
            gallery: 'Galería de Certificaciones',
            history: 'Historial de Pureza de 30 Días',
            lang_settings: 'Ajustes de Idioma',
            lang_desc: 'Selecciona tu idioma preferido',
            level: 'Rango',
            profession: 'Especialidad',
            health: 'Puntaje de Pureza'
        },
        chatbot: {
            header: 'AQUA AI',
            online: 'En línea',
            placeholder: 'Pregunta sobre el agua o la salud...',
            welcome: "¡Hola! Soy tu asistente AquaPure. ¿Cómo puedo ayudarte a analizar el agua o mantenerte saludable hoy?",
            need_help: '¿Necesitas ayuda?',
            drag_me: '¡Posicióname!',
            responses: {
                hi: "¡Hola! ¿Listo para realizar algunas pruebas de calidad del agua o discutir consejos de salud?",
                workout: "Puedes ver tus protocolos de muestreo en la pestaña de Protocolos.",
                music: "La herramienta de Análisis Acústico te ayuda a analizar las firmas espectrales del agua.",
                stats: "Los datos históricos de pureza están disponibles en la página de Tendencias de Pureza.",
                leaderboard: "Consulta las Clasificaciones Globales para ver cómo se compara el agua de tu región.",
                health: "Para seguridad sanitaria: No bebas agua sin la filtración adecuada. Usa un filtro de alta calidad para eliminar microplásticos y prefiere agua hervida. Evita envases de plástico; usa botellas de acero o vidrio. Consulta el 'Escáner IA' para informes de pureza personales.",
                water: "Para proteger nuestros recursos: Informa inmediatamente a las autoridades locales sobre fuentes contaminadas. Evita lavar artículos de plástico en cuerpos de agua. Usa productos ecológicos y participa en limpiezas comunitarias.",
                microplastics: "Los microplásticos son pequeñas partículas de plástico de menos de 5 mm. Nuestra IA ayuda a detectarlos mediante espectroscopia infrarroja. Siempre usa una filtración adecuada para eliminar estos contaminantes dañinos.",
                default: "Puedo ayudarte con la detección de microplásticos, informes de agua, consejos de salud y análisis de pureza. ¡Pregúntame cualquier cosa!"
            }
        }
    },
    hi: {
        login: 'लॉगिन',
        try_demo: 'डेमो आज़माएं',
        continue_google: 'Google के साथ आगे बढ़ें',
        hero_title_1: 'शुद्ध जल,',
        hero_title_2: 'स्वस्थ जीवन',
        hero_desc: 'माइक्रोप्लास्टिक का पता लगाएं और जल सुरक्षा सुनिश्चित करें। वास्तविक समय में डेटा साझा करें, क्षेत्रीय शुद्धता रिपोर्ट देखें और अपने समुदाय को सुरक्षित बनाने में मदद करें।',
        rev_wellness: 'जल शुद्धता की क्रांतिकारी पहल',
        connecting: 'जुड़ रहा है...',
        setup_info: '30-सेकंड सेटअप • कोई शुल्क नहीं • पर्यावरण केंद्रित',
        features: {
            title1: 'स्मार्ट प्लास्टिक डिटेक्शन',
            desc1: 'उन्नत सेंसर और एआई का उपयोग करके सूक्ष्म कणों का पता लगाएं',
            title2: 'क्षेत्रीय शुद्धता रैंकिंग',
            desc2: 'देखें कि आपका क्षेत्र जल शुद्धता के वैश्विक मानदंडों में कहां है',
            title3: 'सामुदायिक हब',
            desc3: 'अन्य निरीक्षकों के साथ डेटा साझा करें और चर्चा करें',
            title4: 'आपातकालीन अलर्ट',
            desc4: 'प्रदूषण की स्थिति में तुरंत आधिकारिक सहायता और सूचना',
            title5: 'स्पेक्ट्रल विश्लेषण',
            desc5: 'पानी के अणुओं का डिजिटल फिंगरप्रिंट और संदूषण विश्लेषण',
            title6: 'विस्तृत रिपोर्ट',
            desc6: 'क्षेत्र-विशिष्ट रासायनिक और भौतिक जल डेटा',
        },
        stats: {
            users: 'सक्रिय डिटेक्टर',
            steps: 'प्रदूषण में कमी',
            active: 'जल सुरक्षा दर',
            sick: 'कम संदूषण घटनाएँ',
        },
        profile: {
            title: 'जल सुरक्षा प्रोफ़ाइल',
            age: 'प्रमाणन स्तर',
            streak: 'दिनों की निगरानी निरंतरता',
            achievements: 'अर्जित प्रमाण पत्र',
            today: 'आज',
            week: 'सप्ताह',
            month: 'महीना',
            goals: 'दैनिक जल मापदंड',
            daily_goal: 'pH परीक्षण नमूने',
            weekly_goal: 'टर्बिडिटी रिपोर्ट',
            monthly_goal: 'रासायनिक विश्लेषण',
            calc_based: 'लक्ष्य इनके आधार पर हैं:',
            safety: 'सुरक्षा प्रोटोकॉल',
            emergency: 'आपातकालीन संपर्क',
            gps: 'सेंसर स्थान:',
            gps_active: 'सक्रिय',
            locations: 'निगरानी स्थल सहेजे गए',
            gallery: 'प्रमाणन गैलरी',
            history: '30-दिन का शुद्धता इतिहास',
            lang_settings: 'भाषा सेटिंग',
            lang_desc: 'अपनी पसंदीदा भाषा चुनें',
            level: 'स्तर',
            profession: 'विशेषज्ञता',
            health: 'शुद्धता स्कोर'
        },
        chatbot: {
            header: 'एक्वा AI',
            online: 'ऑनलाइन',
            placeholder: 'पानी या स्वास्थ्य के बारे में पूछें...',
            welcome: "नमस्ते! मैं आपका एक्वाप्योर सहायक हूँ। मैं आज पानी के विश्लेषण या स्वस्थ रहने में आपकी कैसे मदद कर सकता हूँ?",
            need_help: 'मदद चाहिए?',
            drag_me: 'मुझे खींचें!',
            responses: {
                hi: "नमस्ते! जल गुणवत्ता परीक्षण करने या स्वास्थ्य युक्तियों पर चर्चा करने के लिए तैयार हैं?",
                workout: "आप प्रोटोकॉल टैब में अपने नमूना प्रोटोकॉल देख सकते हैं।",
                music: "ध्वनिक विश्लेषण टूल पानी के स्पेक्ट्रल हस्ताक्षरों का विश्लेषण करने में मदद करता है।",
                stats: "ऐतिहासिक शुद्धता डेटा शुद्धता रुझान (Purity Trends) पेज में उपलब्ध है।",
                leaderboard: "ग्लोबल रैंकिंग देखें कि आपके क्षेत्र का पानी दूसरों की तुलना में कैसा है।",
                water: "जल सुरक्षा के लिए: दूषित जल स्रोतों की सूचना तुरंत स्थानीय अधिकारियों को दें। जलाशयों में प्लास्टिक की वस्तुएं न धोएं। पर्यावरण के अनुकूल उत्पादों का उपयोग करें और सामुदायिक स्वच्छता अभियानों में भाग लें। रिपोर्ट के लिए 'Incident Reports' टैब का उपयोग करें।",
                health: "स्वास्थ्य सुरक्षा के लिए: उचित निस्पंदन (filtration) के बिना पानी न पिएं। माइक्रोप्लास्टिक हटाने के लिए उच्च गुणवत्ता वाले फिल्टर का उपयोग करें और उबला हुआ पानी पसंद करें। प्लास्टिक की बोतलों के बजाय स्टील या कांच का उपयोग करें।",
                microplastics: "माइक्रोप्लास्टिक 5 मिमी से कम के छोटे प्लास्टिक कण हैं। हमारा AI स्पेक्ट्रोस्कोपी का उपयोग करके उनका पता लगाता है। इनसे बचने के लिए हमेशा फ़िल्टर किए हुए पानी का उपयोग करें।",
                default: "मैं माइक्रोप्लास्टिक डिटेक्शन, रिपोर्टिंग और स्वास्थ्य युक्तियों में आपकी मदद कर सकता हूँ। कुछ भी पूछें!"
            }
        }
    },
    fr: {
        login: 'Se connecter',
        try_demo: 'Essayer la démo',
        continue_google: 'Continuer avec Google',
        hero_title_1: 'Détecter l\'Invisible,',
        hero_title_2: 'Protéger Notre Eau',
        hero_desc: 'Luttez contre la pollution aux microplastiques grâce à la détection par IA. Surveillez la pureté de l\'eau, déposez des plaintes et rejoignez le mouvement mondial pour des océans et des rivières plus propres.',
        rev_wellness: 'Révolutionner l\'analyse de la pureté de l\'eau',
        connecting: 'Connexion...',
        setup_info: 'Analyse en temps réel • Intégré IoT • Prêt pour l\'entreprise',
        features: {
            title1: 'Analyse de l\'Eau Intelligente',
            desc1: 'Détection des microplastiques et des contaminants par IA en temps réel',
            title2: 'Classements Mondiaux de Pureté',
            desc2: 'Suivez et comparez les normes de qualité de l\'eau dans les régions et les rivières',
            title3: 'Communauté Pollution',
            desc3: 'Connectez-vous avec des écologistes et partagez vos découvertes locales sur la qualité de l\'eau',
            title4: 'Tableau de Bord des Plaintes',
            desc4: 'Signalez les problèmes de qualité de l\'eau directement aux autorités locales',
            title5: 'Formes d\'Onde de Pureté',
            desc5: 'Analysez les modèles de vibration de l\'eau et les signatures acoustiques de pureté',
            title6: 'Analyses Avancées',
            desc6: 'Plongez dans les tendances de densité de microplastiques et les compositions chimiques',
        },
        stats: {
            users: 'Détecteurs Actifs',
            steps: 'Réduction de la Pollution',
            active: 'Taux de Sécurité de l\'Eau',
            sick: 'Moins d\'Incidents de Contamination',
        },
        profile: {
            title: 'Profil de Sécurité de l\'Eau',
            age: 'Niveau de Certification',
            streak: 'jours de suivi consécutifs',
            achievements: 'certificats obtenus',
            today: 'Aujourd\'hui',
            week: 'Semaine',
            month: 'Mois',
            goals: 'Paramètres Quotidiens de l\'Eau',
            daily_goal: 'Échantillons de Test pH',
            weekly_goal: 'Rapports de Turbidité',
            monthly_goal: 'Analyse Chimique',
            calc_based: 'Objectifs basés sur:',
            safety: 'Protocoles d\'Action',
            emergency: 'Contact de Crise (Contrôle de la Pollution)',
            gps: 'Emplacement du Capteur:',
            gps_active: 'Actif',
            locations: 'sites surveillés enregistrés',
            gallery: 'Galerie de Certifications',
            history: 'Historique de Pureté sur 30 Jours',
            lang_settings: 'Paramètres de Langue',
            lang_desc: 'Sélectionnez votre langue préférée',
            level: 'Rang',
            profession: 'Spécialité',
            health: 'Score de Pureté'
        },
        chatbot: {
            header: 'AQUA AI',
            online: 'En ligne',
            placeholder: 'S\'informer sur l\'eau ou la santé...',
            welcome: "Bonjour ! Je suis votre assistant AquaPure. Comment puis-je vous aider à analyser l'eau ou à rester en bonne santé aujourd'hui ?",
            need_help: 'Besoin d\'aide ?',
            drag_me: 'Positionnez-moi !',
            responses: {
                hi: "Bonjour ! Prêt à effectuer des tests de qualité de l'eau ou à discuter de conseils santé ?",
                workout: "Vous pouvez consulter vos protocoles d'échantillonnage dans l'onglet Protocoles.",
                music: "L'outil d'Analyse Acoustique vous aide à analyser les signatures spectrales de l'eau.",
                stats: "Les données historiques de pureté sont disponibles sur la page Tendances de Pureté.",
                leaderboard: "Consultez le Classement Mondial pour voir comment l'eau de votre région se compare.",
                health: "Pour la sécurité sanitaire : Ne buvez pas d'eau sans une filtration appropriée. Utilisez un filtre de haute qualité pour éliminer les microplastiques et préférez l'eau bouillie. Évitez les contenants en plastique ; utilisez des bouteilles en acier ou en verre.",
                water: "Pour protéger nos ressources : Signalez immédiatement les sources contaminées aux autorités locales. Évitez de laver des articles en plastique dans les cours d'eau.",
                microplastics: "Les microplastiques sont de minuscules particules de plastique de moins de 5 mm. Notre IA aide à les détecter par spectroscopie infrarouge. Utilisez toujours une filtration appropriée.",
                default: "Je peux vous aider pour la détection des microplastiques, les rapports sur l'eau, les conseils santé et l'analyse de pureté. Posez-moi vos questions !"
            }
        }
    },
    ta: {
        login: 'உள்நுழை',
        try_demo: 'டெமோ முயற்சிக்கவும்',
        continue_google: 'கூகுள் மூலம் தொடரவும்',
        hero_title_1: 'கண்ணுக்குத் தெரியாததை கண்டறியவும்,',
        hero_title_2: 'நம் நீரைப் பாதுகாக்கவும்',
        hero_desc: 'AI மூலம் மைக்ரோபிளாஸ்டிக் மாசுபாட்டை ஒழிக்கவும். நீரின் தூய்மையை கண்காணிக்கவும், புகார்களை பதிவு செய்யவும் மற்றும் சுத்தமான நீர்நிலைக்கான உலகளாவிய இயக்கத்தில் இணையுங்கள்.',
        rev_wellness: 'நீர் தூய்மை பகுப்பாய்வில் புரட்சி',
        connecting: 'இணைக்கிறது...',
        setup_info: 'நிகழ்நேர பகுப்பாய்வு • IoT ஒருங்கிணைப்பு • நிறுவன தயார் நிலை',
        features: {
            title1: 'ஸ்மார்ட் நீர் பகுப்பாய்வு',
            desc1: 'AI மூலம் நிகழ்நேரத்தில் மைக்ரோபிளாஸ்டிக் மற்றும் மாசுபாடுகளை கண்டறிதல்',
            title2: 'உலகளாவிய தூய்மை தரவரிசை',
            desc2: 'பகுதிகள் மற்றும் ஆறுகளின் நீர் தரத்தை ஒப்பிட்டுப் பாருங்கள்',
            title3: 'மாசுபாட்டு சமூகம்',
            desc3: 'சுற்றுச்சூழல் ஆர்வலர்களுடன் இணைந்து நீர் தர கண்டுபிடிப்புகளை பகிர்ந்து கொள்ளுங்கள்',
            title4: 'புகார் டேஷ்போர்டு',
            desc4: 'நீர் தர பிரச்சனைகளை நேரடியாக உள்ளூர் அதிகாரிகளிடம் புகார் செய்யுங்கள்',
            title5: 'தூய்மை அலைவரிசைகள்',
            desc5: 'நீரின் அதிர்வு வடிவங்கள் மற்றும் ஒலியியல் தூய்மை குறிகளை பகுப்பாய்வு செய்யவும்',
            title6: 'மேம்பட்ட பகுப்பாய்வு',
            desc6: 'மைக்ரோபிளாஸ்டிக் அடர்த்தி மற்றும் வேதியியல் கலவைகளை ஆழமாக ஆராயுங்கள்',
        },
        stats: {
            users: 'செயலில் உள்ள கண்டுபிடிப்பாளர்கள்',
            steps: 'மாசு குறைப்பு',
            active: 'நீர் பாதுகாப்பு விகிதம்',
            sick: 'குறைவான மாசு நிகழ்வுகள்',
        },
        profile: {
            title: 'நீர் பாதுகாப்பு சுயவிவரம்',
            age: 'சான்றிதழ் நிலை',
            streak: 'நாள் கண்காணிப்பு தொடர்ச்சி',
            achievements: 'பெற்ற சான்றிதழ்கள்',
            today: 'இன்று',
            week: 'வாரம்',
            month: 'மாதம்',
            goals: 'தினசரி நீர் அளவீடுகள்',
            daily_goal: 'pH சோதனை மாதிரிகள்',
            weekly_goal: 'நீர் கலங்கல் அறிக்கைகள்',
            monthly_goal: 'வேதியியல் பகுப்பாய்வு',
            calc_based: 'இலக்குகள் இதன் அடிப்படையில்:',
            safety: 'பாதுகாப்பு நெறிமுறைகள்',
            emergency: 'அவசர தொடர்பு (மாசு கட்டுப்பாடு)',
            gps: 'சென்சார் இருப்பிடம்:',
            gps_active: 'செயலில்',
            locations: 'கண்காணிக்கப்படும் இடங்கள்',
            gallery: 'சான்றிதழ் தொகுப்பு',
            history: '30-நாள் தூய்மை வரலாறு',
            lang_settings: 'மொழி அமைப்புகள்',
            lang_desc: 'விருப்பமான மொழியைத் தேர்ந்தெடுக்கவும்',
            level: 'நிலை',
            profession: 'தொழில்',
            health: 'தூய்மை மதிப்பெண்'
        },
        chatbot: {
            header: 'அக்வா AI',
            online: 'ஆன்லைனில்',
            placeholder: 'நீர் அல்லது ஆரோக்கியம் பற்றி கேட்கவும்...',
            welcome: "வணக்கம்! நான் உங்கள் அக்வாபியூர் உதவியாளர். இன்று நீர் பகுப்பாய்வில் நான் உங்களுக்கு எப்படி உதவ முடியும்?",
            need_help: 'உதவி தேவையா?',
            drag_me: 'என்னை இழுக்கவும்!',
            responses: {
                hi: "வணக்கம்! நீர் தர சோதனைகளை நடத்த அல்லது ஆரோக்கிய குறிப்பினைப் பற்றி பேச தயாரா?",
                workout: "உங்கள் மாதிரி நெறிமுறைகளை நெறிமுறை தாவலில் பார்க்கலாம்.",
                music: "ஒலி பகுப்பாய்வு கருவி நீரின் அதிர்வு சமிக்ஞைகளை பகுப்பாய்வு செய்ய உதவுகிறது.",
                stats: "தூய்மை வரலாறு புள்ளிவிவர பக்கத்தில் உள்ளது.",
                leaderboard: "உலகளாவிய தரவரிசையில் உங்கள் பகுதி நீரை ஒப்பிட்டுப் பாருங்கள்.",
                water: "நீர் ஆதாரங்களைப் பாதுகாக்க: மாசுபட்ட நீர் ஆதாரங்கள் குறித்து உடனடியாக அதிகாரிகளுக்குத் தெரிவிக்கவும். நீர்நிலைகளில் பிளாஸ்டிக் பொருட்களைக் கழுவுவதைத் தவிர்க்கவும். 'புகார்' தாவலைப் பயன்படுத்தவும்.",
                health: "முறையான வடிகட்டுதல் இல்லாமல் தண்ணீரைக் குடிக்க வேண்டாம். மைக்ரோபிளாஸ்டிக்கை அகற்ற உயர்தர வடிப்பான்களைப் பயன்படுத்தவும். பிளாஸ்டிக் பாட்டில்களுக்குப் பதிலாக எஃகு அல்லது கண்ணாடி பாட்டில்களைப் பயன்படுத்தவும்.",
                microplastics: "மைக்ரோபிளாஸ்டிக் என்பது 5மிமீ க்கும் குறைவான சிறிய பிளாஸ்டிக் துகள்கள். எப்போதும் பாதுகாப்பான மற்றும் வடிகட்டப்பட்ட நீரையே பயன்படுத்தவும்.",
                default: "மைக்ரோபிளாஸ்டிக் கண்டறிதல், நீர் தரம் மற்றும் ஆரோக்கிய குறிப்புகள் பற்றி நான் உங்களுக்கு உதவ முடியும். எது வேண்டுமானாலும் கேளுங்கள்!"
            }
        }
    }
}

export const LanguageProvider = ({ children }) => {
    const [currentLanguage, setCurrentLanguage] = useState(() => {
        const saved = localStorage.getItem('app_language')
        return saved || 'en'
    })

    useEffect(() => {
        localStorage.setItem('app_language', currentLanguage)
        // Set document direction for RTL languages like Arabic
        document.dir = currentLanguage === 'ar' ? 'rtl' : 'ltr'
    }, [currentLanguage])

    const t = (path) => {
        const keys = path.split('.')
        let result = translations[currentLanguage] || translations['en']

        for (const key of keys) {
            if (result[key]) {
                result = result[key]
            } else {
                // Fallback to English if key missing
                let fallback = translations['en']
                for (const fk of keys) {
                    fallback = fallback?.[fk]
                }
                return fallback || path
            }
        }
        return result
    }

    return (
        <LanguageContext.Provider value={{ currentLanguage, setCurrentLanguage, t, languages }}>
            {children}
        </LanguageContext.Provider>
    )
}
