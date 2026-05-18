const fs = require('fs');
let content = fs.readFileSync('app/register/rider/new/page.tsx', 'utf8');

// 1. Add CheckCircle2 to imports
content = content.replace(
  /Clock, Loader2, Save,/,
  "Clock, Loader2, Save, CheckCircle2,"
);

// 2. Add isDragEvent
content = content.replace(
  /const mainClasses = raceClasses.filter.*?;\n\s*const supportingClasses = raceClasses.filter.*?;/g,
  `const mainClasses = raceClasses.filter((c) => c.class_category === 'main-class');\n  const supportingClasses = raceClasses.filter((c) => c.class_category === 'supporting-class');\n  const isDragEvent = selectedEvent?.category?.toLowerCase()?.includes('drag') || selectedEvent?.category?.toLowerCase()?.includes('drag bike');`
);

// 3. Add QR Modal State
content = content.replace(
  /const \[submitError, setSubmitError\] = useState<string \| null>\(null\);/,
  `const [submitError, setSubmitError] = useState<string | null>(null);\n  const [qrisData, setQrisData] = useState<{qr_string: string, amount: number, payment_id: string} | null>(null);\n  const [showQrisModal, setShowQrisModal] = useState(false);`
);

// 4. Update handleSubmit
content = content.replace(
  /const result = await submitRiderRegistration\(null, formData\);[\s\S]*?catch \(err: any\) \{/g,
  `const result = await submitRiderRegistration(null, formData);
      
      if (result && !result.success) {
        setSubmitError(result.message || 'Gagal mendaftarkan pembalap');
        setIsSubmitting(false);
        return;
      }

      if (result && result.success && result.riderId && selectedEvent) {
        // Panggil edge function xendit-create-qris
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (!session) throw new Error('No session');

          const qrisRes = await fetch(\`\${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/xendit-create-qris\`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': \`Bearer \${session.access_token}\`
            },
            body: JSON.stringify({
              rider_id: result.riderId,
              event_id: selectedEvent.id
            })
          });

          const qrisData = await qrisRes.json();
          if (qrisData.success) {
            setQrisData(qrisData);
            setShowQrisModal(true);
            setIsSubmitting(false);
            return;
          } else {
            throw new Error(qrisData.error || 'Gagal generate QRIS');
          }
        } catch (qrisErr: any) {
          console.error('QRIS Error:', qrisErr);
          setSubmitError('Pendaftaran berhasil, tapi gagal generate QRIS. Silakan cek di Dashboard.');
          setIsSubmitting(false);
          // Auto redirect after 3 seconds
          setTimeout(() => {
            window.location.href = '/register/dashboard';
          }, 3000);
          return;
        }
      }

    } catch (err: any) {`
);

// 5. Update the input grids for both main and supporting classes
const gridReplacement = `
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Nomor Start <span className="text-[#D32F2F]">*</span></label>
                                            <input
                                              type="text"
                                              value={entry.startNumber}
                                              onChange={(e) => updateMainClass(entry.id, 'startNumber', e.target.value)}
                                              required
                                              placeholder="Contoh: 123"
                                              className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase font-bold">Merek Motor {!isDragEvent && <span className="text-[#D32F2F]">*</span>}</label>
                                            <input
                                              type="text"
                                              value={entry.motorcycleBrand}
                                              onChange={(e) => updateMainClass(entry.id, 'motorcycleBrand', e.target.value)}
                                              required={!isDragEvent}
                                              placeholder="Contoh: Honda"
                                              className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase font-bold">No. Rangka {!isDragEvent && <span className="text-[#D32F2F]">*</span>}</label>
                                            <input
                                              type="text"
                                              value={entry.frameNumber}
                                              onChange={(e) => updateMainClass(entry.id, 'frameNumber', e.target.value)}
                                              required={!isDragEvent}
                                              placeholder="No. Rangka"
                                              className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                                            />
                                          </div>
                                          <div className="space-y-1">
                                            <label className="text-[10px] text-zinc-500 uppercase font-bold">No. Mesin {!isDragEvent && <span className="text-[#D32F2F]">*</span>}</label>
                                            <input
                                              type="text"
                                              value={entry.engineNumber}
                                              onChange={(e) => updateMainClass(entry.id, 'engineNumber', e.target.value)}
                                              required={!isDragEvent}
                                              placeholder="No. Mesin"
                                              className="w-full bg-zinc-800 border border-zinc-700 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-[#D32F2F] transition-colors"
                                            />
                                          </div>
                                        </div>
`;

content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-3">[\s\S]*?onChange={\(e\) => updateMainClass[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>/g,
  gridReplacement.trim()
);

const gridReplacementSupporting = gridReplacement.replace(/updateMainClass/g, 'updateSupportingClass');
content = content.replace(
  /<div className="grid grid-cols-1 md:grid-cols-3 gap-3">[\s\S]*?onChange={\(e\) => updateSupportingClass[\s\S]*?<\/div>\n\s*<\/div>\n\s*<\/div>/g,
  gridReplacementSupporting.trim()
);

// 6. Add QRIS Modal JSX
const modalJSX = `
      {showQrisModal && qrisData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-full h-2 bg-[#D32F2F]" />
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4 mt-2">
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2 font-teko uppercase italic text-3xl">Pendaftaran Berhasil!</h2>
            <p className="text-zinc-400 text-sm mb-6">Scan QR Code di bawah untuk menyelesaikan pembayaran via QRIS.</p>
            
            <div className="bg-white p-4 rounded-xl mx-auto w-fit mb-6">
              <img 
                src={\`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=\${encodeURIComponent(qrisData.qr_string)}\`}
                alt="QRIS Payment"
                width="250"
                height="250"
                className="mx-auto"
              />
            </div>
            
            <div className="bg-zinc-800/50 rounded-lg p-4 mb-8">
              <p className="text-zinc-400 text-xs uppercase tracking-wider mb-1">Total Pembayaran</p>
              <p className="text-3xl font-bold text-[#D32F2F]">Rp {qrisData.amount.toLocaleString('id-ID')}</p>
            </div>
            
            <Link
              href="/register/dashboard"
              className="w-full block bg-white text-black hover:bg-zinc-200 py-4 rounded-lg font-bold uppercase tracking-wider text-sm transition-all"
            >
              Selesai & Kembali ke Dashboard
            </Link>
          </div>
        </div>
      )}
`;

content = content.replace(/<\/div>\n\s*<\/div>\n\s*<\/div>\n\s*<div className="bg-zinc-950 border-t border-zinc-800 py-8">/, modalJSX + `\n        </div>\n        </div>\n\n        {/* Footer */}\n        <div className="bg-zinc-950 border-t border-zinc-800 py-8">`);

// 7. Add event_id to FormData
content = content.replace(
  /formData\.append\('classes', JSON\.stringify\(classEntries\)\);/,
  `formData.append('classes', JSON.stringify(classEntries));\n    if (selectedEvent) formData.append('event_id', selectedEvent.id.toString());`
);

// 8. Badge DRAG MODE
content = content.replace(
  /<h2 className="text-xl font-bold text-white">Pemilihan Kelas<\/h2>/,
  `<h2 className="text-xl font-bold text-white">Pemilihan Kelas</h2>
                  {isDragEvent && (
                    <span className="ml-4 bg-[#D32F2F]/20 text-[#D32F2F] border border-[#D32F2F]/30 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                      DRAG MODE
                    </span>
                  )}`
);

fs.writeFileSync('app/register/rider/new/page.tsx', content);
console.log('Successfully updated new/page.tsx');
