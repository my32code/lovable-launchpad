import { createFileRoute } from '@tanstack/react-router';
import { useServerFn } from '@tanstack/react-start';
import { useEffect, useState, type FormEvent } from 'react';
import { ArrowUpRight, ArrowRight, Check, CheckCircle2, ChevronDown, ChevronUp, Sun, Moon, Menu, X, Users, HeartHandshake, Sparkles, ShieldCheck, LockKeyhole, Target, MessageCircle, CalendarDays, Sprout, CircleCheck, Mic, Compass, Send, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import heroImage from '@/assets/resonance-hero.jpg';
import { joinWaitlist } from '@/lib/waitlist.functions';
import { waitlistSchema } from '@/lib/waitlist-schema';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'Résonance — Trouve ta résonance, évoluez ensemble' },
    { name: 'description', content: 'Ne porte plus tes objectifs seul. Découvre Résonance : des duos compatibles, des Cercles et des Éclats pour progresser ensemble. Rejoins la liste d’attente de la bêta privée.' },
    { property: 'og:title', content: 'Résonance — Le déclic, c’est parfois quelqu’un.' },
    { property: 'og:description', content: 'L’entraide qui transforme tes objectifs en progrès concrets. Rejoins la liste d’attente de la bêta privée.' },
    { property: 'og:type', content: 'website' }, { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Index,
});

function Brand() {
  return <a href="#" className="brand" aria-label="Résonance, accueil"><svg className="brand-mark" viewBox="0 0 48 48" fill="none" aria-hidden="true"><path d="M12 27C6 13 23 5 32 13c9 10-4 18-11 13M36 21c6 14-11 22-20 14-9-10 4-18 11-13" stroke="currentColor" strokeWidth="4" strokeLinecap="round"/></svg>Résonance<span className="text-primary">.</span></a>;
}

const steps = [
  { number:'01', icon:Compass, title:'Commence par toi.', copy:'Tes objectifs, tes envies, ta façon d’aider. Un questionnaire pour comprendre ce qui compte vraiment pour toi.', detail:'Pas de profil à mettre en scène' },
  { number:'02', icon:HeartHandshake, title:'Rencontre ton écho.', copy:'Des profils qui font sens, pas une infinité de visages. Choisis un duo avec qui l’envie d’avancer est réciproque.', detail:'Pas de swipe. Pas de pression.' },
  { number:'03', icon:Sprout, title:'Avancez, pour de vrai.', copy:'Un rendez-vous, une action concrète, un bilan. Construisez un rythme qui transforme vos intentions en progrès.', detail:'De petits pas. Un vrai changement.' },
];
const offers = [
  { icon:HeartHandshake, badge:'Gratuit', title:'Les duos', subtitle:'Un lien. Deux élans.', text:'Une personne compatible avec tes objectifs. Vous vous écoutez, vous vous encouragez et vous avancez à votre rythme.', features:['Connexion après accord mutuel','Messagerie et rendez-vous','Actions et bilans confidentiels'], cta:'Je veux trouver mon duo', featured:true },
  { icon:Target, badge:'Accompagnement payant', title:'Le coaching', subtitle:'Un regard pro, un cap plus clair.', text:'Pour aller plus loin sur un besoin précis, un accompagnement individuel par un coach professionnel.', features:['Accompagnement individuel','Indépendant du matching','Tarif connu avant réservation'], cta:'Le coaching m’intéresse', featured:false },
  { icon:Users, badge:'À venir · V2', title:'Les Cercles', subtitle:'Quatre personnes. Un élan commun.', text:'Un petit collectif formé selon vos objectifs et votre compatibilité. Plus de perspectives, sans se perdre dans la foule.', features:['4 personnes maximum','5 avec un coach','Offre payante, tarif annoncé'], cta:'Je veux rejoindre un Cercle', featured:false },
];
const goals = [
 { label:'Confiance en soi', title:'Oser être toi, un pas à la fois.', text:'Un duo pour partager tes doutes sans jugement et célébrer ce que tu n’osais pas faire hier.', actions:['Identifier une petite victoire','Faire un premier pas ensemble','Prendre du recul chaque semaine'] },
 { label:'Organisation', title:'Passer de « demain » à aujourd’hui.', text:'Retrouve un rythme réaliste avec quelqu’un qui t’aide à garder le cap, sans culpabiliser.', actions:['Choisir une priorité concrète','Se donner un rendez-vous régulier','Ajuster ses engagements'] },
 { label:'Prise de parole', title:'Faire entendre ta voix.', text:'Un espace bienveillant pour t’entraîner, recevoir un retour constructif et gagner en assurance.', actions:['Préparer une courte intervention','S’entraîner avec son duo','Recevoir un retour bienveillant'] },
 { label:'Projet personnel', title:'Donner une chance à ton idée.', text:'Ne reste plus seul face à ton projet. Partage tes étapes et trouve l’élan pour concrétiser ce qui compte.', actions:['Clarifier la prochaine étape','Partager ses avancées','Célébrer chaque engagement tenu'] },
];
const faqs = [
 { q:'Résonance, c’est quoi exactement ?', a:'Un projet d’entraide et de développement personnel. Résonance veut relier des personnes compatibles autour d’objectifs concrets, avec des duos, des rendez-vous et des bilans. Les Cercles sont prévus en V2. Le projet se construit aujourd’hui avec ses premiers testeurs.' },
 { q:'Est-ce une application de rencontre ?', a:'Non. La résonance dont nous parlons, c’est une compatibilité d’objectifs, d’engagement et de façon de s’entraider. Il ne s’agit pas de rencontres amoureuses.' },
 { q:'Est-ce que ce sera gratuit ?', a:'Les duos sont prévus gratuitement. Le coaching professionnel est payant et indépendant du matching. Les Cercles, prévus en V2, seront payants. Les tarifs seront présentés avant tout engagement. S’inscrire sur la liste d’attente ne demande aucun paiement.' },
 { q:'Puis-je déjà utiliser Résonance ?', a:'Pas encore. Résonance est en phase de validation. Tu peux rejoindre la liste d’attente pour être informé de l’ouverture de la bêta privée et des opportunités de test. L’inscription n’est pas une garantie d’accès immédiat.' },
 { q:'Comment les profils seront-ils proposés ?', a:'Le questionnaire permettra de prendre en compte les objectifs, les disponibilités et la façon d’aider de chacun. Une compatibilité est une estimation, jamais une garantie : la connexion restera un choix mutuel.' },
 { q:'À quoi servent les Éclats ?', a:'Les Éclats valorisent les engagements tenus, les retours constructifs et les bilans complétés, pas la quantité de messages. Ils sont conçus pour débloquer des ressources, des fonctionnalités et des avantages collectifs. Ce n’est pas de l’argent réel.' },
];

function Index() {
  const [dark,setDark] = useState(false);
  const [menu,setMenu] = useState(false);
  const [faq,setFaq] = useState<number | null>(0);
  const [goal,setGoal] = useState(0);
  const [email,setEmail] = useState('');
  const [selectedGoal,setSelectedGoal] = useState('Explorer Résonance');
  const [consent,setConsent] = useState(false);
  const [website,setWebsite] = useState('');
  const [status,setStatus] = useState<'idle'|'pending'|'success'>('idle');
  const [error,setError] = useState('');
  const [privacy,setPrivacy] = useState(false);
  const signup = useServerFn(joinWaitlist);
  useEffect(() => {
    const preference = localStorage.getItem('resonance-theme');
    const isDark = preference === 'dark';
    setDark(isDark); document.documentElement.classList.toggle('dark',isDark);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
    }),{ threshold: .08 });
    document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
    return ()=>observer.disconnect();
  },[]);
  function toggleTheme() {
    const next = !dark; setDark(next); document.documentElement.classList.toggle('dark',next);
    localStorage.setItem('resonance-theme',next ? 'dark':'light');
  }
  function goSignup(value?:string) {
    if (value) setSelectedGoal(value);
    setMenu(false); document.getElementById('rejoindre')?.scrollIntoView({behavior:'smooth'});
  }
  async function submit(event:FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError('');
    const parsed = waitlistSchema.safeParse({email,goal:selectedGoal,consent,website});
    if (!parsed.success) { setError(!consent ? 'Accepte d’être contacté au sujet de la bêta pour t’inscrire.' : 'Entre une adresse e-mail valide.'); return; }
    setStatus('pending');
    try {
      const result = await signup({data:parsed.data});
      if (!result.ok) { setError(result.message); setStatus('idle'); return; }
      setStatus('success');
    } catch { setError('La connexion a été interrompue. Réessaie dans un instant.'); setStatus('idle'); }
  }
  const currentGoal = goals[goal] ?? goals[0];
  if (!currentGoal) return null;
  return <>
    <header className="site-header"><div className="container header-inner"><Brand/><nav aria-label="Navigation principale" className={`nav-links ${menu?'open':''}`}>
      <a href="#origine" onClick={()=>setMenu(false)}>Notre histoire</a><a href="#comment" onClick={()=>setMenu(false)}>Comment ça marche</a><a href="#formats" onClick={()=>setMenu(false)}>Les expériences</a><a href="#faq" onClick={()=>setMenu(false)}>FAQ</a>
    </nav><div className="header-actions"><Button variant="ghost" className="theme-button" onClick={toggleTheme} title={dark?'Passer au thème clair':'Passer au thème sombre'} aria-label={dark?'Passer au thème clair':'Passer au thème sombre'}>{dark?<Sun size={18}/>:<Moon size={18}/>}</Button><Button variant="resonance" onClick={()=>goSignup()}>Rejoindre la bêta <ArrowUpRight/></Button><Button variant="ghost" className="mobile-menu-button" onClick={()=>setMenu(!menu)} aria-label={menu?'Fermer le menu':'Ouvrir le menu'} aria-expanded={menu}>{menu?<X/>:<Menu/>}</Button></div></div></header>
    <main>
      <section className="hero"><img src={heroImage} width={1920} height={1024} alt="Deux personnes échangent avec bienveillance autour de leurs projets" className="hero-photo" fetchPriority="high"/><div className="container hero-inner"><div className="hero-copy"><div className="eyebrow"><span className="status-dot"/>L’entraide qui nous fait grandir.</div><h1>Trouve ta<br/><em>résonance.</em><br/>Évoluez ensemble.</h1><p className="hero-description">Tu as l’envie d’avancer. Et si tu trouvais la bonne personne pour le faire avec toi ? Des liens sincères, des objectifs partagés, de vrais progrès.</p><div className="hero-actions"><Button variant="resonance" onClick={()=>goSignup()}>Rejoindre la bêta privée <ArrowUpRight/></Button><Button variant="quiet" asChild><a href="#comment">Découvrir Résonance <ArrowRight/></a></Button></div><p className="hero-footnote"><Check size={13}/>Inscription gratuite · Sans engagement · À ton rythme</p></div><div className="connection-note"><div className="connection-icon"><HeartHandshake size={21}/></div><div><strong>Le déclic, c’est parfois quelqu’un.</strong><small>Moins de solitude. Plus d’élan.</small></div></div></div></section>
      <div className="value-strip"><div className="container value-strip-inner"><div className="value-item"><Users/>Des connexions, pas des swipes</div><div className="value-item"><Target/>Des objectifs qui font sens</div><div className="value-item"><ShieldCheck/>Bienveillance & respect</div><div className="value-item"><Sprout/>Du progrès, pas de pression</div></div></div>
      <section id="origine" className="section"><div className="container origin reveal"><div className="section-heading"><div className="eyebrow">À l’origine de Résonance</div><h2>On n’a pas besoin de<br/>tout faire seul.</h2><p>Une envie de changer. Un projet qu’on repousse. Un objectif qu’on abandonne, faute de soutien. Ce n’est pas toujours la motivation qui manque. Parfois, c’est simplement la bonne présence.</p><p>Résonance part de cette conviction : l’entraide peut transformer notre façon d’avancer. Notre objectif ? Créer des liens utiles et humains, où chacun peut donner autant que recevoir.</p></div><div className="origin-quote"><p>Pas un réseau pour se montrer.<br/>Un espace pour <span>se rencontrer,<br/>s’entraider et se dépasser.</span></p><small>NOTRE CONVICTION · LE LIEN AVANT LA PERFORMANCE</small></div></div></section>
      <section id="comment" className="section process-band"><div className="container"><div className="section-heading center-heading reveal"><div className="eyebrow">Comment ça marche</div><h2>De la rencontre au premier pas.</h2><p>Pas besoin d’avoir toutes les réponses.<br/>Juste l’envie d’avancer, et d’aider quelqu’un à faire de même.</p></div><div className="steps">{steps.map(step=><article className="step reveal" key={step.number}><div className="step-number">{step.number}</div><div className="step-icon"><step.icon size={24}/></div><h3>{step.title}</h3><p>{step.copy}</p><div className="step-detail"><Check size={13}/>{step.detail}</div></article>)}</div></div></section>
      <section id="formats" className="section"><div className="container"><div className="section-heading center-heading reveal"><div className="eyebrow">À chacun sa résonance</div><h2>Un duo pour commencer.<br/>Un collectif pour aller plus loin.</h2><p>Trois expériences distinctes. Une même idée :<br/>on progresse mieux quand on est bien entouré.</p></div><div className="offers">{offers.map(offer=><article className={`offer reveal ${offer.featured?'featured':''}`} key={offer.title}><div className="offer-top"><offer.icon className="offer-icon"/><span className="offer-badge">{offer.badge}</span></div><h3>{offer.title}</h3><span className="offer-subtitle">{offer.subtitle}</span><p>{offer.text}</p><ul>{offer.features.map(feature=><li key={feature}><Check/>{feature}</li>)}</ul><Button variant="quiet" onClick={()=>goSignup()}>{offer.cta}<ArrowUpRight/></Button></article>)}</div><p className="small-note">Résonance se construit avec ses premiers testeurs. Les expériences présentées décrivent le projet à venir.</p></div></section>
      <section id="eclats" className="section eclats-band"><div className="container eclats-inner"><div className="section-heading reveal"><div className="eyebrow"><Sparkles size={13}/>Les Éclats</div><h2>Les petites actions<br/>font les <span className="spark-title">grandes étincelles.</span></h2><p>Un engagement tenu. Un retour qui aide. Un bilan sincère. Tes contributions ont de la valeur : les Éclats sont là pour la reconnaître.</p><p>Pas une course aux messages ou à la popularité. Une façon de valoriser ce qui fait vraiment avancer, et de débloquer des ressources et des avantages collectifs.</p><div className="spark-summary"><ShieldCheck size={20}/>Les Éclats ne sont pas de l’argent réel.</div></div><div className="eclats-visual reveal"><div className="spark-card"><div className="spark-card-header"><span>Ton élan, en Éclats</span><Sparkles size={20}/></div><div className="spark-total"><strong>120</strong><span>Éclats ✧</span></div><div className="spark-row"><CircleCheck/>Engagement tenu<strong>+ 20 ✧</strong></div><div className="spark-row"><MessageCircle/>Retour constructif<strong>+ 15 ✧</strong></div><div className="spark-row"><CalendarDays/>Bilan complété<strong>+ 10 ✧</strong></div></div><p className="preview-note">Illustration du concept · Valeurs fictives, non contractuelles</p></div></div></section>
      <section className="section"><div className="container"><div className="section-heading center-heading reveal"><div className="eyebrow">Ton prochain chapitre</div><h2>Qu’est-ce qui te ferait avancer ?</h2><p>Pas besoin d’un objectif spectaculaire. Ce qui compte, c’est le tien.</p></div><div className="goal-tabs" role="group" aria-label="Explorer un objectif">{goals.map((item,i)=><Button key={item.label} variant="ghost" className="goal-tab" aria-pressed={goal===i} onClick={()=>{setGoal(i);setSelectedGoal(item.label);}}>{item.label}</Button>)}</div><div className="goal-display"><div key={currentGoal.label} className="goal-detail"><h3>{currentGoal.title}</h3><p>{currentGoal.text}</p></div><div className="goal-checklist">{currentGoal.actions.map(action=><span key={action}><CheckCircle2/>{action}</span>)}</div></div></div></section>
      <section id="faq" className="section faq-band"><div className="container faq-layout"><div className="section-heading reveal"><div className="eyebrow">En toute transparence</div><h2>Une question ?<br/>On t’écoute.</h2><p>Une relation de confiance commence<br/>par des réponses claires.</p></div><div className="reveal">{faqs.map((item,i)=><div className="faq-item" key={item.q}><Button variant="ghost" className="faq-trigger" aria-expanded={faq===i} aria-controls={`faq-${i}`} onClick={()=>setFaq(faq===i?null:i)}>{item.q}{faq===i?<ChevronUp/>:<ChevronDown/>}</Button>{faq===i&&<div id={`faq-${i}`} className="faq-answer">{item.a}</div>}</div>)}</div></div></section>
      <section id="rejoindre" className="section signup-section"><div className="container"><div className="section-heading center-heading reveal"><span className="beta-label"><span className="status-dot"/>Bêta privée · Liste d’attente ouverte</span><h2>Ton prochain pas<br/>ne sera peut-être pas solitaire.</h2><p>Fais partie des premiers à faire résonner le projet.<br/>Laisse ton e-mail : nous te tiendrons au courant des premiers tests.</p></div>{status==='success'?<div className="success-state" role="status"><CheckCircle2 size={34}/><h3>Le premier pas est fait.</h3><p>Ton inscription sur la liste d’attente est enregistrée. Nous te contacterons au sujet de la bêta privée et des opportunités de test.</p><p>Merci de donner de l’élan à Résonance.</p></div>:<form className="signup-form" onSubmit={submit}><label className="form-label" htmlFor="goal">Ce que tu aimerais faire avancer <span className="text-muted-foreground">(facultatif)</span></label><select className="form-input" id="goal" value={selectedGoal} onChange={event=>setSelectedGoal(event.target.value)}><option>Explorer Résonance</option>{goals.map(item=><option key={item.label}>{item.label}</option>)}</select><label className="form-label" htmlFor="email">Ton adresse e-mail</label><div className="form-row"><input className="form-input" id="email" type="email" autoComplete="email" placeholder="toi@exemple.fr" maxLength={254} required value={email} onChange={event=>setEmail(event.target.value)} aria-describedby={error?'form-error':undefined}/><Button variant="resonance" type="submit" disabled={status==='pending'}>{status==='pending'?'Inscription…':'Je rejoins l’aventure'}<ArrowUpRight/></Button></div><div className="hidden" aria-hidden="true"><label htmlFor="website">Site web</label><input id="website" name="website" tabIndex={-1} autoComplete="off" value={website} onChange={event=>setWebsite(event.target.value)}/></div><label className="consent-label"><input type="checkbox" checked={consent} onChange={event=>setConsent(event.target.checked)}/><span>J’accepte d’être contacté au sujet de Résonance et de sa bêta privée. Mes données seront utilisées uniquement à cette fin. <Button variant="link" type="button" className="privacy-link" onClick={()=>setPrivacy(true)}>Confidentialité</Button></span></label>{error&&<p className="form-error" role="alert" id="form-error">{error}</p>}</form>}<div className="signup-assurance"><span><LockKeyhole/>Ton e-mail reste privé</span><span><Check/>Sans paiement</span><span><Mail/>Pas de spam</span></div></div></section>
    </main><footer className="site-footer"><div className="container"><div className="footer-main"><div><Brand/><p>Des liens sincères. Des pas en avant.</p></div><nav className="footer-links" aria-label="Navigation de pied de page"><a href="#origine">Notre histoire</a><a href="#faq">FAQ</a><Button variant="link" className="privacy-link" onClick={()=>setPrivacy(true)}>Confidentialité</Button><a href="#rejoindre">Rejoindre la bêta <ArrowUpRight className="inline size-3"/></a></nav></div><div className="footer-bottom"><span>© 2026 Résonance. Un projet qui se construit ensemble.</span><span>La compatibilité est une estimation, jamais une garantie.</span></div></div></footer>
    <Dialog open={privacy} onOpenChange={setPrivacy}><DialogContent><DialogHeader><DialogTitle>Ta confidentialité compte.</DialogTitle><DialogDescription>Inscription à la liste d’attente de Résonance</DialogDescription></DialogHeader><div className="body-copy"><p>Nous conservons ton adresse e-mail, l’objectif choisi et la date de ton consentement pour gérer la liste d’attente et te contacter au sujet de la bêta et des tests du projet.</p><p className="mt-4">Ces informations ne sont pas affichées publiquement. Aucun paiement ni création de compte n’est nécessaire. Nous n’utilisons pas de suivi publicitaire sur cette page.</p><p className="mt-4">Tu pourras demander la suppression de ton inscription en répondant aux communications de Résonance. Les coordonnées du responsable et les informations légales complètes seront précisées avant le lancement de la bêta.</p></div><Button variant="resonance" onClick={()=>setPrivacy(false)}>J’ai compris <Check/></Button></DialogContent></Dialog>
  </>;
}
