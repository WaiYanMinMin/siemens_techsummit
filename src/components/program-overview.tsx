"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type Speaker = {
  name: string;
  title?: string;
  company?: string;
  image?: string;
};

type AgendaItem = {
  title: string;
  description?: string;
  time: string;
  speakers?: Speaker[];
  notes?: string[];
};

type TrackId = "track1" | "track2" | "track3";

const morningAgenda: AgendaItem[] = [
  {
    title: "Siemens Technology Experience Zone opens",
    time: "9.00 – 10.00am",
  },
  {
    title: "Welcome Address",
    time: "10.15 – 10.25am",
    speakers: [
      {
        name: "Dr Thai Lai Pham",
        title: "CEO & President, ASEAN",
        company: "Siemens",
        image: "/speaker-dr-thai-lai-pham.jpg",
      },
    ],
  },
  {
    title:
      "Opening Remarks: Paving the Way to the Data- and AI-driven Future of Industry and Infrastructure",
    description:
      "Understand how data and AI are shaping the future of industry and infrastructure and gain practical strategies to what organizations can do today to stay competitive in an increasingly digital landscape.",
    time: "10.25 – 10.45am",
    speakers: [
      {
        name: "Dirk Didascalou",
        title: "Head of Foundational Technologies",
        company: "Siemens",
        image: "/speaker-dirk-didascalou.jpg",
      },
    ],
  },
  {
    title: "Singapore's AI Mission",
    description:
      "Learn more about Singapore's strategy in spearheading AI development and how organizations can align with national AI strategies to accelerate transformation and long-term competitiveness.",
    time: "10.45 – 11.05am",
    speakers: [
      { name: "Speaker TBC", title: "Company" },
      { name: "Cindy Koh (TBD)", title: "Executive Vice President", company: "EDB" },
      {
        name: "Ang Wee Seng (TBD)",
        title: "Executive Director",
        company: "Singapore Semiconductor Industry Association",
      },
      { name: "Tan Yew Kong (TBD)", title: "SVP, Asia Pacific", company: "Global Foundries" },
    ],
  },
  {
    title: "Launch of Eigen Engineering Agent",
    description:
      "AI-powered engineering assistant designed to accelerate design, automation, and decision-making across industrial and infrastructure workflows.",
    time: "11.05 – 11.20am",
  },
  {
    title:
      "Executive Panel Discussion: Industrial AI at Scale: Powering Smart, Sustainable Manufacturing",
    description:
      "Gain insights into how enterprises are unlocking scalable AI adoption by breaking down data silos, transforming legacy systems, and enabling AI-ready operations.",
    time: "11.20 – 11.50am",
    speakers: [
      {
        name: "Isabel Chong",
        title: "SVP Digital Industries, ASEAN",
        company: "Siemens",
      },
      { name: "Tan Yew Kong (TBD)", title: "SVP, Asia Pacific", company: "Global Foundries" },
      {
        name: "Ang Wee Seng (TBD)",
        title: "Executive Director",
        company: "Singapore Semiconductor Industry Association",
      },
      { name: "Cindy Koh (TBD)", title: "Executive Vice President", company: "EDB" },
    ],
  },
  {
    title: "Beyond Simulation: How Industrial AI Supercharges the Digital Twin",
    description:
      "Discover how Industrial AI delivers seamless data connectivity and rapid simulation, generating automated insights, intelligent behavior, and real-time validation that leads to faster, more reliable decisions.",
    time: "11.50 – 12.10pm",
    speakers: [
      { name: "TBD", title: "TBD", company: "TBD" },
    ],
  },
  {
    title: "Enabling Industrial AI: Financing Sustainable Infrastructure",
    description:
      "Uncover how organizations can address investment and financing needs to scale critical infrastructure that supports the growth of Industrial AI such as data centers, storage and assets for renewable energy.",
    time: "12.10pm – 12.30pm",
    speakers: [
      { name: "TBD", title: "TBD", company: "TBD" },
    ],
  },
  {
    title: "Lunch Networking & Siemens Technology Experience Zone",
    description: "Engage, network & discover at the Siemens Technology Experience Zone",
    time: "12.30 – 2.00pm",
  },
];

const afternoonTrack1Agenda: AgendaItem[] = [
  {
    title: "From Infrastructure to Intelligence: Transforming Modern Buildings",
    description:
      "Understand the shift to human-centric, outcome-driven design and how integrated building strategies across safety, security, energy, and comfort help future-proof buildings in a changing regulatory and sustainability landscape.",
    time: "2.15 – 2.30pm",
    speakers: [
      {
        name: "Damien Nirousset",
        title: "Head of SI Buildings, ASEAN & Japan",
        company: "Siemens",
        image: "/speaker-damien-nirousset.jpg",
      },
    ],
  },
  {
    title: "From Data to Decisions: Enabling Autonomous Buildings",
    description:
      "Learn how to unlock actionable insights from siloed building data and how to harness digital platforms to enable autonomous operations, improve efficiency, boost sustainability, and enhance occupant experience.",
    time: "2.30 – 2.45pm",
    speakers: [
      {
        name: "Derek Del Nevo",
        title: "Head of Software & Digital, Southeast Asia",
        company: "Siemens",
        image: "/speaker-derek-del-nevo.jpg",
      },
    ],
  },
  {
    title: "Sustainable Electrification",
    description:
      "Unlock how to optimize energy networks for higher uptime, reliability, asset utilization, cybersecurity, and energy efficiency to meet sustainability goals, enabled by innovations such as blue GIS with Clean Air and Electrification X.",
    time: "2.45 – 3.00pm",
    speakers: [
      {
        name: "Norman Ng",
        title: "Head of Electrification and Automation, Singapore",
        company: "Siemens",
        image: "/speaker-norman-ng.jpg",
      },
    ],
  },
  {
    title: "Building Cybersecurity: From Risk to Resilience",
    description:
      "Break down how and where to start in assessing and mitigating cybersecurity risks in smart buildings and discover how to turn cybersecurity into an enabler for digitalization and connectivity.",
    time: "3.00 – 3.15pm",
    speakers: [
      {
        name: "Vardaan Arora",
        title: "IT and Cybersecurity Lead, ASEAN",
        company: "Siemens",
        image: "/speaker-vardaan-arora.jpeg",
      },
    ],
  },
  {
    title: "Coffee Break Networking",
    time: "3.15 – 3.45pm",
  },
  {
    title: "[Panel & Presentation] Beyond Quick Wins: Scaling Decarbonization for Real Impact",
    description:
      "Move beyond early decarbonization wins by learning how to engage C-level early, integrate strategy and execution, and build scalable long-term net zero strategies through digitalization.",
    time: "3.45 – 4.15pm",
    speakers: [
      {
        name: "[Moderator] Bjoern Burbach",
        title: "EVP, Sustainability & Energy Performance Services",
        company: "Siemens",
        image: "/speaker-bjoern-burbach.png",
      },
    ],
    notes: ["Singapore Green Building Council", "Sustainable Energy Association of Singapore"],
  },
  {
    title: "Future-Proof Your Data Center: Digital Twins for End-to-End Excellence",
    description:
      "Learn how to tap into Siemens Digital Twin solutions to integrate data center systems, enabling full transparency, optimized design, and streamlined operations that support peak performance and sustainability.",
    time: "3.45 – 4.15pm",
    speakers: [
      {
        name: "Imelda Zhang",
        title: "Data Center Lead, ASEAN",
        company: "Siemens",
        image: "/speaker-imelda-zhang.jpeg",
      },
    ],
  },
  {
    title: "Ready or Not? Your Path to Autonomous Buildings",
    description:
      "Uncover common gaps in existing building infrastructure and learn how to assess digital maturity through a simple framework, and understand key factors to consider before modernization.",
    time: "4.30 – 4.45pm",
    speakers: [
      {
        name: "Michael Tiew",
        title: "Head of Portfolio and Sales Enablement",
        company: "Siemens",
        image: "/speaker-michael-tiew.jpg",
      },
    ],
  },
  {
    title: "Happy Hour Networking Session",
    description: "Connect with industry leaders at Happy Hour Networking Session",
    time: "4.45 – 6.15pm",
  },
];

const afternoonTrack2Agenda: AgendaItem[] = [
  {
    title: "The Future of Industrial Automation",
    description:
      "Discover how digitalization, industrial AI, and digital twins are transforming industrial automation into smarter, more resilient, and sustainable manufacturing ecosystems.",
    time: "2.15 – 2.30pm",
    speakers: [
      {
        name: "Isabel Chong",
        title: "SVP Digital Industries, ASEAN",
        company: "Siemens",
      },
    ],
  },
  {
    title: "In the Age of Industrial AI: Reimagining the Future of Intelligent Enterprises",
    description:
      "Learn how leading organizations are leveraging Industrial AI to unlock productivity, enhance resilience, and accelerate sustainable growth",
    time: "2.30 – 2.45pm",
    speakers: [{ name: "Dr. Ayesha Khanna" }],
  },
  {
    title: "Autonomous Manufacturing: Intelligence on the Factory Floor",
    description:
      "Unlock smarter manufacturing outcomes through autonomous technologies that drive flexibility, resilience, and operational excellence.",
    time: "2.45 – 3.00pm",
    speakers: [
      {
        name: "Sascha Maennl",
        title: "VP Sales Automation Solutions, Asia Pacific",
        company: "Siemens",
      },
    ],
  },
  {
    title: "Software-Defined Automation: Powering Agile Manufacturing",
    description:
      "Explore how software-defined automation enables agile manufacturing, accelerates digital transformation, and empowers organizations to build smarter, more adaptable factories.",
    time: "3.00 – 3.15pm",
    speakers: [
      {
        name: "Govin Manickam",
        title: "Technology Business Development Manager, ASEAN",
        company: "Siemens",
      },
    ],
  },
  {
    title: "Coffee Break Networking",
    time: "3.15 – 3.45pm",
  },
  {
    title: "A Single Pane of Glass for Smarter Operational Decisions",
    description:
      "See how manufacturers are leveraging unified digital platforms to optimize operations and accelerate data-driven decision-making.",
    time: "4.00 – 4.30pm",
    speakers: [
      {
        name: "Licheng Yan",
        title: "Account Development Manager – Industry Application",
        company: "Siemens",
      },
    ],
  },
  {
    title: "Panel Discussion: Overcoming Challenges to Fast-Track Advanced Technology Adoption",
    description:
      "This panel explores practical strategies for accelerating industrial AI and automation adoption by overcoming legacy systems, skill gaps, and organizational resistance through scalable innovation and strong partnerships.",
    time: "4.30 – 4.45pm",
    speakers: [
      {
        name: "Isabel Chong",
        title: "SVP Digital Industries, ASEAN",
        company: "Siemens",
      },
      { name: "Customer speaker TBD", title: "TBD", company: "TBD" },
      { name: "Moderator TBD", title: "TBD", company: "TBD" },
    ],
    notes: ["TBD", "TBD", "TBD"],
  },
  {
    title: "Cybersecure Industry: Protecting the Digital Factory",
    description:
      "Understand how secure-by-design strategies and continuous monitoring drive resilient, future-ready industrial operations.",
    time: "4.30 – 4.45pm",
    speakers: [{ name: "Speaker TBD", title: "TBD", company: "TBD" }],
  },
  {
    title: "Happy Hour Networking",
    description: "Connect with industry leaders at Happy Hour Networking Session",
    time: "4.45 – 6.15pm",
  },
];

const afternoonTrack3Agenda: AgendaItem[] = [
  {
    title: "Powering the next generation of AI with industrial metaverse",
    description:
      "Harness AI-powered digital twins to create dynamic industrial models and tap into the continuous virtual-physical feedback loop to improve design, validation, and optimization.",
    time: "2.15 – 2.30pm",
    speakers: [
      {
        name: "Wayne Chua",
        title: "Country Head – Singapore, Philippines, Brunei",
        company: "Siemens",
        image: "/speaker-wayne-chua.png",
      },
    ],
  },
  {
    title: "Design, Simulate, Optimize with Digital Twin Composer",
    description:
      "Find out how to leverage the industrial metaverse through Siemens Digital Twin Composer to enable virtual building, testing, and optimization; accelerating innovation before implementation and reducing operational risks.",
    time: "2.30 – 2.45pm",
    speakers: [
      {
        name: "Teh Tiack Ein",
        title: "Head of Presales Southeast Asia",
        company: "Siemens",
        image: "/speaker-teh-tiack-ein.png",
      },
    ],
  },
  {
    title: "Human-Machine Collaboration and Validation in Immersive Mechatronic Environment",
    description:
      "Experience immersive design in action through our live demonstration and see how immersive environments connect virtual design and physical prototypes to advance human-machine collaboration.",
    time: "2.45 – 3.00pm",
    speakers: [
      {
        name: "Sean Seneviratne",
        title: "Solutions Consultant",
        company: "Siemens",
        image: "/speaker-sean-seneviratne.jpeg",
      },
    ],
  },
  {
    title: "AI-Powered Engineering for Simulation & Test",
    description:
      "Witness how AI pushes the possibilities in simulation and testing, enhancing the accuracy, speed, and efficiency of engineering workflows to enable smarter designs and higher-quality products.",
    time: "3.00 – 3.15pm",
    speakers: [
      {
        name: "Winston Vigil, Manuel Raj",
        title: "Solutions Consultant",
        company: "Siemens",
        image: "/speaker-winston-vigil.png",
      },
    ],
  },
  {
    title: "Coffee Break Networking",
    time: "3.15 – 3.45pm",
  },
  {
    title:
      "Panel Discussion: Beyond the Pilot: How Singapore is Scaling Industrial AI for Measurable Impact Across Diverse Industries",
    description:
      "Delve into best practices for deploying Industrial AI to drive ROI, support upskilling, and accelerate the move toward autonomous operations and incremental business value.",
    time: "3.45 – 4.15pm",
    speakers: [{ name: "TBD", title: "TBD", company: "TBD" }],
    notes: ["TBD", "TBD", "TBD"],
  },
  {
    title: "AI Fabric for Industrial",
    description:
      "Explore how Altair RapidMiner helps organizations unify siloed data and build future-ready AI capabilities designed for the genAI era.",
    time: "4.15 – 4.30pm",
    speakers: [
      {
        name: "Shidan Murphy",
        title: "Presales Head, Banking & Financial Services APAC",
        company: "Siemens",
        image: "/speaker-shidan-murphy.jfif",
      },
    ],
  },
  {
    title: "Build Faster, Integrate Smarter: Low-Code Manufacturing with Mendix",
    description:
      "Explore how Mendix, the low-code engine of Siemens Xcelerator, enables manufacturers to modernize and scale operations without core system disruption.",
    time: "4.30 – 4.45pm",
    speakers: [
      {
        name: "Keith Chin",
        title: "Solutions Consultant",
        company: "Siemens",
        image: "/speaker-keith-chin.png",
      },
    ],
  },
  {
    title: "Happy Hour Networking Session",
    description: "Connect with industry leaders at Happy Hour Networking Session",
    time: "4.45 – 6.15pm",
  },
];

export function ProgramOverview() {
  const [activeTab, setActiveTab] = useState<"morning" | "afternoon">("morning");
  const [activeTrack, setActiveTrack] = useState<TrackId>("track1");
  const [isTrackMenuOpen, setIsTrackMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const afternoonTrackItems: Record<TrackId, AgendaItem[]> = {
    track1: afternoonTrack1Agenda,
    track2: afternoonTrack2Agenda,
    track3: afternoonTrack3Agenda,
  };
  const items = activeTab === "morning" ? morningAgenda : afternoonTrackItems[activeTrack];
  const trackLabels: Record<TrackId, string> = {
    track1: "Powering the Future of Autonomous Buildings",
    track2: "Smart Manufacturing with Industrial AI",
    track3: "Engineering the Industrial Metaverse",
  };

  useEffect(() => {
    const syncTabFromHash = () => {
      const hash = window.location.hash;
      if (hash === "#agenda-afternoon") {
        setActiveTab("afternoon");
      } else if (hash === "#agenda-morning" || hash === "#agenda") {
        setActiveTab("morning");
      }
    };

    syncTabFromHash();
    window.addEventListener("hashchange", syncTabFromHash);
    return () => window.removeEventListener("hashchange", syncTabFromHash);
  }, []);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;

    const nodes = Array.from(root.querySelectorAll<HTMLElement>(".agenda-item"));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
          }
        });
      },
      { root, threshold: 0.08 },
    );

    nodes.forEach((node) => {
      node.classList.add("reveal-on-scroll");
      observer.observe(node);
    });

    return () => observer.disconnect();
  }, [activeTab, activeTrack]);

  return (
    <section id="agenda" className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12">
      <div className="mx-auto w-full max-w-6xl">
        <span id="agenda-morning" className="block h-0 w-0" />
        <span id="agenda-afternoon" className="block h-0 w-0" />
      

        <div className="inline-flex overflow-hidden rounded-md border border-white/25 bg-white text-[#111]">
          <button
            type="button"
            onClick={() => {
              setActiveTab("morning");
              setIsTrackMenuOpen(false);
            }}
            className={`hitech-interactive px-2 py-2 text-xs font-semibold transition sm:px-4 sm:text-base ${
              activeTab === "morning" ? "bg-[#11d3b7]" : "bg-white"
            }`}
          >
            Morning plenary
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("afternoon")}
            className={`hitech-interactive px-2 py-2 text-xs font-semibold transition sm:px-4 sm:text-base ${
              activeTab === "afternoon" ? "bg-[#11d3b7]" : "bg-white"
            }`}
          >
            Afternoon Breakout Tracks
          </button>
        </div>

        <div
          ref={scrollRef}
          className="program-scroll mt-5 h-[78vh] overflow-y-auto rounded-md border border-white/20 px-4 pb-3"
        >
          {activeTab === "afternoon" && (
            <div className="sticky top-0 z-20 bg-[#000029] pt-3">
              <div className="mx-auto hidden w-full max-w-4xl flex-wrap overflow-hidden rounded-md border border-white/25 bg-white text-[#111] md:flex">
                <button
                  type="button"
                  onClick={() => setActiveTrack("track1")}
                  className={`hitech-interactive flex-1 px-2 py-2 text-center text-xs font-semibold leading-tight transition sm:px-3 sm:text-sm ${
                    activeTrack === "track1" ? "bg-[#11d3b7]" : "bg-white"
                  }`}
                >
                  Powering the Future of Autonomous Buildings
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrack("track2")}
                  className={`hitech-interactive flex-1 px-2 py-2 text-center text-xs font-semibold leading-tight transition sm:px-3 sm:text-sm ${
                    activeTrack === "track2" ? "bg-[#11d3b7]" : "bg-white"
                  }`}
                >
                  Smart Manufacturing with Industrial AI
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTrack("track3")}
                  className={`hitech-interactive flex-1 px-2 py-2 text-center text-xs font-semibold leading-tight transition sm:px-3 sm:text-sm ${
                    activeTrack === "track3" ? "bg-[#11d3b7]" : "bg-white"
                  }`}
                >
                  Engineering the Industrial Metaverse
                </button>
              </div>

              <div className="relative md:hidden">
                <button
                  type="button"
                  onClick={() => setIsTrackMenuOpen((prev) => !prev)}
                  className="hitech-interactive inline-flex w-full items-center justify-between rounded-md border border-white/25 bg-white px-3 py-2 text-left text-xs font-semibold text-[#111]"
                >
                  <span className="pr-3">{trackLabels[activeTrack]}</span>
                  <span>{isTrackMenuOpen ? "▲" : "≡"}</span>
                </button>

                {isTrackMenuOpen && (
                  <div className="absolute left-0 right-0 top-[44px] z-30 rounded-md border border-white/20 bg-[#02023e] p-1 shadow-lg">
                    {(
                      [
                        ["track1", trackLabels.track1],
                        ["track2", trackLabels.track2],
                        ["track3", trackLabels.track3],
                      ] as const
                    ).map(([trackId, label]) => (
                      <button
                        key={trackId}
                        type="button"
                        onClick={() => {
                          setActiveTrack(trackId);
                          setIsTrackMenuOpen(false);
                        }}
                        className={`hitech-interactive mb-1 block w-full rounded px-3 py-2 text-left text-xs font-semibold ${
                          activeTrack === trackId
                            ? "bg-[#11d3b7] text-[#03263b]"
                            : "bg-transparent text-white"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mt-6 pb-20">
            {items.map((item) => (
              <article
                key={`${item.title}-${item.time}`}
                className="agenda-item border-b border-white/35 py-6 first:pt-0"
              >
                <h3 className="text-lg font-semibold leading-tight text-[#00d7c7] sm:text-xl">{item.title}</h3>
                {item.description && (
                  <p className="mt-2 text-sm leading-7 text-white/95 sm:text-base">
                    {item.description}
                  </p>
                )}

                <div className="mt-3 flex items-center gap-3 text-sm sm:text-base">
                  <span className="inline-block h-6 w-6 bg-white" />
                  <span>{item.time}</span>
                </div>

                {item.speakers && item.speakers.length > 0 && (
                  <div className="mt-4 grid gap-4 sm:grid-cols-2">
                    {item.speakers.map((speaker) => (
                      <div key={`${item.title}-${speaker.name}`} className="flex items-center gap-3">
                        {speaker.image ? (
                          <Image
                            src={speaker.image}
                            alt={speaker.name}
                            width={72}
                            height={72}
                            className="h-[72px] w-[72px] rounded-full object-cover"
                          />
                        ) : (
                          <span className="inline-block h-[72px] w-[72px] rounded-full bg-white/15" />
                        )}
                        <div className="text-white">
                          <p className="text-base font-semibold leading-tight sm:text-lg">{speaker.name}</p>
                          {speaker.title && (
                            <p className="text-sm leading-tight text-white/90 sm:text-base">{speaker.title}</p>
                          )}
                          {speaker.company && (
                            <p className="text-sm leading-tight text-white/90 sm:text-base">{speaker.company}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {item.notes && item.notes.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/90 sm:text-base">
                    {item.notes.map((note, index) => (
                      <p key={`${item.title}-${note}-${index}`}>{note}</p>
                    ))}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="sticky bottom-3 z-20 flex justify-center py-2">
            <a
              href="#register"
              className="hitech-interactive inline-flex h-12 items-center rounded-sm bg-[#7de6d5] px-10 text-base font-bold text-[#00153b] transition hover:brightness-95"
            >
              Register Now
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
