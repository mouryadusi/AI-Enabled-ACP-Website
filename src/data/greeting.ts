/** "Thank you for visiting" cycled in six languages at the foot of the
 * greeting page — kept as {lang, text} pairs so the small caption label
 * can show which language is on screen. */
export const thankYouCycle: { lang: string; text: string }[] = [
  { lang: "EN", text: "Thank you for visiting" },
  { lang: "AR", text: "شكراً لزيارتكم" },
  { lang: "TE", text: "సందర్శించినందుకు ధన్యవాదాలు" },
  { lang: "ES", text: "Gracias por su visita" },
  { lang: "FR", text: "Merci de votre visite" },
  { lang: "JA", text: "ご来場ありがとうございます" },
];

export const projectMeta = {
  title: "AI-Enabled Aircraft Conflict Prediction",
  author: "Mourya Dusi",
  studentId: "M01086558",
  programme: "MSc Data Science and Artificial Intelligence",
  institution: "Middlesex University Dubai",
  supervisorLabel: "Under the supervision of",
  supervisorName: "Dr Ikram Rehman",
  supervisorCredentials: "PhD, SFHEA, SMIEEE",
  /** Ordered by hierarchy — first entry is the primary role, shown most
   * prominently; the rest are supporting appointments shown smaller. */
  supervisorRoles: [
    "Associate Professor in Artificial Intelligence and Data Science",
    "Programme Advisor, BSc AI and Data Science",
    "Head & Founder, Digi-Health Lab: Health Informatics and Smart Diagnostics",
    "Department of Computer Engineering and Informatics (CEI)",
    "Partnerships Chair, 12th IEEE International Smart Cities Conference (ISC2 2026), Porto, Portugal",
    "Workshop Chair, \u201cPreventive Digital Health in Smart Cities: Connected Care Technologies for Healthier, More Resilient Cities,\u201d IEEE ISC2 2026",
    "Workshop Chair, \u201cFuture of Learning in Smart Cities,\u201d IEEE ISC2 2026",
  ],
};
