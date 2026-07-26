"use client";

import { useState, useMemo } from "react";
import { X, Send, Mail, FileText, Loader2 } from "lucide-react";

interface ApplyModalProps {
  job: { id: string; title: string; company: string; location: string; salary: string; requiredSkills: string[]; description: string };
  userEmail: string;
  userName: string;
  userPhone?: string;
  onConfirm: (emailContent: string) => void;
  onCancel: () => void;
  loading: boolean;
}

export default function ApplyModal({ job, userEmail, userName, userPhone, onConfirm, onCancel, loading }: ApplyModalProps) {
  const [view, setView] = useState<"email" | "cover">("email");

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  const topSkills = job.requiredSkills.slice(0, 3).join(", ");
  const firstSkill = job.requiredSkills[0] || "relevant technologies";

  const smartDraft = useMemo(() => {
    return `Subject: Application for ${job.title} at ${job.company}

Hi Hiring Team,

I am writing to express my interest in the ${job.title} position at ${job.company}.

${firstSkill.charAt(0).toUpperCase() + firstSkill.slice(1)} is a core strength of mine, and I am eager to apply my skills in ${topSkills} to contribute to your team. I am a quick learner who thrives in collaborative environments and am committed to delivering quality work.

I would welcome the chance to discuss how my background aligns with your needs. Please find my resume attached for your reference.

Thank you for considering my application.

Best regards,
${userName}
${userEmail}${userPhone ? `\n${userPhone}` : ""}`;
  }, [job, userName, userEmail, userPhone, topSkills, firstSkill]);

  const [emailContent, setEmailContent] = useState(smartDraft);
  const wordCount = emailContent.split(/\s+/).filter(Boolean).length;

  const coverLetter = `Date: ${today}

Dear Hiring Manager,

I am writing to apply for the ${job.title} position at ${job.company}. With my experience in ${topSkills}, I am confident in my ability to contribute meaningfully to your team.

Throughout my career, I have consistently delivered results in fast-paced environments. My technical foundation, combined with strong problem-solving and communication skills, enables me to adapt quickly and add value from day one.

I am particularly drawn to ${job.company}'s work and believe my skills align well with the requirements of this role.

I would welcome the opportunity to discuss my qualifications further. Thank you for your time and consideration.

Sincerely,
${userName}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative w-full max-w-2xl bg-[#0f0f17] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-start justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-lg font-bold">{job.title}</h2>
            <p className="text-sm text-indigo-400">{job.company}</p>
            <p className="text-xs text-slate-500 mt-1">{job.location} · {job.salary}</p>
          </div>
          <button onClick={onCancel} className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex border-b border-white/5">
          <button onClick={() => setView("email")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${view === "email" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-white"}`}>
            <Mail className="w-4 h-4" /> Application Email
          </button>
          <button onClick={() => setView("cover")} className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all ${view === "cover" ? "text-indigo-400 border-b-2 border-indigo-400" : "text-slate-500 hover:text-white"}`}>
            <FileText className="w-4 h-4" /> Cover Letter
          </button>
        </div>

        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {view === "email" ? (
            <div>
              <div className="border-b border-white/10 pb-4 mb-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-16">To:</span>
                  <span className="text-slate-300">hiring@{job.company.toLowerCase().replace(/\s+/g, "")}.com</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-slate-500 w-16">From:</span>
                  <span className="text-slate-300">{userEmail}</span>
                </div>
              </div>
              <textarea
                value={emailContent}
                onChange={e => setEmailContent(e.target.value)}
                className="w-full h-72 p-4 rounded-xl bg-white/[0.03] border border-white/10 text-sm text-white font-mono resize-none focus:border-indigo-500/50 focus:outline-none leading-relaxed"
              />
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-slate-600">{wordCount} words</span>
                <span className="text-xs text-slate-600">Edit the email above before sending</span>
              </div>
            </div>
          ) : (
            <div className="bg-white/[0.03] border border-white/10 rounded-xl p-6">
              <p className="text-xs text-slate-500 mb-4">Reference only — this will not be sent</p>
              <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">{coverLetter}</pre>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 p-6 border-b border-white/10">
          <button onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-white/5 text-slate-400 hover:text-white text-sm font-medium transition-all">
            Cancel
          </button>
          <button onClick={() => onConfirm(emailContent)} disabled={loading || !emailContent.trim()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-400 transition-all disabled:opacity-50">
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
            ) : (
              <><Send className="w-4 h-4" /> Send Application</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
