import { createClient } from '@/lib/supabase/server';
import ClassesTab from '../ClassesTab';

export const metadata = {
  title: 'Manajemen Kelas | Dashboard Admin | Anova Motorsport',
  description: 'Kelola kelas balap untuk event',
};

export default async function ClassesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  return <ClassesTab user={user} />;
}
