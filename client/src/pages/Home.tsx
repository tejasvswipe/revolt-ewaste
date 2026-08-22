import { useRef, useState } from "react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";
import { ArrowDownRight, ArrowRight, Check, ChevronDown, CircleDot, FileText, Menu, ScanLine, ShieldCheck, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { Link } from "wouter";

const heroVisual = "/manus-storage/revolt-hero-device-evidence_efc1d481.png";
const kioskVisual = "/manus-storage/revolt-kiosk-ad_c15a79f8.png";
const mark = "/manus-storage/revolt-logo-black-white-transparent_03e12a00.png";

const stages = [
  { id: "01", title: "Identify", text: "Serial-level registration begins at intake.", meta: "ASSET ID / QR / METADATA" },
  { id: "02", title: "Custody", text: "Timestamped handoffs keep the chain visible.", meta: "HANDOFF / LOCATION / OWNER" },
  { id: "03", title: "Verify", text: "Sanitization status is recorded against the asset.", meta: "WIPE / CHECK / EXCEPTION" },
  { id: "04", title: "Evidence", text: "A certificate and recovery record close the loop.", meta: "CERTIFICATE / HANDOFF / REPORT" },
];

const triggers = [
  ["01", "Employee offboarding", "A departing employee leaves behind hardware requiring controlled disposition."],
  ["02", "Hardware refresh", "Fleet refresh cycles can create a batch of retired assets with no clear chain."],
  ["03", "Office consolidation", "Closures and relocations trigger concentrated disposal events."],
  ["04", "Audit pressure", "Teams need defensible evidence after an asset leaves their control."],
];

function EvidenceVault() {
  const { user, loading } = useAuth();
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string>("");
  const filesQuery = trpc.evidenceFiles.list.useQuery(undefined, { enabled: Boolean(user) });
  const upload = trpc.evidenceFiles.upload.useMutation({
    onSuccess: () => { setStatus("Stored in evidence vault"); filesQuery.refetch(); },
    onError: (error) => setStatus(error.message || "Upload failed"),
  });
  const handleFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) { setStatus("Maximum file size is 10 MB"); return; }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/webp", "text/plain", "text/csv"];
    if (!allowed.includes(file.type)) { setStatus("Use PDF, PNG, JPEG, WEBP, TXT, or CSV files"); return; }
    setStatus("Preparing secure upload…");
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const dataBase64 = result.includes(",") ? result.split(",")[1] : result;
      upload.mutate({ fileName: file.name, mimeType: file.type as "application/pdf", sizeBytes: file.size, dataBase64 });
    };
    reader.onerror = () => setStatus("Could not read that file");
    reader.readAsDataURL(file);
  };
  return <section className="border-b-2 border-[#101313] bg-[#18d7c1] py-20"><div className="container"><div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr] lg:items-start"><div><div className="eyebrow mb-5">09 / File Storage</div><h2 className="display text-5xl md:text-7xl">PUT PROOF<br /><span className="text-[#f3f0e8]">IN THE</span><br />VAULT.</h2><p className="mt-7 max-w-[350px] text-sm leading-relaxed">A private evidence drop for pilot documents, certificates, and asset records. Files are stored as secure objects; the database keeps only metadata and storage references.</p></div><div className="border-2 border-[#101313] bg-[#f3f0e8] p-5 shadow-[9px_9px_0_#101313]"><div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#101313] pb-4"><div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center border-2 border-[#101313] bg-[#101313] text-[#18d7c1]"><UploadCloud size={19} /></span><div><div className="text-sm font-extrabold uppercase">Evidence vault</div><div className="mono text-[9px] uppercase tracking-[.1em] text-[#149f92]">Private / authenticated / max 10 MB</div></div></div>{user && <span className="mono text-[9px] font-bold uppercase text-[#149f92]">{user.email || "SIGNED IN"}</span>}</div>{loading ? <div className="py-10 text-sm">Checking session…</div> : !user ? <div className="flex flex-col gap-5 py-8 sm:flex-row sm:items-center sm:justify-between"><p className="max-w-[420px] text-sm leading-relaxed">Sign in to upload pilot evidence and view the files connected to your account.</p><button onClick={() => startLogin()} className="pressable inline-flex items-center justify-center gap-2 border-2 border-[#101313] bg-[#e8f05a] px-5 py-3 text-xs font-bold uppercase shadow-[5px_5px_0_#101313]">Sign in to continue <ArrowRight size={15} /></button></div> : <><button type="button" onClick={() => inputRef.current?.click()} disabled={upload.isPending} className="pressable mt-6 flex w-full items-center justify-between border-2 border-[#101313] bg-[#fffdf7] p-5 text-left shadow-[5px_5px_0_#101313] disabled:opacity-60"><span><span className="block text-sm font-extrabold uppercase">{upload.isPending ? "Uploading securely…" : "Choose evidence file"}</span><span className="mono mt-2 block text-[9px] uppercase tracking-[.08em] text-[#4f5753]">PDF / image / text · max 10 MB</span></span><UploadCloud size={22} /></button><input ref={inputRef} type="file" className="hidden" accept=".pdf,.png,.jpg,.jpeg,.webp,.txt,.csv" onChange={(event) => handleFile(event.target.files?.[0])} />{status && <div className={`mono mt-4 border-2 border-[#101313] p-3 text-[10px] font-bold uppercase ${status.includes("Stored") ? "bg-[#18d7c1]" : "bg-[#e8f05a]"}`}>{status}</div>}<div className="mt-7"><div className="eyebrow mb-3">Stored files / your account</div>{filesQuery.isLoading ? <div className="text-sm">Loading file index…</div> : filesQuery.data?.length ? <div className="space-y-2">{filesQuery.data.map((file) => <a key={file.id} href={file.storageUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between border-t border-[#101313]/30 py-3 text-sm hover:text-[#149f92]"><span className="flex min-w-0 items-center gap-3"><FileText size={15} /><span className="truncate font-bold">{file.fileName}</span></span><span className="mono ml-4 shrink-0 text-[9px] uppercase text-[#149f92]">Open</span></a>)}</div> : <div className="border-t border-[#101313]/30 pt-3 text-sm text-[#4f5753]">No evidence files stored yet.</div>}</div></>}</div></div></div></section>;
}

function CTA({ children, inverted = false, onClick }: { children: React.ReactNode; inverted?: boolean; onClick?: () => void }) {
  return <button onClick={onClick} className={`pressable inline-flex items-center gap-3 border-2 border-[#101313] px-5 py-3 text-[13px] font-bold uppercase tracking-[.08em] ${inverted ? "bg-[#101313] text-[#f3f0e8] shadow-[6px_6px_0_#18d7c1]" : "bg-[#18d7c1] text-[#101313] shadow-[6px_6px_0_#101313]"}`}>{children}<ArrowRight size={16} /></button>;
}

export default function Home() {
  // The useAuth hook provides authentication state.
  // To implement login/logout, call logout(), or start login from an event
  // handler: onClick={() => startLogin()} (imported from "@/const"). Never call
  // startLogin() during render (no href={startLogin()}) — it mints a one-time
  // nonce cookie and must run only at the moment of navigation.
  let { user, loading, error, isAuthenticated, logout } = useAuth();

  const [activeStage, setActiveStage] = useState(1);
  const [menuOpen, setMenuOpen] = useState(false);
  const [faq, setFaq] = useState<number | null>(0);
  const scrollTo = (id: string) => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMenuOpen(false); };
  const pilot = () => toast("Pilot request pathway is in development — connect with the ReVolt team to discuss validation.");

  return <main className="noise min-h-screen bg-[#f3f0e8]">
    <header className="sticky top-0 z-50 border-b-2 border-[#101313] bg-[#f3f0e8]/95 backdrop-blur-sm">
      <div className="container flex h-[72px] items-center justify-between gap-6">
        <button className="flex items-center gap-3" onClick={() => scrollTo("top")} aria-label="Back to top">
          <img src={mark} alt="" className="h-9 w-9 object-contain" /><span className="text-[17px] font-extrabold tracking-[-.06em]">ReVolt<span className="text-[#149f92]">.ai</span></span>
        </button>
<nav className="hidden items-center gap-7 md:flex">
          {[['01', 'Why now', 'problem'], ['02', 'Workflow', 'workflow'], ['03', 'Evidence', 'evidence'], ['04', 'Kiosk', 'kiosk']].map(([n, label, id]) => <button key={id} onClick={() => scrollTo(id)} className="pressable nav-index mono text-[10px] font-bold uppercase tracking-[.14em] transition-colors hover:text-[#149f92]"><span className="mr-2 text-[#149f92]">{n}</span>{label}</button>)}