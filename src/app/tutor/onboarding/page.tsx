'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { GraduationCap, FileText, CreditCard, CheckCircle } from 'lucide-react'
import { z } from 'zod'
import { useAuthStore } from '@/store/authStore'
import type { TutorDetailsUpdate } from '@/lib/userTypes'
import { paymentsApi, loadRazorpayScript } from '@/lib/payments'
import { useToast } from '@/components/ui/ToastProvider'

const BankSchema = z.object({
  account_holder_name: z
    .string()
    .trim()
    .min(3, 'Account holder name is required')
    .refine(v => /^[A-Za-z][A-Za-z .']+$/.test(v), 'Enter a valid name'),
  account_number: z
    .string()
    .transform(v => v.replace(/\s+/g, ''))
    .refine(v => /^[0-9]+$/.test(v), 'Account number must be digits only')
    .refine(v => v.length >= 9 && v.length <= 18, 'Account number must be 9-18 digits'),
  ifsc_code: z
    .string()
    .transform(v => v.toUpperCase().trim())
    .refine(v => /^[A-Z]{4}0[A-Z0-9]{6}$/.test(v), 'Enter a valid IFSC (e.g., HDFC0001234)'),
  bank_name: z
    .string()
    .trim()
    .min(2, 'Bank name is required')
    .refine(v => /^[A-Za-z][A-Za-z &().'-]+$/.test(v), 'Enter a valid bank name'),
  account_type: z.enum(['savings','current']),
})

const TutorSchema = z.object({
  bio: z.string().min(10, 'Bio must be at least 10 characters'),
  qualifications: z.string().min(2, 'Qualifications required'),
  teaching_experience: z.string().min(2, 'Experience required'),
  specializations: z.string().optional(),
  languages_spoken: z.string().optional(),
  expertise_areas: z.string().optional(),
  bank: BankSchema,
})

export default function TutorOnboarding() {
  const router = useRouter()
  const saveTutorDetails = useAuthStore(s => s.saveTutorDetails)
  const completeOnboarding = useAuthStore(s => s.completeOnboarding)
  const fetchProfile = useAuthStore(s => s.fetchProfile)
  const { showToast } = useToast()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string | undefined>>({})
  const [generalError, setGeneralError] = useState<string | null>(null)

  const [form, setForm] = useState({
    bio: '',
    qualifications: '',
    teaching_experience: '',
    specializations: '',
    languages_spoken: '',
    expertise_areas: '',
    bank: {
      account_holder_name: '',
      account_number: '',
      ifsc_code: '',
      bank_name: '',
      account_type: 'savings' as 'savings' | 'current',
    }
  })

  const onChange = (k: keyof typeof form, v: any) => {
    setForm(prev => ({ ...prev, [k]: v }))
    if (k === 'bio' || k === 'qualifications' || k === 'teaching_experience') {
      setErrors(prev => ({ ...prev, [k]: undefined }))
    }
  }

  const onBankChange = (k: keyof typeof form.bank, v: string) => {
    let next = v
    if (k === 'ifsc_code') next = v.toUpperCase()
    if (k === 'account_number') next = v.replace(/[^0-9]/g, '')
    setForm(prev => ({ ...prev, bank: { ...prev.bank, [k]: next } }))
    setErrors(prev => ({ ...prev, [`bank.${k}`]: undefined }))
  }

  const onSave = async () => {
    const parsed = TutorSchema.safeParse(form);
    console.log(parsed.success);
    
    if (!parsed.success) {
      const e: Record<string, string> = {}
      parsed.error.issues.forEach(i => { e[String(i.path.join('.'))] = i.message })
      setErrors(e)
      // If there are non-bank errors, surface a general inline message for this step
      const hasNonBankError = parsed.error.issues.some(i => i.path[0] !== 'bank')
      if (hasNonBankError) {
        const first = parsed.error.issues.find(i => i.path[0] !== 'bank')
        setGeneralError(first?.message || 'Please complete required details in previous steps.')
      } else {
        setGeneralError(null)
      }
      return
    }
    setGeneralError(null)
    setLoading(true)
    const payload: TutorDetailsUpdate = {
      bio: form.bio.trim(),
      qualifications: form.qualifications.trim(),
      teaching_experience: form.teaching_experience.trim(),
      specializations: form.specializations ? form.specializations.split(',').map(s => s.trim()).filter(Boolean) : [],
      languages_spoken: form.languages_spoken ? form.languages_spoken.split(',').map(s => s.trim()).filter(Boolean) : [],
      expertise_areas: form.expertise_areas ? form.expertise_areas.split(',').map(s => s.trim()).filter(Boolean) : [],
      bank_details: {
        account_holder_name: form.bank.account_holder_name.trim(),
        account_number: form.bank.account_number.replace(/\s+/g, ''),
        ifsc_code: form.bank.ifsc_code.toUpperCase().trim(),
        bank_name: form.bank.bank_name.trim(),
        account_type: form.bank.account_type,
        verified: false,
      }
    }
    await saveTutorDetails(payload as any)
    await completeOnboarding()
    router.push('/tutor/dashboard')
  }

  // Step 1 field validations on blur
  const validateProfileField = (k: 'bio' | 'qualifications' | 'teaching_experience', v: string) => {
    if (k === 'bio') {
      if (!v || v.trim().length < 10) {
        setErrors(prev => ({ ...prev, bio: 'Bio must be at least 10 characters' }))
      } else {
        setErrors(prev => ({ ...prev, bio: undefined }))
      }
      return
    }
    if (k === 'qualifications') {
      if (!v || v.trim().length < 2) {
        setErrors(prev => ({ ...prev, qualifications: 'Qualifications required' }))
      } else {
        setErrors(prev => ({ ...prev, qualifications: undefined }))
      }
      return
    }
    if (k === 'teaching_experience') {
      if (!v || v.trim().length < 2) {
        setErrors(prev => ({ ...prev, teaching_experience: 'Experience required' }))
      } else {
        setErrors(prev => ({ ...prev, teaching_experience: undefined }))
      }
    }
  }

  const isStep1Valid = (() => {
    const bioOk = form.bio.trim().length >= 10
    const qualOk = form.qualifications.trim().length >= 2
    const expOk = form.teaching_experience.trim().length >= 2
    return bioOk && qualOk && expOk
  })()

  const handleTutorRegistrationPayment = async () => {
    try {
      setLoading(true)
      const ok = await loadRazorpayScript()
      if (!ok) {
        showToast('Failed to load payment gateway. Please retry.', 'error')
        setLoading(false)
        return
      }

      const order = await paymentsApi.createOrder({ orderType: 'tutor_registration', amount: 1000 })
      // Always use backend amount
      const options: any = {
        key: order.keyId,
        order_id: order.razorpayOrderId,
        amount: order.amount * 100,
        currency: order.currency,
        name: 'OpenEdu',
        description: 'Tutor Registration Fee',
        handler: async (response: any) => {
          try {
            await paymentsApi.verifyPayment({
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            })
            // Fetch latest orders and show the most recent status
            try {
              const orders = await paymentsApi.getUserOrders('week', 'desc')
              const latest = orders?.[0]
              if (latest) {
                showToast(`Payment ${latest.status.toLowerCase()}. Order #${latest.orderId}`, 'success')
              }
            } catch {}

            // Refetch current user to ensure we read backend flags
            await fetchProfile()
            const u: any = (useAuthStore as any).getState().user
            const td = u?.tutor_details
            const paid = !!td?.register_fees_paid
            const vstatus = td?.verification_status || 'pending'
            if (paid) {
              setStep(3)
            } else {
              showToast('Payment verified, but status not reflected yet. Please retry or contact support.', 'warning')
            }
          } catch (e) {
            showToast('Verification failed. Please contact support or retry.', 'error')
          }
        },
        modal: {
          ondismiss: () => {
            showToast('Payment cancelled.', 'warning')
          }
        }
      }
      // @ts-ignore
      if (!(window as any).Razorpay) {
        showToast('Payment gateway unavailable. Please refresh and try again.', 'error')
      } else {
        const rz = new window.Razorpay(options)
        rz.open()
      }
    } catch (e: any) {
      const msg = e?.response?.data?.error?.message || e?.response?.data?.message || e?.message || 'Payment failed. Please try again.'
      showToast(msg, 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-neutral-50 min-h-screen">
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-neutral-900">Tutor Onboarding</h1>
            <span className="text-sm text-neutral-600">Step {step} of 3</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div className="bg-primary-600 h-2 rounded-full transition-all duration-300" style={{ width: `${(step / 3) * 100}%` }}></div>
          </div>
        </div>

        <Card>
          <CardContent className="p-8 space-y-8">
            {step === 1 && (
              <div>
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-8 h-8 text-primary-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4 text-center">Your Professional Profile</h2>

                <div className="space-y-4 max-w-2xl mx-auto">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bio *</label>
                    <textarea className={`w-full px-4 py-3 border rounded-lg ${errors.bio ? 'border-red-500' : 'border-gray-300'}`} value={form.bio} onChange={e => onChange('bio', e.target.value)} onBlur={e => validateProfileField('bio', e.target.value)} />
                    {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Qualifications *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors.qualifications ? 'border-red-500' : 'border-gray-300'}`} value={form.qualifications} onChange={e => onChange('qualifications', e.target.value)} onBlur={e => validateProfileField('qualifications', e.target.value)} />
                      {errors.qualifications && <p className="mt-1 text-sm text-red-600">{errors.qualifications}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Teaching Experience *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors.teaching_experience ? 'border-red-500' : 'border-gray-300'}`} value={form.teaching_experience} onChange={e => onChange('teaching_experience', e.target.value)} onBlur={e => validateProfileField('teaching_experience', e.target.value)} />
                      {errors['teaching_experience'] && <p className="mt-1 text-sm text-red-600">{errors['teaching_experience']}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Specializations (comma-separated)</label>
                      <input className='w-full px-4 py-3 border rounded-lg border-gray-300' value={form.specializations} onChange={e => onChange('specializations', e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Languages Spoken (comma-separated)</label>
                      <input className='w-full px-4 py-3 border rounded-lg border-gray-300' value={form.languages_spoken} onChange={e => onChange('languages_spoken', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expertise Areas (comma-separated)</label>
                    <input className='w-full px-4 py-3 border rounded-lg border-gray-300' value={form.expertise_areas} onChange={e => onChange('expertise_areas', e.target.value)} />
                  </div>

                  <div className="flex justify-end">
                    <Button size="lg" onClick={() => setStep(2)} disabled={!isStep1Valid}>Continue</Button>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="text-center">
                <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CreditCard className="w-8 h-8 text-secondary-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4">Onboarding Fee</h2>
                <p className="text-neutral-600 mb-8 max-w-2xl mx-auto">A one-time fee of ₹1000 is required to verify your account and start creating courses.</p>

                <div className="bg-neutral-50 rounded-lg p-6 mb-8 max-w-md mx-auto">
                  <div className="text-3xl font-bold text-neutral-900 mb-2">₹1,000</div>
                  <div className="text-sm text-neutral-600">One-time onboarding fee</div>
                </div>

                <div className="flex flex-col items-center space-y-3">
                  <div className="flex justify-center">
                    <Button size="lg" onClick={handleTutorRegistrationPayment} disabled={loading}>{loading ? 'Processing...' : 'Make Payment'}</Button>
                  </div>
                  <p className="text-xs text-neutral-500">You will be redirected to Razorpay. We only proceed after successful verification.</p>
                </div>

                {/* Payment is validated server-side via verification; no client error here */}
              </div>
            )}

            {step === 3 && (
              <div>
                <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-8 h-8 text-success-600" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 mb-4 text-center">Bank Details</h2>

                <div className="space-y-4 max-w-2xl mx-auto">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Holder Name *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors['bank.account_holder_name'] ? 'border-red-500' : 'border-gray-300'}`} value={form.bank.account_holder_name} onChange={e => onBankChange('account_holder_name', e.target.value)} />
                      {errors['bank.account_holder_name'] && <p className="mt-1 text-sm text-red-600">{errors['bank.account_holder_name']}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Account Number *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors['bank.account_number'] ? 'border-red-500' : 'border-gray-300'}`} value={form.bank.account_number} onChange={e => onBankChange('account_number', e.target.value)} />
                      {errors['bank.account_number'] && <p className="mt-1 text-sm text-red-600">{errors['bank.account_number']}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">IFSC Code *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors['bank.ifsc_code'] ? 'border-red-500' : 'border-gray-300'}`} value={form.bank.ifsc_code} onChange={e => onBankChange('ifsc_code', e.target.value)} />
                      {errors['bank.ifsc_code'] && <p className="mt-1 text-sm text-red-600">{errors['bank.ifsc_code']}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name *</label>
                      <input className={`w-full px-4 py-3 border rounded-lg ${errors['bank.bank_name'] ? 'border-red-500' : 'border-gray-300'}`} value={form.bank.bank_name} onChange={e => onBankChange('bank_name', e.target.value)} />
                      {errors['bank.bank_name'] && <p className="mt-1 text-sm text-red-600">{errors['bank.bank_name']}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account Type *</label>
                    <select className='w-full px-4 py-3 border rounded-lg border-gray-300' value={form.bank.account_type} onChange={e => onBankChange('account_type', e.target.value)}>
                      <option value='savings'>Savings</option>
                      <option value='current'>Current</option>
                    </select>
                  </div>

                  <div className="flex justify-between pt-2">
                    <Button variant="outline" onClick={() => setStep(2)}>Back</Button>
                    <Button size="lg" onClick={onSave} disabled={loading || !BankSchema.safeParse(form.bank).success}>{loading ? 'Saving...' : 'Save and Finish'}</Button>
                  </div>
                  {!BankSchema.safeParse(form.bank).success && (
                    <p className="text-sm text-red-600 pt-2">
                      {BankSchema.safeParse(form.bank).success ? null : BankSchema.safeParse(form.bank).success ? null : BankSchema.safeParse(form.bank).success}
                    </p>
                  )}
                  {(!BankSchema.safeParse(form.bank).success || generalError) && (
                    <p className="text-sm text-red-600">
                      {generalError || (BankSchema.safeParse(form.bank) as any).error?.issues?.[0]?.message || 'Please fix the highlighted fields.'}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Step navigation: payment advances to step 3 after backend verification */}
          </CardContent>
        </Card>

        <div className="mt-8">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Our support team is here to help you complete the onboarding process.</p>
              <div className="flex space-x-4">
                <Button variant="outline" size="sm">Contact Support</Button>
                <Button variant="outline" size="sm">View FAQ</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
