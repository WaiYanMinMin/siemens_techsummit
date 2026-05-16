import Image from "next/image";

import { FloatingRegisterCta } from "@/components/floating-register-cta";
import { ProgramOverview } from "@/components/program-overview";
import { RegistrationFormShell } from "@/components/registration-form-shell";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <div className="bg-[#000029] text-slate-900">
      <SiteHeader />
      <main className="w-full">
        <ScrollReveal>
          <section className="bg-[#000029] pb-10 text-white sm:pb-12">
            <div className="relative isolate lg:grid lg:min-h-[560px] lg:grid-cols-[minmax(0,40%)_minmax(0,60%)]">
              <div
                className="pointer-events-none absolute inset-0 overflow-hidden bg-[#000029] lg:hidden"
                aria-hidden
              >
                <div className="absolute -right-[8%] top-0 h-[min(58vh,440px)] w-[min(105vw,520px)] sm:-right-[4%] sm:h-[min(62vh,500px)] sm:w-[min(100vw,560px)]">
                  <Image
                    src="/key_visual_mobile.png"
                    alt=""
                    fill
                    className="object-contain object-right object-top"
                    sizes="100vw"
                    priority
                  />
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(105deg,#000029_0%,#000029_20%,rgba(0,0,41,0.9)_38%,rgba(0,0,41,0.55)_55%,rgba(0,0,41,0.2)_72%,transparent_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(to_top,#000029_0%,rgba(0,0,41,0.75)_18%,transparent_42%)]" />
              </div>

              <div className="relative z-10 flex min-h-[min(480px,78svh)] flex-col justify-start px-6 py-12 sm:px-10 sm:py-14 lg:min-h-[560px] lg:justify-center lg:bg-[#000029] lg:pl-12 lg:pr-10 lg:py-16 xl:pl-16">
                <h1 className="max-lg:[text-shadow:0_2px_24px_rgba(0,0,41,0.95)] text-4xl font-bold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-[52px] xl:text-[58px]">
                  Make <span className="text-[#00d7c7]">AI</span> Real
                </h1>
                <p className="mt-4 max-lg:[text-shadow:0_1px_16px_rgba(0,0,41,0.92)] text-xl font-medium leading-snug text-white sm:text-2xl lg:text-[26px]">
                  Siemens Tech Summit 2026
                </p>
                <p className="mt-8 max-w-md max-lg:[text-shadow:0_1px_14px_rgba(0,0,41,0.9)] text-base leading-relaxed text-white sm:text-lg">
                  Singapore, 1 July 2026
                  <br />
                  Raffles City Convention Centre
                </p>
                <a
                  href="#register"
                  className="blink-cta hitech-interactive mt-10 inline-flex h-12 w-fit items-center rounded-sm bg-[#00d7c7] px-8 text-sm font-bold text-[#000029] transition hover:brightness-95 sm:text-base"
                >
                  Register today
                </a>
              </div>

              <div className="relative hidden min-h-[560px] lg:col-start-2 lg:block">
                <Image
                  src="/key_visual.png"
                  alt="Siemens Tech Summit — immersive technology and industry visualization"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 0px, 60vw"
                  priority
                />
              </div>
            </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12">
            <div className="mx-auto w-full max-w-6xl lg:max-w-[88rem] xl:max-w-[96rem]">
              <div className="flex flex-col gap-6 md:gap-10 lg:grid lg:grid-cols-[minmax(0,1.62fr)_minmax(0,1fr)] lg:items-start lg:gap-12 xl:gap-14">
                <h2 className="text-center text-3xl font-bold leading-[1.08] tracking-tight text-white sm:text-4xl lg:col-start-2 lg:row-start-1 lg:text-left lg:text-5xl">
                  Make <span className="text-[#00d7c7]">AI</span> Real
                </h2>

                <div className="lg:col-start-1 lg:row-span-2 lg:row-start-1">
                  <div className="relative aspect-video w-full overflow-hidden rounded-sm border border-white/10 bg-black shadow-[0_24px_48px_rgba(0,0,0,0.35)]">
                    <video
                      className="absolute inset-0 block h-full w-full object-contain object-center"
                      controls
                      playsInline
                      preload="metadata"
                    >
                      <source src="/siemens-trailer-16x9.mp4" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>

                  <a
                    href="#register"
                    className="hitech-interactive mt-4 inline-flex h-10 items-center rounded-sm bg-[#7de6d5] px-6 text-xs font-bold text-[#00153b] transition hover:brightness-95 sm:mt-6 md:mt-8 sm:h-11 sm:px-7 sm:text-sm"
                  >
                    Register Now
                  </a>
                </div>

                <div className="space-y-6 text-left text-sm leading-7 text-white/95 sm:text-base lg:col-start-2 lg:row-start-2">
                  <p>
                    In a world defined by scarce raw materials, rising energy
                    prices, skilled labor shortages, and geopolitical tensions,
                    companies must accelerate innovation, boost productivity,
                    and scale rapidly amid volatility. The game changer:{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      Industrial AI.
                    </span>
                  </p>

                  <p>
                    <span className="font-semibold text-[#00d7c7]">
                      Siemens Tech Summit 2026
                    </span>{" "}
                    brings together forward-thinking leaders ready to turn{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      Industrial AI
                    </span>{" "}
                    into real impact for industry and infrastructure. At this
                    event, we empower organizations to become true{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      Digital Enterprises
                    </span>{" "}
                    by combining the real and digital worlds with Siemens
                    expertise in industrial software, automation,
                    electrification, and{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      Industrial AI
                    </span>
                    .
                  </p>

                  <p>
                    Through immersive live demonstrations, expert-led deep dive
                    sessions, and proven customer success stories, you will gain
                    actionable strategies to bring{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      industrial intelligence
                    </span>{" "}
                    into the{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      digital enterprise
                    </span>
                    , so as to design, manufacture, and build products and
                    infrastructure more efficiently, intelligently, and faster
                    than ever before.
                  </p>

                  <p>
                    If you&apos;re looking to discover what you can do with{" "}
                    <span className="font-semibold text-[#00d7c7]">
                      Industrial AI
                    </span>{" "}
                    today?
                  </p>
                  <p className="border-l-2 border-[#00d7c7] pl-4 text-base font-semibold leading-relaxed text-[#00d7c7] sm:text-lg">
                    Join us at Siemens Tech Summit 2026 to accelerate
                    innovation, enable smarter decision-making, and prepare your
                    organization for an AI-powered future.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        <div className="relative">
          <ScrollReveal>
            <section
              id="highlights"
              className="scroll-mt-[72px] bg-[#000029] px-5 py-4 text-white sm:px-8 sm:py-14 sm:scroll-mt-[80px] lg:px-12"
            >
              <div className="mx-auto w-full max-w-6xl">
                <h2 className="text-center text-2xl font-bold sm:text-3xl">
                  Siemens Tech Summit Highlights
                </h2>

                <div className="mt-10 grid gap-10 md:grid-cols-3 md:items-stretch">
                  <article className="flex h-full flex-col">
                    <div className="flex h-[140px] w-full shrink-0 items-end justify-start">
                      <Image
                        src="/highlight-opening-plenary.png"
                        alt="Opening plenary icon"
                        width={180}
                        height={130}
                        className="h-auto max-h-[132px] w-auto max-w-full object-contain object-bottom"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl">
                      Opening plenary
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-7 text-white/90">
                      Gain insights from industry leaders on how Industrial AI
                      is transforming manufacturing, infrastructure, and
                      buildings in Singapore. Discover how organizations can use
                      data and emerging technologies to build smarter, more
                      resilient, and sustainable operations while preparing for
                      an Industrial AI-ready future.
                    </p>
                    <div className="mt-auto flex min-h-[3.25rem] flex-col justify-end pt-6">
                      <a
                        href="#agenda-morning"
                        className="hitech-interactive inline-flex rounded px-1 text-xl font-semibold text-[#00d7c7] transition hover:text-[#7de6d5]"
                      >
                        &#8250; View morning plenary program
                      </a>
                    </div>
                  </article>

                  <article className="flex h-full flex-col">
                    <div className="flex h-[140px] w-full shrink-0 items-end justify-start">
                      <Image
                        src="/highlight-tech-deep-dive.png"
                        alt="Tech deep dive icon"
                        width={180}
                        height={130}
                        className="h-auto max-h-[132px] w-auto max-w-full object-contain object-bottom"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl">
                      Tech deep dive
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-7 text-white/90">
                      Select from three dynamic breakout tracks, each designed
                      to match your domain expertise and strategic priorities.
                      Dive into high-impact topics and discover forward-thinking
                      ideas, connect with experts, and turn insights into
                      action.
                    </p>
                    <div className="mt-auto flex min-h-[3.25rem] flex-col justify-end pt-6">
                      <a
                        href="#agenda-afternoon"
                        className="hitech-interactive inline-flex rounded px-1 text-xl font-semibold text-[#00d7c7] transition hover:text-[#7de6d5]"
                      >
                        &#8250; View afternoon breakout tracks
                      </a>
                    </div>
                  </article>

                  <article className="flex h-full flex-col">
                    <div className="flex h-[140px] w-full shrink-0 items-end justify-start">
                      <Image
                        src="/highlight-tech-in-action.png"
                        alt="Tech in action icon"
                        width={180}
                        height={130}
                        className="h-auto max-h-[132px] w-auto max-w-full object-contain object-bottom"
                      />
                    </div>
                    <h3 className="mt-6 text-xl font-semibold leading-tight sm:text-2xl">
                      Tech in action
                    </h3>
                    <p className="mt-5 flex-1 text-sm leading-7 text-white/90">
                      Explore immersive, interactive zones showcasing how
                      organizations can harness Industrial AI to drive higher
                      efficiency, lower carbon emissions, and greater
                      operational resilience while scaling solutions for the
                      future.
                    </p>
                    <div
                      className="mt-auto min-h-[3.25rem] pt-6"
                      aria-hidden="true"
                    />
                  </article>
                </div>
              </div>
            </section>
          </ScrollReveal>

          <div
            id="sticky-start-marker"
            className="flex justify-center px-5 py-2 sm:px-8 sm:py-6 lg:px-12"
          >
            <a
              href="#register"
              className="hitech-interactive inline-flex h-10 items-center rounded-sm bg-[#7de6d5] px-6 text-xs font-bold text-[#00153b] transition hover:brightness-95 sm:h-11 sm:px-8 sm:text-sm"
            >
              Register Now
            </a>
          </div>

          <ScrollReveal>
            <ProgramOverview />
          </ScrollReveal>

          <div
            id="sticky-end-marker"
            className="flex justify-center px-5 py-4 sm:px-8 sm:py-8 lg:px-12"
          >
            <a
              href="#register"
              className="hitech-interactive inline-flex h-10 items-center rounded-sm bg-[#7de6d5] px-6 text-xs font-bold text-[#00153b] transition hover:brightness-95 sm:h-11 sm:px-8 sm:text-sm"
            >
              Register Now
            </a>
          </div>
        </div>
        <FloatingRegisterCta
          startId="sticky-start-marker"
          endId="sticky-end-marker"
        />

        <ScrollReveal>
          <section
            id="register"
            className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12"
          >
            <div className="mx-auto w-full max-w-6xl rounded-xl border border-white/20 bg-[#02023e] p-6 sm:p-8">
              <h2 className="text-2xl font-bold text-[#00d7c7]">
                Summit Registration
              </h2>
              <p className="mt-2 text-sm text-white/85">
                Please complete the form below.
              </p>
              <div className="mt-6">
                <RegistrationFormShell />
              </div>
            </div>
          </section>
        </ScrollReveal>
      </main>
      <footer className="border-t border-white/10 bg-[#000029] px-5 py-5 text-center text-sm text-white/80 sm:px-8 lg:px-12">
        <p>Siemens Tech Summit 2026. All Rights Reserved.</p>
        <p className="mt-1">Powered By OOFFLE</p>
      </footer>
    </div>
  );
}
