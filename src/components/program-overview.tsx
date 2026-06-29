"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Speaker = {
  name: string;
  title?: string;
  company?: string;
  image?: string;
  imageClassName?: string;
};

type AgendaItem = {
  title: string;
  description?: string;
  /** Full synopsis from programme (opens in synopsis modal) */
  detailSynopsis?: string;
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
    title: "Welcome address Singapore Tech Summit 2026",
    time: "10.00 – 10.10am",
    speakers: [
      {
        name: "Dr Thai-Lai Pham",
        title: "President & CEO, Siemens ASEAN",
        image: "/speaker-dr-thai-lai-pham.png",
      },
    ],
  },
  {
    title:
      "Opening remarks: Paving the way to the data- and AI-driven future of industry and infrastructure",
    detailSynopsis:
      "Understand how data and AI are shaping the future of industry and infrastructure and gain practical strategies to what organizations can do today to stay competitive in an increasingly digital landscape.",
    time: "10.10 – 10.45am",
    speakers: [
      {
        name: "Dr Dirk Didascalou",
        title: "Head of Foundational Technologies",
        company: "Siemens AG",
        image: "/speaker-dirk-didascalou.jpg",
      },
    ],
  },
  {
    title: "Launch of Eigen Engineering Agent",
    detailSynopsis:
      "Witness our AI-powered engineering assistant designed to accelerate design, automation, and decision-making across industrial and infrastructure workflows.",
    time: "10.45 – 11.00am",
    speakers: [
      {
        name: "Michael Schrapp",
        title: "Head of Industrial AI",
        company: "Siemens Digital Industries",
        image: "/speaker-michael-schrapp.jpg",
      },
    ],
  },
  {
    title: "Keynote: AI in Manufacturing in Singapore",
    detailSynopsis:
      "Learn more about Singapore’s efforts in leveraging AI for advanced manufacturing, and how organisations can tap on these efforts in AI for advanced manufacturing to accelerate transformation and long-term competitiveness.",
    time: "11.00 – 11.10am",
    speakers: [
      {
        name: "Cindy Koh",
        title: "Executive Vice President",
        company: "EDB",
        image: "/speaker-cindy.png",
        imageClassName: "scale-[1.35]",
      },
    ],
  },
  {
    title:
      "Executive panel discussion: Industrial AI at Scale: Powering Smart, Sustainable Manufacturing",
    detailSynopsis: `Industrial AI is redefining manufacturing—unlocking new levels of operational excellence while advancing sustainability at scale. In this executive panel, we explore how AI-powered factories are becoming smarter, more autonomous, and more resilient—driving productivity gains while reducing environmental impact.

Moving beyond pilots, the discussion focuses on how organizations can successfully scale AI across the enterprise, overcoming challenges like data silos, legacy systems, and preparing the workforce for AI-driven operations. In line with the priorities of the World Economic Forum, this session highlights how Industrial AI is enabling more sustainable operations, strengthening supply chain resilience, and accelerating the transition to future-ready manufacturing.`,
    time: "11.10 – 11.40am",
    speakers: [
      {
        name: "Isabel Chong",
        title: "SVP Siemens Digital Industries, ASEAN",
        image: "/speaker-isabel-chong.jpg",
      },
      {
        name: "Cindy Koh",
        title: "Executive Vice President",
        company: "EDB",
        image: "/speaker-cindy.png",
        imageClassName: "scale-[1.35]",
      },
      {
        name: "Ang Wee Seng",
        title: "Executive Director",
        company: "Singapore Semiconductor Industry Association",
        image: "/speaker_angwee.jpg",
        imageClassName: "object-top",
      },
      {
        name: "Dr Wang Wei",
        title:
          "Centre Director Sectoral AI Centre of Excellence for Manufacturing",
        company: "ARTC",
        image: "/speaker_wangwei.webp",
      },
    ],
  },
  {
    title: "Beyond Simulation: How Industrial AI Supercharges the Digital Twin",
    detailSynopsis:
      "Industrial AI turns fragmented engineering data into high fidelity digital twins, enabling seamless data connectivity, rapid simulation, automated insights, intelligent behavior and real time validation for quicker, reliable decisions and smarter operations.",
    time: "11.40 – 12.00pm",
    speakers: [
      {
        name: "Simon Guerin",
        title: "Head of AI/DA Pre-Sales, APAC",
        company: "Siemens Digital Industries Software",
        image: "/speaker-simon-guerin.jpg",
      },
    ],
  },
  {
    title: "Enabling Industrial AI: Financing sustainable infrastructure",
    detailSynopsis:
      "Industrial AI is transforming the factories, buildings and power grids that keep our economies running, but realizing its full potential demands more than technology. It demands smart investment. This presentation explores why financing is critical to deploying AI-enabled sustainable infrastructure, examines the strategies and models that help organizations invest while managing risk and preserving capital, and shows how Siemens Financial Services — with its unique combination of technology understanding and financial expertise — can bridge the gap between ambition and implementation, helping customers turn sustainable infrastructure visions into reality.",
    time: "12.00 – 12.30pm",
    speakers: [
      {
        name: "Atul Kawatra",
        title: "GM, Head of Corporate Lending and Project Finance",
        company: "Siemens Bank / SFS",
        image: "/speaker-atul-kawatra.jpg",
      },
      {
        name: "Mark Ee",
        title: "Head of Equity Finance Asia/Australia",
        company: "SFS",
        image: "/speaker-mark-ee.jpg",
      },
    ],
  },
  {
    title:
      "Lunch networking & Siemens Technology Experience Zone — Engage, network & discover",
    time: "12.30 – 2.00pm",
  },
];

const afternoonTrack1Agenda: AgendaItem[] = [
  {
    title:
      "Track opening: From Infrastructure to Intelligence: Transforming Modern Buildings",
    description:
      "Human-centric design, digital innovation, and sustainability as outcomes—how Siemens reimagines the built environment.",
    detailSynopsis: `What if your building could adapt to you — not the other way around? Siemens is reimagining the built environment as a dynamic ecosystem where human-centric design, digital innovation, and sustainability aren't just goals — they're outcomes.

In this session, we show you how Siemens moves beyond traditional building management to enable environments that actively enhance occupant well-being, optimize operational efficiency and support decarbonization goals.`,
    time: "2.15 – 2.30pm",
    speakers: [
      {
        name: "Damien Nirousset",
        title: "Head of Buildings, ASEAN & Japan",
        company: "Siemens Smart Infrastructure",
        image: "/speaker-damien-nirousset.jpg",
      },
    ],
  },
  {
    title: "From Data to Decisions: Enabling Autonomous Buildings",
    description:
      "How Building X connects, analyzes, and optimizes building systems—and turns data into predictive intelligence.",
    detailSynopsis: `Buildings are drowning in data, but starving for insight. The key to unlocking their full potential lies in turning that data into actionable intelligence. This is where Building X by Siemens comes in - an open, AI-enabled platform that connects, analyzes and optimizes everything from HVAC, energy and fire safety, to security in one unified ecosystem. This session shows how Building X turns raw data into real-time, predictive intelligence - driving smarter operations and better occupant experiences.`,
    time: "2.30 – 2.45pm",
    speakers: [
      {
        name: "Derek Del Nevo",
        title: "Head of Digital and Software - Southeast Asia",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker-derek-del-nevo.png",
      },
    ],
  },
  {
    title: "Sustainable Electrification",
    description:
      "AI-ready electrification—from Clean Air blue GIS to Electrification X—for reliability, uptime, and future-proof operations.",
    detailSynopsis: `AI-ready industry needs an AI-ready backbone. Siemens delivers it - with intelligent electrical infrastructure that's reliable, scalable, digital, and secure. In this session, we share about our AI-ready electrification portfolio - from Clean Air-powered blue GIS range to the Electrification X suite for condition monitoring - that are helping customers unlock capacity, maximize uptime, and future-proof their operations.`,
    time: "2.45 – 3.00pm",
    speakers: [
      {
        name: "Norman Ng",
        title: "Head of Electrification and Automation",
        company: "Siemens Smart Infrastructure",
        image: "/speaker-norman-ng.png",
      },
      {
        name: "Ju Jin Tan",
        title: "Head, Customer Service",
        company: "Siemens Electrification & Automation",
        image: "/speaker_tanjujin.png",
      },
    ],
  },
  {
    title: "Building Cybersecurity: From Risk to Resilience",
    description:
      "Assess and mitigate cyber risks in connected buildings—security that enables digitalization and diverse stakeholder perspectives.",
    detailSynopsis: `As buildings become smarter and more connected, cybersecurity is no longer optional – it's essential. This session explores how organizations can assess and mitigate cyber risks while ensuring that security enables, rather than hinders, digitalization and connectivity. Featuring real-world insights from diverse stakeholder perspectives.`,
    time: "3.00 – 3.15pm",
    speakers: [
      {
        name: "Vardaan Arora",
        title: "IT & Cybersecurity Lead",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker-vardaan-arora2.png",
      },
      {
        name: "Tulasidharan Mudiliar",
        title: "Global Cybersecurity Portfolio Growth Manager",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker_mulliar.png",
      },
    ],
  },
  {
    title: "Coffee Break Networking",
    time: "3.15 – 3.45pm",
  },
  {
    title: "Beyond Quick Wins: Scaling Decarbonisation for Real Impact",
    description:
      "After the low-hanging fruit—how Siemens Sustainability Advisory defines Net Zero pathways and turns ambition into scalable impact.",
    detailSynopsis: `What happens after the low-hanging fruit of decarbonization is picked? That's where Siemens steps in. Our Sustainability Advisory Services engage with organizations at the C-suite level to define credible Net Zero pathways, and help them to translate ambition into scalable, measurable impact. This session provides insights to Siemens' role as a long-term Energy Transition partner, going well beyond audits to enable implementation, value creation, and sustained performance.`,
    time: "3.45 – 4.00pm",
    speakers: [
      {
        name: "Nilesh Jadhav",
        title: "Head of Sustainability Advisory ",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker_Nilesh.jpeg",
        imageClassName: "object-top",
      },
    ],
  },
  {
    title:
      "Intelligent by Design: Building Data Centers for the Age of Agentic AI",
    description:
      "Designing and retrofitting data centers where AI optimizes operations—from cooling to power—and how Siemens removes technical and financial barriers.",
    detailSynopsis: `Data centers of tomorrow won't just house AI - they'll be run by AI. As we enter the age of agentic AI, where intelligent systems make autonomous decisions and continuously optimize operations, the question isn't if your data center will be AI-operated, but when - and whether you'll be ready. The good news? With Siemens' integrated technology and financing solutions, this transformation is more accessible than ever.

This presentation reveals how forward-thinking organizations are designing and retrofitting data centers with intelligence built into their very foundation. We'll examine how autonomous operations - where AI independently optimizes every aspect from cooling to power distribution - represent the next frontier in data center excellence, and reveal the architectural principles and technologies needed to make this vision reality.

Learn how Siemens is helping organizations worldwide create intelligent infrastructure that doesn't just respond to AI workloads - but harnesses AI to achieve unprecedented levels of efficiency, sustainability, and operational excellence. With integrated technology solutions and Siemens Financial Services, we remove both technical and financial barriers to transformation.`,
    time: "4.00 – 4.30pm",
    speakers: [
      {
        name: "Samir Borkar",
        title: "Head, Data Center Vertical Market, Asia Pacific",
        company: "Siemens Smart Infrastructure",
        image: "/speaker_samir.jpg",
      },
      {
        name: "Andy Fong",
        title: "Simulation & Test Practice Director – Asia Pacific",
        company: "Siemens Digital Industries Software",
        image: "/speaker_AndyFong.jpg",
        imageClassName: "object-top",
      },
      {
        name: "Nilesh Jadhav",
        title: "Head of Sustainability Advisory – ASEAN",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker_Nilesh.jpeg",
        imageClassName: "object-top",
      },
      {
        name: "Wee Xian Bin",
        title: "Business Development Manager for Data Centers – Asia Pacific",
        company: "Siemens Digital Industries",
        image: "/speaker_WeeXianBin.JPG",
      },
    ],
  },
  {
    title: "Ready or Not? Your Path to Autonomous Buildings",
    description:
      "Assess infrastructure, systems, and digital maturity—and the gaps to address before modernization.",
    detailSynopsis: `Human-centric autonomous buildings are an exciting vision - but how do you move from idea to execution? This session focuses on the critical first step: understanding your current state. By taking a closer look at existing infrastructure, systems, and digital maturity, participants will gain a clearer view of where they stand today.

The session will highlight common gaps and considerations, prompting organisations to reflect on their readiness and take a more deliberate approach to building modernisation.`,
    time: "4.30 – 4.45pm",
    speakers: [
      {
        name: "Michael Tiew",
        title: "Head of Portfolio and Sales Enablement",
        company: "Siemens Smart Infrastructure Buildings",
        image: "/speaker-michael-tiew.png",
      },
    ],
  },
  {
    title: "Happy Hour Networking Session",
    description:
      "Connect with industry leaders at Happy Hour Networking Session",
    time: "4.45 – 6.15pm",
  },
];

const afternoonTrack2Agenda: AgendaItem[] = [
  {
    title: "Welcome address: Smart Manufacturing with Industrial AI",
    time: "2.15 – 2.20pm",
    speakers: [
      {
        name: "Isabel Chong",
        title: "SVP Siemens Digital Industries, ASEAN",
        image: "/speaker-isabel-chong.jpg",
      },
    ],
  },
  {
    title:
      "Industrial AI in Manufacturing: Trends Shaping the Future of Industry",
    detailSynopsis:
      "Industrial AI is reshaping manufacturing by transforming data into intelligence, enabling smarter decisions, autonomous operations, and greater business agility. This session explores the key trends driving AI adoption—from generative AI and digital twins to intelligent automation and predictive operations—and how leading manufacturers are leveraging these technologies to boost productivity, resilience, quality, and sustainability at scale.",
    time: "2.20 – 2.35pm",
    speakers: [
      {
        name: "Bob Gill",
        title: "ARC",
        image: "/speaker-bob-gill.jpeg",
        imageClassName: "object-top",
      },
    ],
  },
  {
    title: "Autonomous Manufacturing: Intelligence on the Factory Floor",
    detailSynopsis: `Autonomous Manufacturing is redefining industrial production through intelligent, self-optimizing operations. By combining Industrial AI, digital twins, and advanced automation, manufacturers can create factories that continuously monitor, analyze, and adapt processes with minimal human intervention.

This session explores how autonomous technologies are driving greater productivity, resilience, quality, and operational agility across the manufacturing value chain. Through practical industry examples, discover how manufacturers are leveraging autonomous operations to optimize performance, accelerate decision-making, and build adaptive, future-ready factories that support Singapore's vision for smart, sustainable, and globally competitive manufacturing.

• How autonomous manufacturing is accelerating Singapore's journey toward advanced and intelligent manufacturing.
• Real-world Industrial AI and autonomous operations use cases delivering measurable business value
• Addressing workforce and manpower challenges through intelligent automation and AI-driven decision-making
• Building agile, resilient, and sustainable manufacturing operations for a dynamic global market
• The roadmap to self-optimizing, autonomous factories of the future`,
    time: "2.35 – 2.55pm",
    speakers: [
      {
        name: "Sascha Maennl",
        title: "VP Sales Automation Solutions",
        company: "Siemens Digital Industries, Asia Pacific",
        image: "/speaker-sascha-maennl.jpg",
      },
    ],
  },
  {
    title:
      "Generative AI Transforms Automation Engineering with Eigen Engineering Agent",
    detailSynopsis: `Generative AI is revolutionizing automation engineering by transforming how industrial systems are designed, developed, and deployed. Discover how the Eigen Engineering Agent leverages AI-powered automation to accelerate engineering workflows, reduce manual effort, improve quality, and enable faster, smarter decision-making.

Through a live demonstration, experience how intelligent engineering agents streamline complex tasks, boost productivity, and unlock scalable innovation—empowering manufacturers to achieve greater agility, efficiency, and competitive advantage in the era of Industrial AI.

Demo Scenario: "From Requirement to Automation Solution"
Prompt: "Create a PLC control sequence for a conveyor system with emergency stop and fault handling."

Demonstration 2: Automated Documentation

Demonstration 3: Engineering Knowledge Assistant
Prompt: "Explain this control logic and identify potential optimization opportunities."

Demonstration 4: Change Request Engineering
Prompt: "Modify the system to include an additional conveyor and update all documentation."

Closing Message: "Generative AI is not replacing engineers—it is amplifying engineering expertise, enabling teams to deliver better automation solutions faster, smarter, and at greater scale."`,
    time: "2.55 – 3.15pm",
    speakers: [
      {
        name: "Erik Scepanski",
        image: "/speaker_Erik.jpeg",
        title: "Product Manager for Eigen Engineering Agent",
        company: "Siemens Digital Industries",
      },
    ],
  },
  {
    title: "Coffee Break Networking + Siemens Technology Experience Zone",
    time: "3.15 – 3.45pm",
  },
  {
    title: "Software-Defined Automation: Powering Agile Manufacturing",
    detailSynopsis: `As Singapore advances its vision for advanced manufacturing, manufacturers must become more agile, flexible, and resilient to meet evolving market demands, workforce challenges, and increasing product complexity. Software-Defined Automation is transforming industrial operations by bringing software agility to automation—enabling faster deployment, seamless scalability, and greater production flexibility.

This session explores how virtualized control, digital twins, and Industrial AI are helping manufacturers accelerate innovation, reduce engineering complexity, and optimize operations. Discover how leading organizations are leveraging Software-Defined Automation to build adaptive, intelligent, and future-ready factories that drive productivity, resilience, and sustainable growth.

• Software-defined architectures increase flexibility and scalability in automation.
• Virtualization enables faster deployment and easier system updates.
• Open ecosystems support innovation and seamless integration across the production lifecycle.

Attendees will gain insights into how software-defined automation enables flexible, scalable, and agile production systems by decoupling hardware from software, accelerating innovation and digital transformations.`,
    time: "3.45 – 4.05pm",
    speakers: [
      {
        name: "Govin Manickam",
        title: "Technology Business Development",
        company: "Siemens Digital Industries, ASEAN",
        image: "/speaker-govin-manickam.jpg",
      },
    ],
  },
  {
    title: "A Single Pane of Glass for Smarter Operational Decisions",
    detailSynopsis: `A "Single Pane of Glass" approach brings together data, systems, and operations into one unified view, enabling greater visibility and control across the industrial enterprise. By integrating production, engineering, and operational data into a centralized platform, organizations can simplify decision-making, improve collaboration, and respond faster to changing conditions.

This session explores how manufacturers can leverage unified digital environments to enhance operational transparency, optimize performance, and drive more agile, data-driven operations. Discover how a holistic view of the enterprise enables faster responses to changing conditions, improved productivity, and greater operational resilience in an increasingly complex manufacturing landscape.

• A Single Pane of Glass provides a unified view of production, engineering, and operational data.
• Centralized visibility improves decision-making and operational transparency.
• Integrated platforms enhance collaboration across teams and systems.
• Unified insights enable faster responses to production issues and changing demands.
• Solutions from Siemens Digital Industries help organizations streamline and optimize industrial operations.

Attendees will gain insights into how unified data platforms provide a holistic operational view, enabling faster decisions, improved collaboration, and smarter industrial operations.`,
    time: "4.05 – 4.25pm",
    speakers: [
      {
        name: "Licheng Yan",
        title: "Solutions Consultant",
        company: "Siemens Digital Industries, Singapore",
        image: "/speaker-licheng-yan.jpg",
      },
    ],
  },
  {
    title: "Cybersecure Industry: Protecting the Digital Factory",
    detailSynopsis: `As industrial systems become increasingly connected, cybersecurity is essential to ensure both secure and safe operations. Protecting industrial assets, production processes, and critical infrastructure requires a comprehensive approach that integrates cybersecurity across the entire automation lifecycle.

This session explores how manufacturers can strengthen resilience through secure-by-design architectures, continuous monitoring, and integrated security strategies—enabling organizations to protect operations while confidently advancing digital transformation.

• Securing the Converged IT/OT Environment: Protecting industrial control systems and operational technology; managing risks across connected assets and networks
• Cybersecurity for Smart Manufacturing: Securing Industrial AI, IoT, Edge, and Digital Twins; protecting critical production and operational data
• Compliance, Governance, and Risk Management: Aligning cybersecurity with business and regulatory requirements; establishing a culture of cyber awareness
• Roadmap to a Secure Digital Factory: Assess, Protect, Detect, Respond, Recover; embedding cybersecurity into every stage of digital transformation`,
    time: "4.25 – 4.45pm",
    speakers: [
      {
        name: "Sander Rotmensen",
        title: "VP of Cybersecurity for OT",
        company: "Siemens AG",
        image: "/speaker-sander-rotmensen.png",
      },
    ],
  },
  {
    title: "Happy Hour Networking Session + Siemens Technology Experience Zone",
    time: "4.45 – 6.15pm",
  },
];

const afternoonTrack3Agenda: AgendaItem[] = [
  {
    title:
      "Track opening: Powering the Next Generation of AI with Industrial Metaverse",
    description:
      "Digital twins with physics-based simulation and real-time data—design, validate, and optimize faster across products and production.",
    detailSynopsis: `AI-powered digital twins combine physics-based simulation with real-time operational data to create dynamic, evolving representations of products, machines, and entire production systems. By linking the virtual and physical worlds in a continuous feedback loop, they enable companies to design, validate, and optimize with far greater speed, confidence, and efficiency.`,
    time: "2.15 – 2.30pm",
    speakers: [
      {
        name: "Wayne Chua",
        title: "Country Head – Singapore, Philippines, Brunei",
        company: "Siemens Digital Industries Software",
        image: "/speaker-wayne-chua.png",
      },
    ],
  },
  {
    title: "Design, simulate, optimize with Digital Twin Composer",
    description:
      "DTC unifies multi-disciplinary data for factory-level 3D visualization—faster decisions and collaboration across teams and partners.",
    detailSynopsis: `Digital Twin Composer (DTC) brings decades of Siemens engineering expertise into a single, immersive environment where teams can design, simulate, and optimize the factory as one digital twin. It unifies multi‑disciplinary data across departments and formats, delivering high‑fidelity, factory‑level 3D visualization that turns complexity into clarity.
By moving beyond metadata to the full visual context of the plant, DTC enables faster, more intuitive decisions and seamless collaboration—connecting internal teams and external partners to drive better technical and business outcomes.`,
    time: "2.30 – 2.45pm",
    speakers: [
      {
        name: "Teh Tiack Ein",
        title: "Head of Presales Southeast Asia",
        company: "Siemens Digital Industries Software",
        image: "/speaker-teh-tiack-ein.png",
      },
    ],
  },
  {
    title:
      "Human-Machine Collaboration and Validation in Immersive Mechatronic Environment",
    description:
      "Immersive environments between virtual design and physical prototypes—live demo with Sony VR headset.",
    detailSynopsis: `Human-machine collaboration and validation enable more intuitive interaction with complex mechatronic systems. This session will explore how immersive environments bridge the gap between virtual design and physical machine prototypes, accelerating the design cycle while improving the quality and safety of mechatronic products. Join us for a live demonstration featuring a Sony VR headset, showcasing firsthand how immersive design fosters this critical collaboration.`,
    time: "2.45 – 3.00pm",
    speakers: [
      {
        name: "Sean Seneviratne",
        title: "Solutions Consultant",
        company: "Siemens Digital Industries Software",
        image: "/speaker-sean-seneviratne.jpeg",
      },
    ],
  },
  {
    title: "AI-Powered Engineering for Simulation & Test",
    description:
      "How AI enhances accuracy, speed, and efficiency in simulation and testing—and smarter, more robust products.",
    detailSynopsis: `Dive into the world of AI-powered engineering, where artificial intelligence is revolutionizing simulation and testing processes. This presentation will showcase how integrating AI can dramatically enhance the accuracy, speed, and efficiency of engineering workflows, leading to smarter designs and more robust products. Discover how to leverage AI to push the boundaries of what's possible in simulation and testing.`,
    time: "3.00 – 3.15pm",
    speakers: [
      {
        name: "Hari Hara Shanmugam",
        title: "Solutions Consultant",
        company: "Siemens Digital Industries Software",
        image: "/speaker_hara.png",
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
    detailSynopsis:
      "Join our expert panel to explore how leading companies are actively deploying Industrial AI to achieve tangible business value. This discussion will delve into real-world applications, focusing on how AI is driving significant returns on investment (ROI), facilitating crucial upskilling initiatives, and paving the way for more autonomous industrial operations. Gain insights from industry leaders on navigating the AI landscape.",
    time: "3.45 – 4.15pm",
    speakers: [
      {
        name: "Gerardo Artavia",
        title: "Plant General Manager",
        company: "Coca Cola",
        image: "/speaker_gerardo.jpg",
      },
      {
        name: "Sandro Straetemans",
        title: "MD, High Tech Portfolio Lead & Global Client Account Lead",
        company: "Accenture",
        image: "/speaker_sandro.png",
      },
      {
        name: "Dr Ng Huey Yuen",
        title: "Assistant Chief Executive",
        company: "A*STAR Advanced Remanufacturing and Technology Centre",
      },
    ],
  },
  {
    title: "AI Fabric for Industrial",
    description:
      "Graph-powered data fabric, unified data and AI, and Altair RapidMiner for a future-ready, genAI-ready platform.",
    detailSynopsis: `An AI fabric is a cutting-edge integration of data, AI, and automation structured around a graph powered data fabric. This advanced ecosystem unifies siloed data, empowering organizations to tackle today's needs and power tomorrow's possibilities. Think of it as the future of business operating systems that connect systems, processes, and decisions in a seamless, intelligent network. To harness the potential of an AI fabric, organizations need a unified platform that supports advanced data and AI capabilities. Altair RapidMiner offers an integrated data fabric and AI platform that delivers ease of use, speed, and a future-ready architecture designed for genAI.`,
    time: "4.15 – 4.30pm",
    speakers: [
      {
        name: "Alvinn Yeo ",
        title: "Principal Presales Solution Consultant",
        company: "Siemens Digital Industries Software",
        image: "/speaker_alvin.png",
      },
    ],
  },
  {
    title:
      "Build Faster, Integrate Smarter: Low-Code Manufacturing with Mendix",
    description:
      "Extend PLM, MES, ERP, and SCM without replacing cores—Mendix as the low-code engine of Siemens Xcelerator.",
    detailSynopsis: `You don't need to replace your existing systems—just make them smarter, more adaptive, and ready to scale.
As the low‑code engine of Siemens Xcelerator, Mendix lets you extend PLM, MES, ERP, and SCM without disrupting the core. Build AI‑powered, agentic applications that automate workflows across systems—faster, with less risk, and without the complexity that stalls transformation.`,
    time: "4.30 – 4.45pm",
    speakers: [
      {
        name: "Keith Chin",
        title: "Solutions Consultant",
        company: "Siemens Digital Industries Software",
        image: "/speaker-keith-chin.png",
      },
    ],
  },
  {
    title: "Happy Hour Networking Session",
    description:
      "Connect with industry leaders at Happy Hour Networking Session",
    time: "4.45 – 6.15pm",
  },
];

export function ProgramOverview() {
  const [activeTab, setActiveTab] = useState<"morning" | "afternoon">(
    "morning",
  );
  const [activeTrack, setActiveTrack] = useState<TrackId>("track1");
  const [isTrackMenuOpen, setIsTrackMenuOpen] = useState(false);
  const [detailItem, setDetailItem] = useState<AgendaItem | null>(null);
  const [portalReady] = useState(() => typeof window !== "undefined");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const tabSwitcherRef = useRef<HTMLDivElement | null>(null);
  const detailCloseRef = useRef<HTMLButtonElement | null>(null);

  const afternoonTrackItems: Record<TrackId, AgendaItem[]> = {
    track1: afternoonTrack1Agenda,
    track2: afternoonTrack2Agenda,
    track3: afternoonTrack3Agenda,
  };
  const items =
    activeTab === "morning" ? morningAgenda : afternoonTrackItems[activeTrack];
  const trackLabels: Record<TrackId, string> = {
    track1: "Powering the Future of Electrification and Autonomous Buildings",
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

    const nodes = Array.from(
      root.querySelectorAll<HTMLElement>(".agenda-item"),
    );
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

  useEffect(() => {
    if (!detailItem) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailItem(null);
    };
    window.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    queueMicrotask(() => detailCloseRef.current?.focus());

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [detailItem]);

  useEffect(() => {
    const panel = scrollRef.current;

    const alignAgendaToTabSwitcher = () => {
      const h = window.location.hash;
      if (
        h !== "#agenda" &&
        h !== "#agenda-morning" &&
        h !== "#agenda-afternoon"
      ) {
        return;
      }

      if (panel) panel.scrollTop = 0;

      const run = () => {
        const header = document.querySelector("header");
        const headerH = header?.getBoundingClientRect().height ?? 0;
        const reserve = Math.max(headerH + 36, 140);

        const el = tabSwitcherRef.current;
        if (!el) return;

        const top = window.scrollY + el.getBoundingClientRect().top;
        window.scrollTo({
          top: Math.max(0, top - reserve),
          behavior: "auto",
        });
      };

      requestAnimationFrame(() => requestAnimationFrame(run));
    };

    alignAgendaToTabSwitcher();
    window.addEventListener("hashchange", alignAgendaToTabSwitcher);
    return () =>
      window.removeEventListener("hashchange", alignAgendaToTabSwitcher);
  }, []);

  const synopsisModal =
    detailItem && portalReady
      ? createPortal(
          <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 sm:p-6">
            <button
              type="button"
              className="absolute inset-0 bg-[#000029]/70 backdrop-blur-md"
              aria-label="Close session synopsis"
              onClick={() => setDetailItem(null)}
            />
            <div
              role="dialog"
              aria-modal="true"
              aria-labelledby="agenda-detail-title"
              className="relative z-10 flex max-h-[min(90vh,880px)] w-full max-w-2xl flex-col rounded-xl border border-[#00c1b6]/30 bg-[#000029] shadow-[0_0_0_1px_rgba(0,215,199,0.08),0_24px_80px_rgba(0,0,0,0.55)]"
            >
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-white/10 bg-[#02023e]/90 px-5 py-4 sm:px-6">
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#00c1b6]">
                    Session synopsis
                  </p>
                  <h2
                    id="agenda-detail-title"
                    className="mt-1 text-lg font-bold leading-snug text-white sm:text-xl"
                  >
                    {detailItem.title}
                  </h2>
                  <p className="mt-2 flex items-center gap-2 text-sm text-white/85">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full bg-[#00c1b6]"
                      aria-hidden
                    />
                    {detailItem.time}
                  </p>
                </div>
                <button
                  ref={detailCloseRef}
                  type="button"
                  onClick={() => setDetailItem(null)}
                  className="hitech-interactive shrink-0 rounded border border-white/25 px-3 py-1.5 text-sm font-semibold text-white transition hover:border-[#00c1b6]/60 hover:text-[#00c1b6]"
                >
                  Close
                </button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
                {detailItem.detailSynopsis && (
                  <div className="whitespace-pre-wrap text-sm leading-relaxed text-white/92 sm:text-base">
                    {detailItem.detailSynopsis}
                  </div>
                )}
                {detailItem.speakers && detailItem.speakers.length > 0 && (
                  <div className="mt-8 border-t border-white/10 pt-6">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#00c1b6]">
                      Speakers
                    </p>
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {detailItem.speakers.map((speaker) => (
                        <div
                          key={`modal-${detailItem.title}-${speaker.name}`}
                          className="flex items-center gap-3"
                        >
                          {speaker.image ? (
                            <span className="inline-block h-16 w-16 shrink-0 overflow-hidden rounded-full bg-white/12">
                              <Image
                                src={speaker.image}
                                alt={speaker.name}
                                width={64}
                                height={64}
                                className={`h-16 w-16 object-cover ${speaker.imageClassName ?? ""}`}
                              />
                            </span>
                          ) : (
                            <span className="inline-block h-16 w-16 shrink-0 rounded-full bg-white/12" />
                          )}
                          <div className="min-w-0 text-white">
                            <p className="font-semibold leading-tight">
                              {speaker.name}
                            </p>
                            {speaker.title && (
                              <p className="mt-0.5 text-sm leading-snug text-white/88">
                                {speaker.title}
                              </p>
                            )}
                            {speaker.company && (
                              <p className="mt-0.5 text-sm leading-snug text-white/75">
                                {speaker.company}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <section className="bg-[#000029] px-5 py-12 text-white sm:px-8 sm:py-14 lg:px-12">
        <div className="mx-auto w-full max-w-6xl">
          <div id="agenda" className="scroll-mt-[140px] sm:scroll-mt-[152px]" />
          <span
            id="agenda-morning"
            className="block h-px w-px shrink-0 scroll-mt-[140px] sm:scroll-mt-[152px]"
            aria-hidden
          />
          <span
            id="agenda-afternoon"
            className="-mt-px block h-px w-px shrink-0 scroll-mt-[140px] sm:scroll-mt-[152px]"
            aria-hidden
          />

          <div
            ref={tabSwitcherRef}
            className="inline-flex overflow-hidden rounded-md border border-white/25 bg-white text-[#111]"
          >
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
            className="program-scroll mt-5 h-[min(88vh,calc(100dvh-11rem))] overflow-y-auto rounded-md px-4 pb-3 md:h-[88vh]"
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
                    Powering the Future of Electrification and Autonomous
                    Buildings
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
                    className="hitech-interactive inline-flex min-w-0 w-full items-center justify-between gap-2 rounded-md border border-white/25 bg-white px-3 py-2 text-left text-xs font-semibold text-[#111]"
                  >
                    <span className="min-w-0 flex-1 pr-1 leading-snug max-md:line-clamp-2">
                      {trackLabels[activeTrack]}
                    </span>
                    <span className="shrink-0">
                      {isTrackMenuOpen ? "▲" : "▼"}
                    </span>
                  </button>

                  {isTrackMenuOpen && (
                    <div className="absolute left-0 right-0 top-full z-30 mt-1 max-h-[20dvh] overflow-y-auto overscroll-contain rounded-md border border-white/20 bg-[#02023e] p-1 shadow-lg">
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
                          className={`hitech-interactive mb-1 block w-full rounded px-3 py-2 text-left text-xs font-semibold leading-snug break-words ${
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

            <div className="mt-6 pb-6">
              {items.map((item, index) => (
                <article
                  key={`${activeTab}-${activeTrack}-${index}-${item.time}`}
                  className="agenda-item border-b border-white/35 py-6 first:pt-0"
                >
                  <h3 className="text-lg font-semibold leading-tight text-[#00c1b6] sm:text-xl">
                    {item.title}
                  </h3>

                  {item.detailSynopsis && (
                    <button
                      type="button"
                      onClick={() => setDetailItem(item)}
                      className="hitech-interactive mt-3 inline-flex items-center text-sm font-semibold text-[#00c1b6] underline decoration-[#00c1b6]/50 underline-offset-4 transition hover:text-[#7de6d5] hover:decoration-[#7de6d5]"
                    >
                      View synopsis
                    </button>
                  )}

                  <div className="mt-3 flex items-center gap-3 text-sm sm:text-base">
                    <span className="inline-block h-3 w-3 rounded-full bg-[#00c1b6] shadow-[0_0_10px_rgba(0,215,199,0.55)]" />
                    <span>{item.time}</span>
                  </div>

                  {item.speakers && item.speakers.length > 0 && (
                    <div className="mt-4 grid gap-4 sm:grid-cols-2">
                      {item.speakers.map((speaker) => (
                        <div
                          key={`${item.title}-${speaker.name}`}
                          className="flex items-center gap-3"
                        >
                          {speaker.image ? (
                            <span className="inline-block h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full bg-white/15">
                              <Image
                                src={speaker.image}
                                alt={speaker.name}
                                width={72}
                                height={72}
                                className={`h-[72px] w-[72px] object-cover ${speaker.imageClassName ?? ""}`}
                              />
                            </span>
                          ) : (
                            <span className="inline-block h-[72px] w-[72px] rounded-full bg-white/15" />
                          )}
                          <div className="text-white">
                            <p className="text-base font-semibold leading-tight sm:text-lg">
                              {speaker.name}
                            </p>
                            {speaker.title && (
                              <p className="text-sm leading-tight text-white/90 sm:text-base">
                                {speaker.title}
                              </p>
                            )}
                            {speaker.company && (
                              <p className="text-sm leading-tight text-white/90 sm:text-base">
                                {speaker.company}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {item.notes && item.notes.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-x-8 gap-y-2 text-sm text-white/90 sm:text-base">
                      {item.notes.map((note, noteIndex) => (
                        <p key={`${item.title}-${note}-${noteIndex}`}>{note}</p>
                      ))}
                    </div>
                  )}
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
      {synopsisModal}
    </>
  );
}
