"use client";

import { useEffect, useMemo, useState } from "react";
import { DatePicker } from '@/components/ui/DatePicker'
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { GraduationCap, User } from "lucide-react";
import { z } from "zod";
import { useUserStore } from "@/store/userStore";
import { useAuthStore } from "@/store/authStore";
import { TutorBankSchema } from "@/lib/validation/onboarding";

const QualificationsSchema = z.union([
  z.string().trim().min(1, "Qualifications is required"),
  z.object({
    education: z.string().trim().min(1, "Education is required"),
    certifications: z.array(z.string().trim()).default([]),
    experience_years: z.number().min(0, "Experience must be >= 0"),
  })
]);

const TutorDetailsFormSchema = z.object({
  bio: z.string().trim().min(10, "Bio must be at least 10 characters"),
  qualifications: QualificationsSchema,
  teaching_experience: z.string().trim().min(1, "Teaching experience is required"),
  specializations: z.array(z.string().trim()).min(1, "Add at least one specialization"),
  languages_spoken: z.array(z.string().trim()).min(1, "Select at least one language"),
  expertise_areas: z.array(z.string().trim()).min(1, "Add at least one expertise area"),
  verification_status: z.enum(["pending", "verified", "rejected"]),
});

type TutorDetailsFormInput = z.infer<typeof TutorDetailsFormSchema>;

export default function TutorDetailsPage() {
  const router = useRouter();
  const { user } = useUserStore();
  const saveTutorDetails = useAuthStore(s => s.saveTutorDetails);
  const completeOnboarding = useAuthStore(s => s.completeOnboarding);

  useEffect(() => {
    document.title = "Tutor Details - OpenEducation";
  }, []);

  // Local form state with text inputs converted to arrays on submit
  const [form, setForm] = useState({
    dob: "",
    bio: "",
    qualificationsText: "",
    qualificationsObj: { education: "", certificationsText: "", experience_years: 0 },
    useStructuredQualifications: false,
    teaching_experience: "",
    specializationsText: "",
    languagesSpokenText: "",
    expertiseAreasText: "",
    verification_status: "pending" as "pending" | "verified" | "rejected",
    bank: {
      account_holder_name: "",
      account_number: "",
      ifsc_code: "",
      bank_name: "",
      account_type: "savings" as "savings" | "current",
      verified: false,
    }
  });
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const [loading, setLoading] = useState(false);

  // Prefill from user store
  useEffect(() => {
    const td = user?.tutor_details;
    if (!td) return;
    setForm(prev => ({
      ...prev,
      dob: user?.dob || prev.dob,
      bio: td.bio || prev.bio,
      qualificationsText: typeof td.qualifications === 'string' ? td.qualifications : prev.qualificationsText,
      useStructuredQualifications: typeof td.qualifications === 'object',
      qualificationsObj: typeof td.qualifications === 'object' ? (() => {
        const q: any = td.qualifications;
        const education = (q?.education ?? q?.degree ?? "") as string;
        const certificationsText = Array.isArray(q?.certifications) ? q.certifications.join(', ') : "";
        const experienceYears = typeof q?.experience_years === 'number' ? q.experience_years : (Number(q?.year) || 0);
        return {
          education,
          certificationsText,
          experience_years: experienceYears,
        };
      })() : prev.qualificationsObj,
      teaching_experience: td.teaching_experience || prev.teaching_experience,
      specializationsText: Array.isArray(td.specializations) ? td.specializations.join(', ') : prev.specializationsText,
      languagesSpokenText: Array.isArray(td.languages_spoken) ? td.languages_spoken.join(', ') : prev.languagesSpokenText,
      expertiseAreasText: Array.isArray(td.expertise_areas) ? td.expertise_areas.join(', ') : prev.expertiseAreasText,
      verification_status: td.verification_status || prev.verification_status,
      bank: td.bank_details ? {
        account_holder_name: td.bank_details.account_holder_name || "",
        account_number: td.bank_details.account_number || "",
        ifsc_code: td.bank_details.ifsc_code || "",
        bank_name: td.bank_details.bank_name || "",
        account_type: (td.bank_details.account_type as "savings" | "current") || "savings",
        verified: !!td.bank_details.verified,
      } : prev.bank,
    }));
  }, [user]);

  const derivedInput: TutorDetailsFormInput = useMemo(() => ({
    bio: form.bio.trim(),
    qualifications: form.useStructuredQualifications
      ? {
          education: form.qualificationsObj.education.trim(),
          certifications: form.qualificationsObj.certificationsText.split(',').map(s => s.trim()).filter(Boolean),
          experience_years: Number(form.qualificationsObj.experience_years) || 0,
        }
      : form.qualificationsText.trim(),
    teaching_experience: form.teaching_experience.trim(),
    specializations: form.specializationsText.split(',').map(s => s.trim()).filter(Boolean),
    languages_spoken: form.languagesSpokenText.split(',').map(s => s.trim()).filter(Boolean),
    expertise_areas: form.expertiseAreasText.split(',').map(s => s.trim()).filter(Boolean),
    verification_status: form.verification_status,
  }), [form]);

  const validation = useMemo(() => TutorDetailsFormSchema.safeParse(derivedInput), [derivedInput]);
  const bankValidation = useMemo(() => TutorBankSchema.safeParse(form.bank), [form.bank]);
  const isDobValid = useMemo(() => {
    if (!form.dob) return false;
    const today = new Date();
    const dob = new Date(form.dob);
    const age = today.getFullYear() - dob.getFullYear() - (today < new Date(today.getFullYear(), dob.getMonth(), dob.getDate()) ? 1 : 0);
    return age >= 18;
  }, [form.dob]);
  const isValid = validation.success && bankValidation.success && isDobValid;

  const onBankChange = (k: keyof typeof form.bank, v: string) => {
    let next = v;
    if (k === 'ifsc_code') next = v.toUpperCase();
    if (k === 'account_number') next = v.replace(/[^0-9]/g, '');
    setForm(prev => ({ ...prev, bank: { ...prev.bank, [k]: next } }));
    setErrors(prev => ({ ...prev, [`bank.${k}`]: undefined }));
    // inline validate that single field
    const result = TutorBankSchema.safeParse({ ...form.bank, [k]: next });
    if (!result.success) {
      const issue = result.error.issues.find(i => String(i.path[0]) === k);
      if (issue) setErrors(prev => ({ ...prev, [`bank.${k}`]: issue.message }));
    }
  };

  const onSubmit = async () => {
    if (!isValid) {
      const e: Record<string, string> = {};
      if (!validation.success) {
        validation.error.issues.forEach(i => { e[String(i.path.join('.'))] = i.message });
      }
      if (!isDobValid) e['dob'] = 'You must be at least 18 years old';
      setErrors(e);
      return;
    }
    setLoading(true);
    await saveTutorDetails({
      gender: user?.gender || 'other',
      dob: form.dob,
      bio: derivedInput.bio,
      qualifications: typeof derivedInput.qualifications === 'string'
        ? { degree: derivedInput.qualifications, institution: '', year: '', additional: '' }
        : { degree: derivedInput.qualifications.education, institution: '', year: String(derivedInput.qualifications.experience_years), additional: derivedInput.qualifications.certifications.join(',') },
      teaching_experience: derivedInput.teaching_experience,
      specializations: derivedInput.specializations,
      languages_spoken: derivedInput.languages_spoken,
      expertise_areas: derivedInput.expertise_areas,
      bank_details: {
        account_holder_name: form.bank.account_holder_name.trim(),
        account_number: form.bank.account_number.replace(/\s+/g, ''),
        ifsc_code: form.bank.ifsc_code.toUpperCase().trim(),
        bank_name: form.bank.bank_name.trim(),
        account_type: form.bank.account_type,
        verified: form.bank.verified || false,
      },
    });
    await completeOnboarding();
    router.replace("/tutor/onboarding/documents");
  };

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold text-neutral-900">Tutor Details</h1>
            {user?.name && <p className="text-neutral-600">Welcome, {user.name}! Complete your profile.</p>}
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Date of Birth *
              </label>
              <DatePicker
                selected={form.dob ? new Date(form.dob) : null}
                onChange={(date) => {
                  const v = date ? format(date, 'yyyy-MM-dd') : '';
                  setForm(prev => ({ ...prev, dob: v }));
                  setErrors(prev => ({ ...prev, dob: undefined }));
                }}
                placeholder="Select your date of birth"
                className={errors['dob'] ? 'border-red-500' : ''}
              />
              {errors['dob'] && <p className="mt-1 text-sm text-red-600">{errors['dob']}</p>}
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                <User className="w-4 h-4 mr-2 text-primary-600" />
                Bio *
              </label>
              <textarea
                className={`w-full px-4 py-3 border rounded-lg ${errors.bio ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                rows={4}
                value={form.bio}
                onChange={e => setForm(prev => ({ ...prev, bio: e.target.value }))}
                placeholder="Tell us about your teaching experience and approach..."
              />
              {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="flex items-center text-sm font-medium text-neutral-700">
                  <GraduationCap className="w-4 h-4 mr-2 text-primary-600" />
                  Qualifications *
                </label>
                <label className="text-xs text-neutral-600 flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={form.useStructuredQualifications}
                    onChange={e => setForm(prev => ({ ...prev, useStructuredQualifications: e.target.checked }))}
                  />
                  Use structured form
                </label>
              </div>

              {!form.useStructuredQualifications ? (
                <input
                  className={`w-full px-4 py-3 border rounded-lg ${errors.qualifications ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={form.qualificationsText}
                  onChange={e => setForm(prev => ({ ...prev, qualificationsText: e.target.value }))}
                  placeholder="e.g. M.Sc. Mathematics, B.Ed., Ph.D. Physics"
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    className={`w-full px-4 py-3 border rounded-lg ${errors['qualifications.education'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.qualificationsObj.education}
                    onChange={e => setForm(prev => ({ ...prev, qualificationsObj: { ...prev.qualificationsObj, education: e.target.value } }))}
                    placeholder="Education"
                  />
                  <input
                    className="w-full px-4 py-3 border rounded-lg border-gray-300"
                    value={form.qualificationsObj.certificationsText}
                    onChange={e => setForm(prev => ({ ...prev, qualificationsObj: { ...prev.qualificationsObj, certificationsText: e.target.value } }))}
                    placeholder="Certifications (comma-separated)"
                  />
                  <input
                    type="number"
                    className={`w-full px-4 py-3 border rounded-lg ${errors['qualifications.experience_years'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.qualificationsObj.experience_years}
                    onChange={e => setForm(prev => ({ ...prev, qualificationsObj: { ...prev.qualificationsObj, experience_years: Number(e.target.value) } }))}
                    placeholder="Experience years"
                  />
                </div>
              )}
              {errors.qualifications && <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Teaching Experience *
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg ${errors.teaching_experience ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={form.teaching_experience}
                  onChange={e => setForm(prev => ({ ...prev, teaching_experience: e.target.value }))}
                  placeholder="e.g. 5 years high school mathematics"
                />
                {errors.teaching_experience && <p className="mt-1 text-sm text-red-600">{errors.teaching_experience}</p>}
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Specializations *
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg ${errors.specializations ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={form.specializationsText}
                  onChange={e => setForm(prev => ({ ...prev, specializationsText: e.target.value }))}
                  placeholder="e.g. Mathematics, Physics"
                />
                {errors.specializations && <p className="mt-1 text-sm text-red-600">{errors.specializations}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Languages Spoken *
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg ${errors.languages_spoken ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={form.languagesSpokenText}
                  onChange={e => setForm(prev => ({ ...prev, languagesSpokenText: e.target.value }))}
                  placeholder="e.g. English, Hindi"
                />
                {errors.languages_spoken && <p className="mt-1 text-sm text-red-600">{errors.languages_spoken}</p>}
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-neutral-700 mb-3">
                  <User className="w-4 h-4 mr-2 text-primary-600" />
                  Expertise Areas *
                </label>
                <input
                  className={`w-full px-4 py-3 border rounded-lg ${errors.expertise_areas ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                  value={form.expertiseAreasText}
                  onChange={e => setForm(prev => ({ ...prev, expertiseAreasText: e.target.value }))}
                  placeholder="e.g. Data Science, ML"
                />
                {errors.expertise_areas && <p className="mt-1 text-sm text-red-600">{errors.expertise_areas}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-neutral-900">Bank Details</h2>
              <p className="text-sm text-neutral-600">This account will be used to send your earnings too.</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg ${errors['bank.account_holder_name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.bank.account_holder_name}
                    onChange={e => onBankChange('account_holder_name', e.target.value)}
                  />
                  {errors['bank.account_holder_name'] && <p className="mt-1 text-sm text-red-600">{errors['bank.account_holder_name']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg ${errors['bank.account_number'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.bank.account_number}
                    onChange={e => onBankChange('account_number', e.target.value)}
                  />
                  {errors['bank.account_number'] && <p className="mt-1 text-sm text-red-600">{errors['bank.account_number']}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg ${errors['bank.ifsc_code'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.bank.ifsc_code}
                    onChange={e => onBankChange('ifsc_code', e.target.value)}
                  />
                  {errors['bank.ifsc_code'] && <p className="mt-1 text-sm text-red-600">{errors['bank.ifsc_code']}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                  <input
                    className={`w-full px-4 py-3 border rounded-lg ${errors['bank.bank_name'] ? 'border-red-500 bg-red-50' : 'border-gray-300'}`}
                    value={form.bank.bank_name}
                    onChange={e => onBankChange('bank_name', e.target.value)}
                  />
                  {errors['bank.bank_name'] && <p className="mt-1 text-sm text-red-600">{errors['bank.bank_name']}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
                <select
                  className="w-full px-4 py-3 border rounded-lg border-gray-300"
                  value={form.bank.account_type}
                  onChange={e => onBankChange('account_type', e.target.value)}
                >
                  <option value="savings">Savings</option>
                  <option value="current">Current</option>
                </select>
              </div>
            </div>

            <div className="pt-2">
              <Button size="lg" onClick={onSubmit} disabled={loading || !isValid}>
                {loading ? 'Saving...' : 'Save and Continue'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}


