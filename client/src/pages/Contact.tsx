import { ArrowLeft, ArrowRight, ArrowUpRight, CircleDot, Mail, Phone } from "lucide-react";
import { useState } from "react";
import { Link } from "wouter";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

const EMAIL = "mailto:team.revoltai4ewaste@gmail.com";
const PHONE = "tel:+918445863004";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const submitInquiry = trpc.contact.submit.useMutation({
    onSuccess: () => {
      setSubmitted(true);
      toast("Inquiry recorded. The ReVolt pilot desk will follow up.");
    },
    onError: (error) =>
      toast(error.message || "We could not record the inquiry. Please try again."),
  });

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    submitInquiry.mutate({
      name: String(data.get("name") || ""),
      email: String(data.get("email") || ""),
      company: String(data.get("company") || ""),
      phone: String(data.get("phone") || ""),
      message: String(data.get("message") || ""),
    });
  };

  return (
    <main className="noise min-h-screen overflow-hidden bg-[#f3f0e8] text-[#101313]">

      <header className="border-b-2 border-[#101313] bg-[#f3f0e8]">
        <div className="container flex h-[72px] items-center justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-3"
            aria-label="Back to ReVolt AI home"
          >
            <span className="grid h-9 w-9 place-items-center border-2 border-[#101313] bg-[#fffdf7] text-xs font-black">
              R
            </span>

            <span className="text-[17px] font-extrabold tracking-[-.06em]">
              ReVolt<span className="text-[#149f92]">.AI</span>
            </span>
          </Link>

          <Link
            href="/"
            className="inline-flex items-center gap-2 border-b-2 border-[#101313] pb-1 text-[11px] font-bold uppercase tracking-[.1em]"
          >
            <ArrowLeft size={15} />
            Back to site
          </Link>
        </div>
      </header>

      <section className="relative border-b-2 border-[#101313] bg-[#101313] py-20 text-[#f3f0e8] md:py-28">
        <div className="container relative">

          <div className="absolute right-0 top-0 hidden rotate-6 border-2 border-[#18d7c1] px-4 py-3 mono text-[10px] uppercase text-[#18d7c1] md:block">
            FOUNDER / CEO
          </div>

          <div className="eyebrow mb-8 text-[#18d7c1]">
            CONTACT / INQUIRY FORM
          </div>

          <h1 className="display max-w-[830px] text-[clamp(58px,11vw,150px)] leading-[.83]">
            ReVolt present's 
            <br />
            <span className="font-serif font-normal italic text-[#18d7c1]">
              Tejasv Sahu
            </span>
            <br />
            Founder & CEO
            <br />
            ReVolt AI
          </h1>

          <div className="mt-12 grid max-w-[460px] gap-8 md:grid-cols-[1fr_.7fr] md:items-end">
            <p className="text-2xl font-extrabold uppercase leading-tight">
              Tejasv Sahu is building ReVolt AI, an AI-enabled IT asset
              disposition platform focused on making retired enterprise
              hardware secure, traceable, and auditable. ReVolt AI combines
              secure collection, verified data erasure, chain-of-custody
              tracking, and serialized evidence into a unified workflow —
              turning e-waste disposal from a fragmented process into a
              provable digital record.
            </p>

            <p className="mono text-[10px] uppercase tracking-[.12em] text-[#8d938d]">
              evidence-first / secure / serialized / auditable
            </p>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-5 right-[11%] h-10 w-10 animate-pulse border-2 border-[#e8f05a] bg-[#e8f05a]" />
      </section>

      <section className="border-b-2 border-[#101313] py-16 md:py-24">
        <div className="container grid gap-12 lg:grid-cols-[.68fr_1.32fr]">

          <aside>
            <div className="eyebrow mb-5 text-[#149f92]">
              01 / CONTACT NODE / REVOLT AI
            </div>

            <h2 className="display text-5xl md:text-7xl">
              START
              <br />
              <span className="font-serif font-normal italic text-[#149f92]">
                the
              </span>
              <br />
              CONVERSATION.
            </h2>

            <p className="mt-6 max-w-[330px] text-sm leading-relaxed text-[#4f5753]">
              A direct contact point for enterprise pilots, technology
              partnerships, investors, and organizations looking to build a
              more secure and auditable e-waste workflow.
            </p>

            <div className="mt-10 space-y-5">

              <a
                href={EMAIL}
                className="group flex items-center gap-4 border-t-2 border-[#101313] pt-4"
              >
                <span className="grid h-10 w-10 place-items-center border-2 border-[#101313] bg-[#18d7c1] transition-transform group-hover:rotate-6">
                  <Mail size={18} />
                </span>

                <span>
                  <span className="mono block text-[9px] font-bold uppercase tracking-[.1em] text-[#149f92]">
                    Email / ReVolt AI
                  </span>

                  <span className="font-extrabold">
                    {EMAIL.replace("mailto:", "")}
                  </span>
                </span>
              </a>

              <a
                href={PHONE}
                className="group flex items-center gap-4 border-t-2 border-[#101313] pt-4"
              >
                <span className="grid h-10 w-10 place-items-center border-2 border-[#101313] bg-[#e8f05a] transition-transform group-hover:-rotate-6">
                  <Phone size={18} />
                </span>

                <span>
                  <span className="mono block text-[9px] font-bold uppercase tracking-[.1em] text-[#149f92]">
                    Phone / ReVolt AI
                  </span>

                  <span className="font-extrabold">
                    {PHONE.replace("tel:", "")}
                  </span>
                </span>
              </a>

            </div>
          </aside>

          <div className="relative border-2 border-[#101313] bg-[#fffdf7] p-5 shadow-[10px_10px_0_#101313] md:p-8">

            <div className="absolute right-5 top-5 rotate-3 border-2 border-[#101313] bg-[#e8f05a] px-3 py-2 mono text-[9px] font-bold uppercase">
              PILOT / INQUIRY
            </div>

            <div className="border-2 border-dashed border-[#101313]/35 p-5 md:p-8">

              <div className="mb-8 flex items-center justify-between gap-4 border-b-2 border-[#101313] pb-4">
                <div>
                  <div className="eyebrow text-[#149f92]">
                    ReVolt AI / Evidence Layer
                  </div>

                  <h2 className="mt-2 text-2xl font-extrabold uppercase">
                    Start the next record.
                  </h2>
                </div>

                <div className="display text-4xl text-[#149f92]">
                  RV
                </div>
              </div>

              <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">

                <label className="text-xs font-bold uppercase">
                  Name / Your name
                  <input
                    required
                    name="name"
                    placeholder="Your name"
                    className="mt-2 w-full border-2 border-[#101313] bg-[#f3f0e8] p-3 text-sm outline-none focus:border-[#149f92]"
                  />
                </label>

                <label className="text-xs font-bold uppercase">
                  Email / Work email
                  <input
                    required
                    name="email"
                    type="email"
                    placeholder="you@company.com"
                    className="mt-2 w-full border-2 border-[#101313] bg-[#f3f0e8] p-3 text-sm outline-none focus:border-[#149f92]"
                  />
                </label>

                <label className="text-xs font-bold uppercase">
                  Company / Organization
                  <input
                    required
                    name="company"
                    placeholder="Company or organization"
                    className="mt-2 w-full border-2 border-[#101313] bg-[#f3f0e8] p-3 text-sm outline-none focus:border-[#149f92]"
                  />
                </label>

                <label className="text-xs font-bold uppercase">
                  Phone / Contact number
                  <input
                    required
                    name="phone"
                    placeholder="+91 XXXXX XXXXX"
                    className="mt-2 w-full border-2 border-[#101313] bg-[#f3f0e8] p-3 text-sm outline-none focus:border-[#149f92]"
                  />
                </label>

                <label className="text-xs font-bold uppercase md:col-span-2">
                  Message / Tell us what you need
                  <textarea
                    required
                    name="message"
                    rows={4}
                    placeholder="Tell us about your retired IT assets, data-erasure requirements, e-waste workflow, pilot opportunity, partnership, or investment interest."
                    className="mt-2 w-full resize-y border-2 border-[#101313] bg-[#f3f0e8] p-3 text-sm outline-none focus:border-[#149f92]"
                  />
                </label>

                <div className="flex flex-col items-start justify-between gap-4 border-t-2 border-[#101313] pt-4 sm:flex-row sm:items-center md:col-span-2">

                  <span className="mono text-[9px] uppercase tracking-[.1em] text-[#4f5753]">
                    {submitInquiry.isPending
                      ? "Recording / please wait"
                      : submitted
                        ? "Recorded / thank you"
                        : "Required / all fields"}
                  </span>

                  <button
                    disabled={submitInquiry.isPending || submitted}
                    className="pressable inline-flex items-center gap-3 border-2 border-[#101313] bg-[#18d7c1] px-5 py-3 text-xs font-bold uppercase shadow-[5px_5px_0_#101313] disabled:opacity-60"
                  >
                    {submitted ? "Recorded" : "Send inquiry"}
                    <ArrowRight size={16} />
                  </button>

                </div>
              </form>
            </div>

            <div className="mt-4 flex items-center justify-between mono text-[9px] uppercase tracking-[.12em] text-[#4f5753]">
              <span>Record / ready</span>

              <span className="flex items-center gap-2">
                ReVolt AI
                <ArrowUpRight size={13} />
              </span>
            </div>

          </div>
        </div>
      </section>

      <section className="border-b-2 border-[#101313] bg-[#e8f05a] py-12">
        <div className="container flex flex-col justify-between gap-6 md:flex-row md:items-center">

          <div className="display text-4xl md:text-6xl">
            SECURE / SERIALIZE / VERIFY
          </div>

          <p className="max-w-[350px] text-sm font-bold uppercase leading-relaxed">
            Using technology to make e-waste disposal secure, traceable,
            and auditable.
          </p>

        </div>
      </section>

      <footer className="bg-[#101313] py-8 text-[#f3f0e8]">
        <div className="container flex flex-col justify-between gap-4 text-xs md:flex-row">
          <span>ReVolt.AI</span>

          <Link href="/" className="text-[#18d7c1] hover:underline">
            Return to SITE
          </Link>
        </div>
      </footer>

    </main>
  );
}