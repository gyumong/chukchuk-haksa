'use client';


import LoadingScreen from '@/app/(funnel)/components/LoadingScreen/LoadingScreen';

export default function UITEST() {



    return <LoadingScreen targetPath="/complete" minRepeatCount={3} onComplete={()=>console.log('complete')}/>;
}
