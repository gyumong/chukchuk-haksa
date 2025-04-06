import { cache } from 'react';

interface Semester {
  year: number;
  semester: number;
}


export const getSemesters = cache(async () : Promise<Semester[]> => {
  const abtoken = process.env.TEST_TOKEN;
  const token = process.env.TEST_TOKEN2;
  console.log('🔥 실제 fetch 발생! [getSemesters]');
  
  const res = await fetch(`http://localhost:3000/api/get-semesters`, {
    cache: 'force-cache',
    headers: {
      'Cookie': `${abtoken}; ${token}`, 
    },
    credentials: 'include',         
    next: { tags: ['semesters'], revalidate: 60 * 60 * 24 } 
  });

  if (!res.ok) {throw new Error('Failed to fetch');}  
  return res.json();
});