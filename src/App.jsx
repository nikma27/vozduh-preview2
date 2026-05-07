import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandMarquee from "./components/BrandMarquee";
import WorksMarquee from "./components/WorksMarquee";
import Navbar from "./components/sections/Navbar";
import Hero from "./components/sections/Hero";
import ClimateAssistant from "./features/assistant/ClimateAssistant";
import {
  BriefGeneratorModal,
  ContactModal,
  LeadModal,
  PartnerModal,
} from "./features/modals/LeadAndContactModals";
import { QuickCalcModal, ServiceInfoModal } from "./features/modals/ServiceAndCalcModals";
import {
  SolutionDetailModal,
  TurkovCatalogModal,
  TurkovCategoryModal,
} from "./features/modals/SolutionAndTurkovModals";
import {
  Catalog,
  ContactForm,
  CTAstrip,
  Footer,
  PartnersSection,
  TurkovPromo,
  WhyChooseUsSection,
} from "./features/sections/LandingSections";
import BackToTop from "./shared/ui/BackToTop";
import Reveal from "./shared/ui/Reveal";
import useCalcUrlSync from "./shared/hooks/useCalcUrlSync";
import useLockBodyScroll from "./shared/hooks/useLockBodyScroll";

function MainSite() {
  const [activeSolution, setActiveSolution] = useState(null);
  const [activeTurkovCategory, setActiveTurkovCategory] = useState(null);
  const [turkovCatalogOpen, setTurkovCatalogOpen] = useState(false);
  const [leadContext, setLeadContext] = useState(null);
  const [modalState, setModalState] = useState(null);
  const [activeService, setActiveService] = useState(null);
  const [assistantOpenSignal, setAssistantOpenSignal] = useState(0);
  const { calcOpen, calcTab, openCalc, closeCalc } = useCalcUrlSync();

  const modalOpen =
    turkovCatalogOpen ||
    activeTurkovCategory ||
    modalState ||
    leadContext ||
    activeSolution ||
    activeService ||
    calcOpen;

  useLockBodyScroll(Boolean(modalOpen));

  const openContact = () => setModalState("contact");
  const openPartner = () => setModalState("partner");
  const openBrief = () => setModalState("brief");
  const openLead = (ctx, prefill) =>
    setLeadContext(prefill ? { context: ctx, ...prefill } : ctx);

  const openService = (key) => setActiveService(key);

  const openAssistant = () => {
    setAssistantOpenSignal((prev) => prev + 1);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="font-sans text-slate-800 antialiased bg-white selection:bg-blue-200 selection:text-blue-900 overflow-x-hidden"
    >
      <Navbar onOpenContact={openContact} />
      <Hero onOpenCalc={openCalc} onOpenAssistant={openAssistant} onOpenBrief={openBrief} />

      <Reveal>
        <Catalog onOpenSolution={setActiveSolution} />
      </Reveal>

      <Reveal>
        <TurkovPromo
          onOpenCategory={setActiveTurkovCategory}
          onOpenLead={openLead}
          onOpenTurkovCatalog={() => setTurkovCatalogOpen(true)}
        />
      </Reveal>

      <Reveal>
        <BrandMarquee />
      </Reveal>

      <Reveal>
        <WorksMarquee />
      </Reveal>

      <Reveal>
        <WhyChooseUsSection
          onOpenService={openService}
          onOpenBrief={openBrief}
          onOpenLead={openLead}
        />
      </Reveal>

      <Reveal>
        <PartnersSection onOpenPartner={openPartner} />
      </Reveal>

      <Reveal>
        <ContactForm
          onOpenLead={openLead}
          onOpenContact={openContact}
          onOpenAssistant={openAssistant}
          onOpenBrief={openBrief}
        />
      </Reveal>

      <Reveal>
        <CTAstrip />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>

      <BackToTop />

      <ClimateAssistant openSignal={assistantOpenSignal} onOpenBrief={openBrief} />

      <AnimatePresence>
        {activeSolution && (
          <SolutionDetailModal
            solution={activeSolution}
            onClose={() => setActiveSolution(null)}
            onOpenLead={openLead}
          />
        )}
        {turkovCatalogOpen && (
          <TurkovCatalogModal
            onClose={() => setTurkovCatalogOpen(false)}
            onOpenCategory={(item) => {
              setTurkovCatalogOpen(false);
              setActiveTurkovCategory(item);
            }}
          />
        )}
        {activeTurkovCategory && (
          <TurkovCategoryModal
            category={activeTurkovCategory}
            onClose={() => {
              setActiveTurkovCategory(null);
              setTurkovCatalogOpen(true);
            }}
            onOpenLead={openLead}
          />
        )}
        {leadContext && <LeadModal leadContext={leadContext} onClose={() => setLeadContext(null)} />}
        {modalState === "partner" && <PartnerModal onClose={() => setModalState(null)} />}
        {modalState === "contact" && <ContactModal onClose={() => setModalState(null)} />}
        {modalState === "brief" && <BriefGeneratorModal onClose={() => setModalState(null)} />}

        {calcOpen && (
          <QuickCalcModal
            key={calcTab}
            initialTab={calcTab}
            onClose={closeCalc}
            onOpenLead={(ctx) => {
              closeCalc();
              openLead(ctx);
            }}
          />
        )}

        {activeService && (
          <ServiceInfoModal
            serviceKey={activeService}
            onClose={() => setActiveService(null)}
            onOpenLead={(ctx) => {
              setActiveService(null);
              openLead(ctx);
            }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export default function App() {
  return <MainSite />;
}
