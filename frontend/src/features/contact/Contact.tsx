import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Phone, MapPin, Clock, Send, CheckCircle2, User, Mail, MessageSquare, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeader } from '@/components/common/SectionHeader';
import { GlassCard } from '@/components/common/GlassCard';
import { MagneticButton } from '@/components/common/MagneticButton';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '@/constants/company';
import { submitInquiryApi } from '@/services/api';

// Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, 'Please enter your full name'),
  phone: z.string().min(10, 'Please enter a valid 10-digit mobile number'),
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  productCategory: z.string().min(1, 'Please select your interested product category'),
  message: z.string().min(5, 'Please provide a brief description of your requirement'),
});

type ContactFormData = z.infer<typeof contactSchema>;

export const Contact: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      productCategory: 'Granites',
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitInquiryApi({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        productCategory: data.productCategory,
        message: data.message,
      });

      // Trigger festive celebratory gold confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#C5A059', '#F3E5AB', '#FFFFFF'],
      });

      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      alert(err.message || 'Error submitting inquiry');
    }
  };

  return (
    <section id="contact" className="py-14 sm:py-20 relative bg-white text-gray-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          badge="Direct Inquiries & Showroom Visit"
          title="Begin Your Architectural Journey With"
          highlightTitle="Sri Senthoor Granites"
          subtitle="Speak directly with founder Arshath or our expert natural stone consultants. Request customized slab quotes, physical samples, or site visits."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Side - Showroom Info & Direct Phone Links with Slide-In Entrance */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col gap-6 will-change-transform"
          >
            <GlassCard hoverEffect={false} className="p-8 border-accent-gold/30">
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-6">Showroom Headquarters</h3>

              <div className="space-y-6">
                {/* Phones */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 block font-semibold">Direct Phone Lines</span>
                    <div className="flex flex-col mt-1">
                      <a href={`tel:${COMPANY_INFO.rawPhones[1]}`} className="text-lg font-bold text-gray-900 hover:text-accent-gold transition-colors">
                        +91 {COMPANY_INFO.rawPhones[1]}
                      </a>
                      <a href={`tel:${COMPANY_INFO.rawPhones[0]}`} className="text-sm font-semibold text-gray-700 hover:text-accent-gold transition-colors">
                        +91 {COMPANY_INFO.rawPhones[0]}
                      </a>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 block font-semibold">Showroom Address</span>
                    <address className="not-italic text-sm text-gray-800 mt-1 font-sans leading-relaxed">
                      {COMPANY_INFO.address.full}
                    </address>
                    <a
                      href={COMPANY_INFO.address.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-2 text-xs uppercase tracking-widest text-accent-gold font-bold hover:underline"
                    >
                      Open Google Maps Location →
                    </a>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-accent-gold/10 border border-accent-gold/30 flex items-center justify-center text-accent-gold shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs uppercase tracking-widest text-gray-500 block font-semibold">Working Hours</span>
                    <p className="text-sm text-gray-800 mt-1 font-sans">
                      {COMPANY_INFO.workingHours}
                    </p>
                  </div>
                </div>
              </div>
            </GlassCard>

            {/* Embedded Google Map Frame */}
            <div className="rounded-3xl overflow-hidden glass-panel border border-gray-200 h-64 relative">
              <iframe
                title="Sri Senthoor Granites Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3918.784428414457!2d78.72304!3d10.8278!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf5671d184713%3A0x63351d3434608c02!2sAriyamangalam%2C%20Tiruchirappalli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.5) contrast(1.1)' }}
                allowFullScreen={false}
                loading="lazy"
              />
            </div>
          </motion.div>

          {/* Right Side - Interactive Zod Validated Contact Form with Scale & Fade Up */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="lg:col-span-7 will-change-transform"
          >
            <GlassCard hoverEffect={false} className="p-8 sm:p-10 border-accent-gold/30 relative">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 rounded-full bg-accent-gold/20 border border-accent-gold flex items-center justify-center text-accent-gold shadow-[0_0_30px_rgba(197,160,89,0.3)]">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h3 className="font-serif text-3xl font-bold text-gray-900">Inquiry Received</h3>
                  <p className="text-gray-600 font-sans max-w-md">
                    Thank you for reaching out to Sri Senthoor Granites. Founder Arshath or a senior stone specialist will contact your phone shortly.
                  </p>
                  <MagneticButton
                    variant="outline"
                    size="sm"
                    onClick={() => setIsSubmitted(false)}
                    className="mt-4"
                  >
                    Submit Another Inquiry
                  </MagneticButton>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="flex flex-col">
                    <h3 className="font-serif text-2xl font-bold text-gray-900">Request Custom Quotation</h3>
                    <p className="text-xs text-gray-500 mt-1">Fill out the details below to receive direct quarry pricing.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-accent-gold" /> Full Name *
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="e.g. Architect Rajesh Swaminathan"
                        className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-gold transition-colors text-sm border border-gray-200"
                      />
                      {errors.name && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-accent-gold" /> Mobile Number *
                      </label>
                      <input
                        {...register('phone')}
                        type="tel"
                        placeholder="e.g. 7200629846"
                        className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-gold transition-colors text-sm border border-gray-200"
                      />
                      {errors.phone && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/* Email */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-accent-gold" /> Email Address (Optional)
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="e.g. client@domain.com"
                        className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-gold transition-colors text-sm border border-gray-200"
                      />
                      {errors.email && (
                        <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
                      )}
                    </div>

                    {/* Product Category */}
                    <div>
                      <label className="text-xs uppercase tracking-widest text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-accent-gold" /> Product Category *
                      </label>
                      <select
                        {...register('productCategory')}
                        className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 focus:outline-none focus:border-accent-gold transition-colors text-sm border border-gray-200"
                      >
                        {PRODUCT_CATEGORIES.map((p) => (
                          <option key={p.id} value={p.title} className="bg-white text-gray-900">
                            {p.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="text-xs uppercase tracking-widest text-gray-700 font-semibold mb-2 flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-accent-gold" /> Project Requirements *
                    </label>
                    <textarea
                      {...register('message')}
                      rows={4}
                      placeholder="Mention estimated square footage, slab finish preferences, or project timeline..."
                      className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:border-accent-gold transition-colors text-sm border border-gray-200"
                    />
                    {errors.message && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>
                    )}
                  </div>

                  {/* Submit Button */}
                  <MagneticButton
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full gap-2"
                  >
                    <span>{isSubmitting ? 'Sending Request...' : 'Submit Quotation Request'}</span>
                    <Send className="w-4 h-4" />
                  </MagneticButton>
                </form>
              )}
            </GlassCard>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
