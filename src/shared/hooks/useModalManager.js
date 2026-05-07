import { useCallback, useMemo, useState } from "react";

const buildLeadContext = (ctx, prefill) => (prefill ? { context: ctx, ...prefill } : ctx);

export default function useModalManager() {
  const [modal, setModal] = useState(null);

  const closeModal = useCallback(() => setModal(null), []);

  const openContact = useCallback(() => setModal({ kind: "contact" }), []);
  const openPartner = useCallback(() => setModal({ kind: "partner" }), []);
  const openBrief = useCallback(() => setModal({ kind: "brief" }), []);

  const openLead = useCallback((ctx, prefill) => {
    setModal({ kind: "lead", leadContext: buildLeadContext(ctx, prefill) });
  }, []);

  const openSolution = useCallback((solution) => setModal({ kind: "solution", solution }), []);

  const openTurkovCatalog = useCallback(() => setModal({ kind: "turkovCatalog" }), []);
  const closeTurkovCatalog = useCallback(() => setModal(null), []);

  const openTurkovCategory = useCallback((category) => {
    setModal({ kind: "turkovCategory", category });
  }, []);
  const closeTurkovCategory = useCallback(() => {
    setModal({ kind: "turkovCatalog" });
  }, []);

  const openService = useCallback((serviceKey) => setModal({ kind: "service", serviceKey }), []);

  const modalOpen = useMemo(() => Boolean(modal?.kind), [modal]);

  return {
    modal,
    modalOpen,
    closeModal,
    openContact,
    openPartner,
    openBrief,
    openLead,
    openSolution,
    openTurkovCatalog,
    closeTurkovCatalog,
    openTurkovCategory,
    closeTurkovCategory,
    openService,
  };
}

