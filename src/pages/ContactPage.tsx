import React, { useState } from 'react';
import { CheckCircle2, Mail, MapPin, MessageSquare } from 'lucide-react';
import { useAcademy } from '../context/AcademyContext';

export function ContactPage() {
  const { activeUser, openAuthModal, submitContactInquiry, inquiries } = useAcademy();
  const [senderAlias, setSenderAlias] = useState(activeUser?.displayName || '');
  const [topic, setTopic] = useState('Course & Training Guidance');
  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeUser) {
      openAuthModal('login');
      return;
    }
    const nameToUse = senderAlias.trim() || activeUser.displayName;
    if (nameToUse.length < 2) {
      setErrorMsg('Please enter your name.');
      return;
    }
    if (message.trim().length < 10) {
      setErrorMsg('Please write at least 10 characters in your inquiry message.');
      return;
    }

    setErrorMsg(null);
    try {
      await submitContactInquiry(nameToUse, topic, message);
      setMessage('');
      setSubmittedSuccess(true);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to send inquiry.');
    }
  };

  return (
    <div className="bg-slate-50 min-h-[70vh]">
      <section className="bg-navy-950 text-white py-14 border-b border-navy-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-semibold tracking-wider text-gold-400 mb-3">CONTACT US</p>
          <h1 className="font-display text-3xl sm:text-5xl font-bold text-white tracking-tight max-w-3xl text-balance mb-4">
            Connect with PRINCE JOE DIGITAL ACADEMY.
          </h1>
          <p className="text-base text-slate-300 max-w-2xl leading-relaxed">
            Have questions about beginner courses, AI training, website development tracks, or
            digital business programs? Send an inquiry below.
          </p>
        </div>
      </section>

      <section className="py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
              <h2 className="font-display text-xl font-bold text-navy-900">Academy Channels</h2>
              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-royal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-900">Admissions &amp; Learner Support</p>
                    <p className="text-slate-600">admissions@princejoedigital.example</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-royal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-900">Learning Format</p>
                    <p className="text-slate-600">
                      International Online Campus &amp; Guided Cohort Workshops
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-royal-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-navy-900">Protected Inquiries</p>
                    <p className="text-slate-600 leading-relaxed">
                      Inquiries are secured by Firebase Authentication so only you and verified
                      academy administrators can view your messages.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {inquiries.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-3">
                <h3 className="font-display text-base font-bold text-navy-900">
                  Your Saved Inquiries ({inquiries.length})
                </h3>
                <div className="divide-y divide-slate-100">
                  {inquiries.slice(0, 3).map((inq) => (
                    <div key={inq.id} className="py-2.5 text-xs space-y-1">
                      <p className="font-semibold text-navy-900">
                        {inq.senderAlias} &middot;{' '}
                        <span className="text-royal-600">{inq.topic}</span>
                      </p>
                      <p className="text-slate-600 line-clamp-2">{inq.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-6 sm:p-8">
            <h2 className="font-display text-2xl font-bold text-navy-900 mb-2">
              Send an Academy Inquiry
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              {activeUser
                ? 'Your inquiry will be saved directly to Cloud Firestore.'
                : 'Sign in with Google first to submit a protected inquiry.'}
            </p>

            {submittedSuccess && (
              <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-start gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Inquiry saved in Cloud Firestore</p>
                  <p className="text-emerald-800 mt-0.5">
                    Thank you! Your message has been securely stored for the academy team.
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={(e) => void handleSubmit(e)} className="space-y-5">
              <div>
                <label
                  htmlFor="contact-alias"
                  className="block text-sm font-medium text-navy-900 mb-1.5"
                >
                  Your Name
                </label>
                <input
                  id="contact-alias"
                  type="text"
                  value={senderAlias}
                  onChange={(e) => {
                    setSenderAlias(e.target.value);
                    setSubmittedSuccess(false);
                  }}
                  placeholder={activeUser?.displayName || 'Your full name'}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 focus:outline-none focus:border-royal-600"
                />
              </div>

              <div>
                <label
                  htmlFor="contact-topic"
                  className="block text-sm font-medium text-navy-900 mb-1.5"
                >
                  Topic of Interest
                </label>
                <select
                  id="contact-topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 bg-white focus:outline-none focus:border-royal-600"
                >
                  <option value="Course & Training Guidance">Course &amp; Training Guidance</option>
                  <option value="Website & App Development">Website &amp; App Development</option>
                  <option value="AI Literacy Program">AI Literacy Program</option>
                  <option value="Digital Business Opportunities">
                    Digital Business Opportunities
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="contact-message"
                  className="block text-sm font-medium text-navy-900 mb-1.5"
                >
                  Message
                </label>
                <textarea
                  id="contact-message"
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    setSubmittedSuccess(false);
                  }}
                  placeholder="Share your learning goals or questions..."
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm text-navy-900 focus:outline-none focus:border-royal-600"
                />
              </div>

              {errorMsg && <p className="text-xs font-medium text-red-700">{errorMsg}</p>}

              {activeUser ? (
                <button
                  type="submit"
                  className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Submit Inquiry
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal('login')}
                  className="px-6 py-3 bg-royal-600 hover:bg-royal-700 text-white text-sm font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Sign in with Google to Send
                </button>
              )}
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
