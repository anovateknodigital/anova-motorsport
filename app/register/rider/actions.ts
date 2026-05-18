'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

interface ClassEntry {
  classId: string;
  category: string;
  motorcycleBrand: string;
  frameNumber: string;
  engineNumber: string;
  startNumber: string;
  registrationFee?: number;
}

export async function submitRiderRegistration(
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Anda harus login terlebih dahulu' };
  }

  // Parse form data
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const teamName = formData.get('team_name') as string;
  const birthPlace = formData.get('birth_place') as string;
  const birthDate = formData.get('birth_date') as string;
  const idNumber = formData.get('id_number') as string;
  const provinceId = formData.get('province_id') as string;
  const regencyId = formData.get('regency_id') as string;
  const kisNumber = formData.get('kis_number') as string;
  const ktaNumber = formData.get('kta_number') as string;
  const eventId = formData.get('event_id') as string;

  // Parse class entries (JSON string) - Optional for initial registration
  const classesJson = formData.get('classes') as string;
  const classes: ClassEntry[] = classesJson ? JSON.parse(classesJson) : [];

  // Validation
  if (!name || !city || !birthPlace || !birthDate || !idNumber || !provinceId || !regencyId) {
    return { success: false, message: 'Data pembalap tidak lengkap' };
  }

  // Get manager profile
  const { data: manager } = await supabase
    .from('profiles')
    .select('id, team_name')
    .eq('id', user.id)
    .single();

  if (!manager) {
    return { success: false, message: 'Profil manager tidak ditemukan' };
  }

  // Create rider
  const { data: rider, error: riderError } = await supabase
    .from('riders')
    .insert({
      manager_id: user.id,
      name,
      city,
      province_id: provinceId,
      regency_id: regencyId,
      team_name: teamName || manager.team_name,
      birth_place: birthPlace,
      birth_date: birthDate,
      id_number: idNumber,
      kis_number: kisNumber,
      kta_number: ktaNumber,
      event_id: Number(eventId),
    })
    .select()
    .single();

  if (riderError) {
    console.error('Rider creation error:', riderError);
    return { success: false, message: `Gagal membuat data pembalap: ${riderError.message}` };
  }

  if (classes.length > 0) {
    const classRegistrations = classes.map((cls) => ({
      rider_id: rider.id,
      class_id: cls.classId,
      category: cls.category,
      motorcycle_brand: cls.motorcycleBrand,
      frame_number: cls.frameNumber,
      engine_number: cls.engineNumber,
      start_number: cls.startNumber,
      registration_fee: cls.registrationFee ?? 0,
    }));

    const { error: classError } = await supabase
      .from('rider_class_registrations')
      .insert(classRegistrations);

    if (classError) {
      console.error('Class registration error:', classError);
      return { success: false, message: `Gagal mendaftarkan kelas: ${classError.message}` };
    }
  }

  // Return success info for client to process QRIS
  return { 
    success: true, 
    message: 'Pendaftaran berhasil',
    riderId: rider.id,
    eventId: eventId
  };
}

export async function updateRiderRegistration(
  riderId: string,
  prevState: { success: boolean; message: string } | null,
  formData: FormData
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { success: false, message: 'Anda harus login terlebih dahulu' };
  }

  // Parse form data
  const name = formData.get('name') as string;
  const city = formData.get('city') as string;
  const teamName = formData.get('team_name') as string;
  const birthPlace = formData.get('birth_place') as string;
  const birthDate = formData.get('birth_date') as string;
  const idNumber = formData.get('id_number') as string;
  const kisNumber = formData.get('kis_number') as string;
  const ktaNumber = formData.get('kta_number') as string;
  const provinceId = formData.get('province_id') as string;
  const regencyId = formData.get('regency_id') as string;

  if (!name || !city || !birthPlace || !birthDate || !idNumber || !provinceId || !regencyId) {
    return { success: false, message: 'Data pembalap tidak lengkap' };
  }

  // Verify rider belongs to this manager
  const { data: existingRider } = await supabase
    .from('riders')
    .select('id, manager_id')
    .eq('id', riderId)
    .single();

  if (!existingRider || existingRider.manager_id !== user.id) {
    return { success: false, message: 'Pembalap tidak ditemukan atau akses ditolak' };
  }

  // Update rider
  const { error: riderError } = await supabase
    .from('riders')
    .update({
      name,
      city,
      province_id: provinceId,
      regency_id: regencyId,
      team_name: teamName,
      birth_place: birthPlace,
      birth_date: birthDate,
      id_number: idNumber,
      kis_number: kisNumber || null,
      kta_number: ktaNumber || null,
    })
    .eq('id', riderId);

  if (riderError) {
    console.error('Rider update error:', riderError);
    return { success: false, message: `Gagal memperbarui data pembalap: ${riderError.message}` };
  }

  redirect('/register/dashboard');
}

export async function registerRiderClass(
  riderId: string,
  eventId: number,
  classes: ClassEntry[]
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Anda harus login terlebih dahulu');
  }

  // Delete all existing pending registrations for this rider
  // This allows the modal to "sync" by replacing the pending ones
  const { error: deleteError } = await supabase
    .from('rider_class_registrations')
    .delete()
    .eq('rider_id', riderId)
    .eq('payment_status', 'pending');

  if (deleteError) {
    console.error('Error deleting pending classes:', deleteError);
    throw new Error(`Gagal memperbarui kelas: ${deleteError.message}`);
  }

  if (classes && classes.length > 0) {
    const classRegistrations = classes.map((cls) => ({
      rider_id: riderId,
      class_id: cls.classId,
      category: cls.category || 'open',
      motorcycle_brand: cls.motorcycleBrand,
      frame_number: cls.frameNumber,
      engine_number: cls.engineNumber,
      start_number: cls.startNumber,
      registration_fee: cls.registrationFee ?? 0,
      payment_status: 'pending'
    }));

    const { error: classError } = await supabase
      .from('rider_class_registrations')
      .insert(classRegistrations);

    if (classError) {
      console.error('Class registration error:', classError);
      throw new Error(`Gagal mendaftarkan kelas: ${classError.message}`);
    }
  }

  return { success: true, message: 'Berhasil memperbarui pendaftaran kelas' };
}

export async function updateRiderTechDetails(
  riderId: string,
  classId: number,
  techDetails: { motorcycleBrand: string; frameNumber: string; engineNumber: string }
) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Anda harus login terlebih dahulu');
  }

  const { error } = await supabase
    .from('rider_class_registrations')
    .update({
      motorcycle_brand: techDetails.motorcycleBrand,
      frame_number: techDetails.frameNumber,
      engine_number: techDetails.engineNumber,
    })
    .eq('rider_id', riderId)
    .eq('class_id', classId);

  if (error) {
    console.error('Update tech details error:', error);
    throw new Error(`Gagal memperbarui detail kendaraan: ${error.message}`);
  }

  return { success: true };
}
