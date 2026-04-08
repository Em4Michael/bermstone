import { redirect } from 'next/navigation';

export default function PropertyRedirect({ params }: { params: { id: string } }) {
  redirect(`/keyneet/${params.id}`);
}
