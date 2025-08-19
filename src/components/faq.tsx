import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
  } from "@/components/ui/accordion"
  
  const faqs = [
    {
      question: "What is Spartan and how does it work?",
      answer: "Spartan is an AI agent built by Eliza that can perform tasks autonomously and interact with users in natural language."
    },
    {
      question: "What is a Trusted Execution Environment (TEE)?",
      answer: "A TEE is a secure area inside a processor that runs code and handles data in isolation from the rest of the system."
    },
    {
      question: "Why is Spartan running inside a TEE?",
      answer: "Running Spartan in a TEE ensures its code and data remain private, tamper-proof, and secure even if the host system is compromised."
    },
    {
      question: "Can anyone access Spartan’s data or code?",
      answer: "No. The TEE ensures only authorized code inside the enclave can access Spartan’s sensitive data and logic."
    },
    {
      question: "Is my interaction with Spartan private?",
      answer: "Yes. Data exchanged with Spartan inside the TEE is encrypted and protected from outside access."
    },
    {
      question: "How does running in a TEE affect performance?",
      answer: "While there can be a small overhead, TEEs are optimized for secure computation and typically have minimal performance impact."
    },
  ]
  
  export default function Faq() {
    return (
      <div className="w-full flex flex-col items-center py-10">
        <h1 className="text-white font-extrabold text-[50px] mb-6">Frequently Asked Questions</h1>

        <Accordion type="single" collapsible className="space-y-4 w-full max-w-6xl text-white">
          {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="font-normal text-[24px] mb-4">{faq.question}</AccordionTrigger>
              <AccordionContent className="font-normal text-[20px] text-[#7F7F7F]">{faq.answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
  
      </div>
    )
  }
  