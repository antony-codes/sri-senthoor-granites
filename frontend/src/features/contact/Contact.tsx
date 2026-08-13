import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { Phone, Send, CheckCircle2, User, Mail, MessageSquare, Layers } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SectionHeader } from '@/components/common/SectionHeader';
import { GlassCard } from '@/components/common/GlassCard';
import { MagneticButton } from '@/components/common/MagneticButton';
import { Select } from '@/components/ui/select';
import { COMPANY_INFO, PRODUCT_CATEGORIES } from '@/constants/company';
import { submitInquiryApi, fetchCategories } from '@/services/api';
import { ICategory } from '@/types';

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
  const [categories, setCategories] = useState<ICategory[]>([]);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchCategories().then((cats) => setCategories(cats)).catch(() => {});
  }, []);

  // Smooth Scroll-Based 3D Reveal Animation for Contact Form
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 85%', 'end 85%'],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 24,
    restDelta: 0.001,
  });

  const formY = useTransform(smoothProgress, [0, 1], [60, 0]);
  const formScale = useTransform(smoothProgress, [0, 1], [0.92, 1]);
  const formRotateX = useTransform(smoothProgress, [0, 1], [15, 0]);
  const formOpacity = useTransform(smoothProgress, [0, 0.4], [0, 1]);
  const formFilter = useTransform(smoothProgress, [0, 0.6], ['blur(10px)', 'blur(0px)']);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      productCategory: 'Granites',
    },
  });

  const categoryOptions = (categories.length > 0 ? categories : PRODUCT_CATEGORIES).map((c) => ({
    label: c.title,
    value: c.title,
  }));

  const onSubmit = async (data: ContactFormData) => {
    try {
      await submitInquiryApi({
        name: data.name,
        phone: data.phone,
        email: data.email || undefined,
        productCategory: data.productCategory,
        message: data.message,
      });

      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#000000', '#374151', '#6B7280'],
      });

      setIsSubmitted(true);
      reset();
    } catch (err: any) {
      alert(err.message || 'Error submitting inquiry');
    }
  };

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-14 sm:py-20 relative bg-white text-gray-900 transition-colors overflow-hidden perspective-1000"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <SectionHeader
          title="Let’s Build Together."
          subtitle={`Speak directly with founder ${COMPANY_INFO.founder} or our stone specialists for personalized recommendations, custom quotations, and project enquiries.`}
        />

        {/* Centered Hero Contact Form with Scroll-Based 3D Reveal */}
        <motion.div
          style={{
            y: formY,
            scale: formScale,
            rotateX: formRotateX,
            opacity: formOpacity,
            filter: formFilter,
            transformStyle: 'preserve-3d',
          }}
          className="will-change-transform max-w-2xl mx-auto transform-gpu z-20"
        >
          <GlassCard hoverEffect={false} className="p-6 sm:p-10 border-gray-200 relative shadow-xl hover:shadow-2xl transition-shadow duration-300 rounded-3xl">
            {isSubmitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-12 flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-sans text-3xl font-bold text-gray-900">Inquiry Received</h3>
                <p className="text-sm text-gray-600 font-sans max-w-md">
                  Thank you for reaching out to Sri Senthoor Granites. Our team will review your requirements and get in touch with you shortly.
                </p>
                <MagneticButton
                  variant="outline"
                  size="sm"
                  onClick={() => setIsSubmitted(false)}
                  className="mt-4 text-xs"
                >
                  Submit Another Inquiry
                </MagneticButton>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 flex flex-col" autoComplete="off">
                <div className="flex flex-col space-y-1">
                  <h3 className="font-sans text-xl sm:text-2xl font-bold text-gray-900">Request a Custom Quote</h3>
                  <p className="text-xs sm:text-sm text-gray-500">Tell us about your project and we’ll get back to you with the right options and pricing.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1.5 flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-black" /> Full Name *
                    </label>
                    <input
                      {...register('name')}
                      placeholder="Arun Kumar"
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 focus:outline-none focus:border-black transition-colors text-sm border border-gray-200"
                    />
                    {errors.name && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1.5 flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-black" /> Mobile Number *
                    </label>
                    <input
                      {...register('phone')}
                      placeholder="98765 43210"
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 focus:outline-none focus:border-black transition-colors text-sm border border-gray-200"
                    />
                    {errors.phone && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.phone.message}</span>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1.5 flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-black" /> Email Address
                    </label>
                    <input
                      {...register('email')}
                      placeholder="arun@example.com"
                      autoComplete="off"
                      className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 focus:outline-none focus:border-black transition-colors text-sm border border-gray-200"
                    />
                    {errors.email && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>
                    )}
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1.5 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-black" /> Product Category *
                    </label>
                    <Controller
                      name="productCategory"
                      control={control}
                      render={({ field }) => (
                        <Select
                          options={categoryOptions}
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Select product category..."
                        />
                      )}
                    />
                    {errors.productCategory && (
                      <span className="text-xs text-red-500 mt-1 block">{errors.productCategory.message}</span>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-wider text-gray-700 font-semibold mb-1.5 flex items-center gap-1.5">
                    <MessageSquare className="w-3.5 h-3.5 text-black" /> Project Requirements *
                  </label>
                  <textarea
                    {...register('message')}
                    rows={4}
                    placeholder="Tell us about your requirements, slab thickness, tile dimensions, or project size..."
                    className="w-full px-4 py-3 rounded-xl glass-panel bg-gray-50 text-gray-900 focus:outline-none focus:border-black transition-colors text-sm border border-gray-200 resize-none"
                  />
                  {errors.message && (
                    <span className="text-xs text-red-500 mt-1 block">{errors.message.message}</span>
                  )}
                </div>

                <MagneticButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full bg-black text-white hover:bg-gray-800 font-extrabold uppercase tracking-widest text-xs py-4 rounded-xl shadow-md cursor-pointer mt-2"
                >
                  <span>{isSubmitting ? 'Submitting...' : 'Send Inquiry'}</span>
                  <Send className="w-4 h-4" />
                </MagneticButton>
              </form>
            )}
          </GlassCard>
        </motion.div>
      </div>
    </section>
  );
};
