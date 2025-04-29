// File: app/hewan-peliharaan/[key]/delete/page.tsx  (Delete Pet with Dummy Data)
'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';

export default function DeletePet() {
  const { key } = useParams();
  const router = useRouter();
  const [pet, setPet] = useState<any>(null);

  useEffect(() => {
    setPet({ nama: 'Snowy', pemilik: 'John Doe' });
  }, []);

  if (!pet) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-red-600 text-xl font-bold mb-4">Delete Pet</h2>
      <p>Are you sure you want to delete pet <strong>{pet.nama}</strong> owned by <strong>{pet.pemilik}</strong>?</p>
      <div className="mt-4 flex space-x-2">
        <button onClick={()=>router.back()} className="px-4 py-2 border rounded">Cancel</button>
        <button onClick={()=>router.push('/hewan-peliharaan')} className="px-4 py-2 bg-red-600 text-white rounded">Confirm Deletion</button>
      </div>
    </div>
  );
}