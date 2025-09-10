import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Image from "next/image";
import Badge from "./badge";

const faqs = [
  {
    question: "What is $ELIZA??",
    answer:
      "Spartan is an AI agent built by Eliza that can perform tasks autonomously and interact with users in natural language.",
  },
  {
    question: "What’s the conversion rate?",
    answer:
      "A TEE is a secure area inside a processor that runs code and handles data in isolation from the rest of the system.",
  },
  {
    question: "Why is Spartan running inside a TEE?",
    answer:
      "Running Spartan in a TEE ensures its code and data remain private, tamper-proof, and secure even if the host system is compromised.",
  },
  {
    question: "Can anyone access Spartan’s data or code?",
    answer:
      "No. The TEE ensures only authorized code inside the enclave can access Spartan’s sensitive data and logic.",
  },
  {
    question: "Is my interaction with Spartan private?",
    answer:
      "Yes. Data exchanged with Spartan inside the TEE is encrypted and protected from outside access.",
  },
  {
    question: "How does running in a TEE affect performance?",
    answer:
      "While there can be a small overhead, TEEs are optimized for secure computation and typically have minimal performance impact.",
  },
  {
    question: "How does running in a TEE affect performance?",
    answer:
      "While there can be a small overhead, TEEs are optimized for secure computation and typically have minimal performance impact.",
  },
  {
    question: "Is my interaction with Spartan private?",
    answer:
      "Yes. Data exchanged with Spartan inside the TEE is encrypted and protected from outside access.",
  },
  {
    question: "Why is Spartan running inside a TEE?",
    answer:
      "Running Spartan in a TEE ensures its code and data remain private, tamper-proof, and secure even if the host system is compromised.",
  },
];

export default function Faq() {
  return (
    <div className="relative overflow-hidden px-4 lg:px-12 w-full min-h-full  grid grid-cols-1 lg:grid-cols-2 items-center py-24 bg-[#020B30] leading-tight">
      <div className="h-full lg:h-fit relative lg:place-self-start z-10 space-y-8">
        <Badge title="open index" />
        <h1 className="text-white mt-4 font-bold text-2xl lg:text-4xl xl:text-[54px] uppercase max-w-xl">
          faq
        </h1>
      </div>

      <Image
        src="/faq/pixel-grid.png"
        alt="background"
        fill
        className="object-cover object-top z-0"
        priority
      />
      <div className="mt-12 items-start justify-items-start justify-start h-full relative z-10">
        <Accordion
          type="single"
          collapsible
          className="space-y-0 w-full max-w-6xl text-white"
        >
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-normal text-[24px] mb-0">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="font-normal text-[16px] text-white">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
          {/* serves as blue line */}
          <div className=""></div>
        </Accordion>
      </div>
    </div>
  );
}
