import Image from "next/image";

import { ProgramOverview } from "@/components/program-overview";
import { RegistrationFormShell } from "@/components/registration-form-shell";
import { SiteHeader } from "@/components/site-header";
import { ScrollReveal } from "@/components/scroll-reveal";

export default function Home() {
  return (
    <div className="bg-slate-50 text-slate-900">
      <SiteHeader />
      <main className="w-full">
        <ScrollReveal>
          <section className="bg-[#000029] px-5 py-10 text-white sm:px-8 sm:py-12 lg:px-12">
          <div className="mx-auto w-full max-w-7xl">
            <div className="relative rounded-sm lg:min-h-[560px]">
              <div className="relative z-10 max-w-xl py-4 lg:absolute lg:left-2 lg:top-1/2 lg:w-[44%] lg:-translate-y-1/2">
                <h1 className="text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[62px]">
                Siemens
                <br />
                Tech Summit 2026
                </h1>
                <p className="mt-5 max-w-md text-lg font-semibold leading-tight text-[#009999] sm:text-2xl">
                  Experience the Future
                  <br />
                  through Sustainable Digitalization
                </p>
                <p className="mt-7 text-base text-white/90 sm:text-lg">
                  Singapore, 1 July 2026
                  <br />
                  Raffles City Convention Centre
                </p>
                <a
                  href="#register"
                  className="hitech-interactive mt-8 inline-flex h-12 items-center rounded-sm bg-[#7de6d5] px-8 text-base font-bold text-[#00153b] transition hover:brightness-95"
                >
                  Register Now
                </a>
              </div>

              <div className="relative mt-6 w-full lg:mt-0 lg:pl-[24%]">
              <Image
                src="/key_visual.png"
                alt="Siemens Tech Summit infinity key visual"
                width={2200}
                height={1200}
                priority
                className="h-auto w-full object-contain"
              />
              </div>
            </div>
          </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section id="highlights" className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-center text-3xl font-bold leading-tight text-[#00d7c7] sm:text-4xl">
              Powering the Future through Sustainable Digitalization
            </h2>

            <div className="mt-10 grid gap-10 lg:grid-cols-[0.95fr_1.35fr] lg:items-start">
              <div>
               
                <video
                  className="w-full rounded-sm border border-white/10 bg-black"
                  controls
                  playsInline
                  preload="metadata"
                >
                  <source src="/siemens-trailer-16x9.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                <a
                  href="#register"
                  className="hitech-interactive mt-8 inline-flex h-12 items-center rounded-sm bg-[#7de6d5] px-8 text-base font-bold text-[#00153b] transition hover:brightness-95"
                >
                  Register Now
                </a>
              </div>

              <div className="space-y-6 text-sm leading-7 text-white/95 sm:text-base">
                <p>
                  In today&apos;s rapidly evolving landscape, digital transformation and
                  sustainability are not just priorities, they are competitive advantages.
                  <span className="text-[#00d7c7]"> Siemens Tech Summit </span>
                  is where forward-thinking leaders come to turn these imperatives into action.
                </p>

                <p>
                  At <span className="text-[#00d7c7]">Siemens Tech Summit</span>, you will not
                  just hear about the future, you will see it in experience it. Through
                  immersive live demonstrations, expert-led deep dive sessions, and proven
                  customer success stories, you will gain practical strategies to accelerate
                  your digital journey and meet your sustainability targets with confidence.
                </p>

                <p>
                  Whether you are looking to optimize operations, drive growth, or lead your
                  industry in environmental responsibility, this is your opportunity to connect,
                  learn, and transform.
                </p>

                <p className="text-[#00d7c7]">
                  Join us to unlock innovation, power smarter decisions, and build a greener,
                  more resilient future. <span className="text-xl font-semibold">Starting today.</span>
                </p>
              </div>
            </div>
          </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <section className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12">
          <div className="mx-auto w-full max-w-6xl">
            <h2 className="text-center text-2xl font-bold sm:text-3xl">Siemens Tech Summit Highlights</h2>

            <div className="mt-10 grid gap-10 md:grid-cols-3">
              <article>
                <Image
                  src="/highlight-opening-plenary.png"
                  alt="Opening plenary icon"
                  width={180}
                  height={130}
                  className="h-[120px] w-auto"
                />
                <h3 className="mt-8 text-xl font-semibold leading-tight sm:text-2xl">Opening plenary</h3>
                <p className="mt-5 text-sm leading-7 text-white/90">
                  Gain insights from industry leaders as they share how sustainable
                  digitalization is transforming Singapore&apos;s built environment and
                  manufacturing sectors. Discover how innovation, data, and green
                  technologies are driving smarter, more efficient, and future-ready
                  industries.
                </p>
                <a
                  href="#agenda-morning"
                  className="hitech-interactive mt-6 inline-flex rounded px-1 text-xl font-semibold text-[#00d7c7] transition hover:text-[#7de6d5]"
                >
                  &#8250; View morning plenary program
                </a>
              
              </article>

              <article>
                <Image
                  src="/highlight-tech-deep-dive.jpg"
                  alt="Tech deep dive icon"
                  width={180}
                  height={130}
                  className="h-[120px] w-auto"
                />
                <h3 className="mt-8 text-xl font-semibold leading-tight sm:text-2xl">Tech deep dive</h3>
                <p className="mt-5 text-sm leading-7 text-white/90">
                  Select from three dynamic breakout tracks, each designed to match your
                  domain expertise and strategic priorities. Dive into high-impact topics
                  and discover forward-thinking ideas, connect with experts, and turn
                  insights into action.
                </p>
                <a
                  href="#agenda-afternoon"
                  className="hitech-interactive mt-6 inline-flex rounded px-1 text-xl font-semibold text-[#00d7c7] transition hover:text-[#7de6d5]"
                >
                  &#8250; View afternoon breakout tracks
                </a>
            
              </article>

              <article>
                <Image
                  src="/highlight-tech-in-action.png"
                  alt="Tech in action icon"
                  width={180}
                  height={130}
                  className="h-[120px] w-auto"
                />
                <h3 className="mt-8 text-xl font-semibold leading-tight sm:text-2xl">Tech in action</h3>
                <p className="mt-5 text-sm leading-7 text-white/90">
                  Explore immersive, interactive zones that demonstrate how organizations
                  can streamline operations, boost productivity, and reduce environmental
                  impact at the same time. Experience real-world solutions in action,
                  delivering measurable results such as higher efficiency, lower carbon
                  emissions, and greater operational resilience.
                </p>
              </article>
            </div>

            <div className="mt-10 flex justify-center">
              <a
                href="#register"
                className="hitech-interactive inline-flex h-12 items-center rounded-sm bg-[#7de6d5] px-10 text-base font-bold text-[#00153b] transition hover:brightness-95"
              >
                Register Now
              </a>
            </div>
          </div>
          </section>
        </ScrollReveal>

        <ScrollReveal>
          <ProgramOverview />
        </ScrollReveal>

        <ScrollReveal>
          <section
          id="register"
          className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12"
        >
          <div className="mx-auto w-full max-w-6xl rounded-xl border border-white/20 bg-[#02023e] p-6 sm:p-8">
            <h2 className="text-2xl font-bold text-[#00d7c7]">Summit Registration</h2>
            <p className="mt-2 text-sm text-white/85">
              Complete the form below. After successful registration, we will send
              your QR access details closer to the event date.
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
