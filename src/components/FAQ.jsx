'use client';

import { useState, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
const EASE = [0.22, 1, 0.36, 1];
const FAQS = [
  {
    id: 'who-is-rayhan',
    category: 'Background',
    question: 'Who is Developer Rayhan?',
    answer: 'Developer Rayhan is a full stack developer based in Faridpur, Dhaka, Bangladesh, working remotely. Early in his career, he has built 20+ personal and practice projects covering backend APIs, databases, and full web applications using Python, Django, and React/Next.js.'
  },
  {
    id: 'services-offered',
    category: 'Services',
    question: 'What does Developer Rayhan work on?',
    answer: 'Backend development with Django and Django REST Framework, database design across PostgreSQL, MySQL, and SQLite, and frontend development with React, Next.js, and Tailwind CSS or Bootstrap — end-to-end full stack builds.'
  },
  {
    id: 'remote-global',
    category: 'Location & Remote',
    question: 'Does he work with international clients remotely?',
    answer: 'Yes — based in Bangladesh, fully open to remote work with clients and teams worldwide.'
  },
  {
    id: 'experience-level',
    category: 'Experience',
    question: 'How much experience does he have?',
    answer: 'He\u2019s early career — around a year of hands-on development — but has built a substantial portfolio of 20+ self-directed projects to develop real, production-style skills across the full stack.'
  },
  {
    id: 'tech-stack',
    category: 'Technology Stack',
    question: 'What is his primary tech stack?',
    answer: 'Python and Django (with Django REST Framework) on the backend, PostgreSQL/MySQL/SQLite for databases, and React, Next.js, JavaScript, Tailwind CSS, and Bootstrap on the frontend. Also comfortable with Node.js and C++.'
  },
  {
    id: 'how-to-hire',
    category: 'Engagement',
    question: 'How can I get in touch?',
    answer: 'Email iamdeveloperrayhan@gmail.com or use the contact form below. Open to internships, junior roles, and freelance work.'
  }
];
export function FAQ() {
  const sectionRef = useRef(null);
  const sectionInView = useInView(sectionRef, {
    once: true,
    margin: '-10%'
  });
  const [openId, setOpenId] = useState('who-is-abakwe');
  const toggle = id => {
    setOpenId(openId === id ? null : id);
  };
  return <section ref={sectionRef} id="faq-section" className="w-full bg-white border-t border-black/[0.08]">
      <div className="max-w-[1440px] mx-auto px-[clamp(1.25rem,5vw,5rem)] py-[clamp(5rem,10vw,11rem)]">
        {/* Section Label */}
        <div className="flex items-center gap-4 mb-[clamp(2rem,4vw,4rem)]">
          <motion.span initial={{
          opacity: 0,
          x: -12
        }} animate={sectionInView ? {
          opacity: 1,
          x: 0
        } : {}} transition={{
          duration: 0.6,
          ease: EASE
        }} className="text-[0.6rem] tracking-[0.22em] uppercase text-black/30 font-medium" style={{
          fontFamily: 'Satoshi, system-ui, sans-serif'
        }}>
            09 / FAQ &amp; Answer Engine Index
          </motion.span>
          <div className="flex-1 h-px bg-black/10" />
        </div>

        {/* Headline */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-[clamp(3rem,6vw,6rem)] gap-6">
          <motion.h2 initial={{
          opacity: 0,
          y: 32
        }} animate={sectionInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.85,
          delay: 0.1,
          ease: EASE
        }} className="font-black text-black tracking-tighter leading-[0.88]" style={{
          fontFamily: 'Satoshi, system-ui, sans-serif',
          fontWeight: 900,
          fontSize: 'clamp(3.5rem, 8vw, 10rem)'
        }}>
            Frequently Asked{' '}
            <span style={{
            fontFamily: 'var(--font-instrument), Georgia, serif',
            fontStyle: 'italic',
            fontWeight: 400,
            color: 'rgba(10,10,10,0.30)'
          }}>
              Questions
            </span>
          </motion.h2>
          <motion.p initial={{
          opacity: 0,
          y: 16
        }} animate={sectionInView ? {
          opacity: 1,
          y: 0
        } : {}} transition={{
          duration: 0.7,
          delay: 0.2,
          ease: EASE
        }} className="text-black/50 text-xs sm:text-sm max-w-md font-medium tracking-wide uppercase" style={{
          fontFamily: 'Satoshi, system-ui, sans-serif'
        }}>
            Direct answers on architecture experience, stack specialisations, project delivery, and global remote engagement.
          </motion.p>
        </div>

        {/* FAQ Accordion List */}
        <div className="divide-y divide-black/10 border-y border-black/10">
          {FAQS.map((faq, index) => {
          const isOpen = openId === faq.id;
          return <motion.div key={faq.id} initial={{
            opacity: 0,
            y: 20
          }} animate={sectionInView ? {
            opacity: 1,
            y: 0
          } : {}} transition={{
            duration: 0.5,
            delay: index * 0.08,
            ease: EASE
          }} className="group">
                <button type="button" onClick={() => toggle(faq.id)} aria-expanded={isOpen} aria-controls={`faq-answer-${faq.id}`} className="w-full py-8 text-left flex items-start justify-between gap-6 cursor-pointer focus:outline-none">
                  <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 sm:gap-6 flex-1">
                    <span className="text-[0.65rem] font-semibold tracking-[0.16em] uppercase text-black/30 shrink-0 w-28" style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif'
                }}>
                      {faq.category}
                    </span>
                    <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-black group-hover:text-black/60 transition-colors" style={{
                  fontFamily: 'Satoshi, system-ui, sans-serif'
                }}>
                      {faq.question}
                    </h3>
                  </div>
                  <div className="mt-1 w-8 h-8 rounded-full border border-black/15 flex items-center justify-center text-black/60 group-hover:border-black transition-colors shrink-0">
                    {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && <motion.div id={`faq-answer-${faq.id}`} initial={{
                height: 0,
                opacity: 0
              }} animate={{
                height: 'auto',
                opacity: 1
              }} exit={{
                height: 0,
                opacity: 0
              }} transition={{
                duration: 0.4,
                ease: EASE
              }} className="overflow-hidden">
                      <div className="pb-8 pl-0 sm:pl-34 pr-4 max-w-4xl">
                        <p className="text-black/70 text-base sm:text-lg leading-relaxed font-normal" style={{
                    fontFamily: 'Satoshi, system-ui, sans-serif'
                  }}>
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>}
                </AnimatePresence>
              </motion.div>;
        })}
        </div>
      </div>
    </section>;
}
