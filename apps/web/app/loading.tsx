import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="space-y-6">
      <Card className="rounded-[30px] border-white/10 bg-slate-950/60 p-5">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="mt-4 h-12 w-full max-w-3xl" />
      </Card>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        {Array.from({ length: 5 }, (_, index) => (
          <Card key={index}>
            <Skeleton className="h-4 w-28" />
            <Skeleton className="mt-4 h-10 w-32" />
            <Skeleton className="mt-4 h-3 w-40" />
          </Card>
        ))}
      </div>
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.35fr)_360px]">
        <Card>
          <Skeleton className="h-[360px] w-full" />
        </Card>
        <div className="space-y-6">
          {Array.from({ length: 3 }, (_, index) => (
            <Card key={index}>
              <Skeleton className="h-5 w-36" />
              <Skeleton className="mt-4 h-20 w-full" />
              <Skeleton className="mt-3 h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
