'use client'

import { TopNavigation } from "@/components/ui/TopNavigation";
import { useInternalRouter } from "@/hooks/useInternalRouter";

export default function NavBar() {
  const router = useInternalRouter();
  return (
    <TopNavigation.Preset title="학기별 세부 성적" type="back" onNavigationClick={() => router.back()} />
  )
}