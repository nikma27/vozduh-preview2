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
import useModalManager from "./shared/hooks/useModalManager";

function MainSite() {
  const modalManager = useModalManager();
  const [assistantOpenSignal, setAssistantOpenSignal] = useState(0);
  const { calcOpen, calcTab, openCalc, closeCalc } = useCalcUrlSync();

  useLockBodyScroll(Boolean(modalManager.modalOpen || calcOpen));

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
      <Navbar onOpenContact={modalManager.openContact} />
      <Hero
        onOpenCalc={openCalc}
        onOpenAssistant={openAssistant}
        onOpenBrief={modalManager.openBrief}
      />

      <Reveal>
        <Catalog onOpenSolution={modalManager.openSolution} />
      </Reveal>

      <Reveal>
        <TurkovPromo
          onOpenCategory={modalManager.openTurkovCategory}
          onOpenLead={modalManager.openLead}
          onOpenTurkovCatalog={modalManager.openTurkovCatalog}
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
          onOpenService={modalManager.openService}
          onOpenBrief={modalManager.openBrief}
          onOpenLead={modalManager.openLead}
        />
      </Reveal>

      <Reveal>
        <PartnersSection onOpenPartner={modalManager.openPartner} />
      </Reveal>

      <Reveal>
        <ContactForm
          onOpenLead={modalManager.openLead}
          onOpenContact={modalManager.openContact}
          onOpenAssistant={openAssistant}
          onOpenBrief={modalManager.openBrief}
        />
      </Reveal>

      <Reveal>
        <CTAstrip />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>

      <BackToTop />

      <ClimateAssistant openSignal={assistantOpenSignal} onOpenBrief={modalManager.openBrief} />

      <AnimatePresence>
        {modalManager.modal?.kind === "solution" && (
          <SolutionDetailModal
            solution={modalManager.modal.solution}
            onClose={modalManager.closeModal}
            onOpenLead={modalManager.openLead}
          />
        )}
        {modalManager.modal?.kind === "turkovCatalog" && (
          <TurkovCatalogModal
            onClose={modalManager.closeTurkovCatalog}
            onOpenCategory={modalManager.openTurkovCategory}
          />
        )}
        {modalManager.modal?.kind === "turkovCategory" && (
          <TurkovCategoryModal
            category={modalManager.modal.category}
            onClose={modalManager.closeTurkovCategory}
            onOpenLead={modalManager.openLead}
          />
        )}
        {modalManager.modal?.kind === "lead" && (
          <LeadModal leadContext={modalManager.modal.leadContext} onClose={modalManager.closeModal} />
        )}
        {modalManager.modal?.kind === "partner" && <PartnerModal onClose={modalManager.closeModal} />}
        {modalManager.modal?.kind === "contact" && <ContactModal onClose={modalManager.closeModal} />}
        {modalManager.modal?.kind === "brief" && (
          <BriefGeneratorModal onClose={modalManager.closeModal} />
        )}

        {calcOpen && (
          <QuickCalcModal
            key={calcTab}
            initialTab={calcTab}
            onClose={closeCalc}
            onOpenLead={(ctx) => {
              closeCalc();
              modalManager.openLead(ctx);
            }}
          />
        )}

        {modalManager.modal?.kind === "service" && (
          <ServiceInfoModal
            serviceKey={modalManager.modal.serviceKey}
            onClose={modalManager.closeModal}
            onOpenLead={modalManager.openLead}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
export default function App() {
  return <MainSite />;
}
