const fs = require('fs');
let content = fs.readFileSync('app/register/rider/edit/[id]/page.tsx', 'utf8');

// 1. Update the input grids for both main and supporting classes
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

// 2. Badge DRAG MODE
content = content.replace(
  /<h2 className="text-xl font-bold text-white">Pemilihan Kelas<\/h2>/,
  `<h2 className="text-xl font-bold text-white">Pemilihan Kelas</h2>
                  {isDragEvent && (
                    <span className="ml-4 bg-[#D32F2F]/20 text-[#D32F2F] border border-[#D32F2F]/30 text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">
                      DRAG MODE
                    </span>
                  )}`
);

// Fix the redirect behavior in handleSubmit? 
// The edit page might still redirect on save. Let's let it redirect to dashboard since editing doesn't generate QRIS.
// But wait, what if they added a new class? We should probably just tell the user to pay for new classes later.
// Currently the edit page calls updateRiderRegistration which might redirect. Let's leave that as is for now, or just make sure it redirects to dashboard.

fs.writeFileSync('app/register/rider/edit/[id]/page.tsx', content);
console.log('Successfully updated edit/[id]/page.tsx');
