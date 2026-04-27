import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Radio, MonitorOff, Clock, BookOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { useLiveBroadcast } from '@/hooks/queries/useBroadcast';

function CountdownTimer({ seconds }: { seconds: number }) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
    const id = setInterval(() => setRemaining((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [seconds]);

  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Clock className="h-4 w-4" />
      <span className="text-sm font-mono">
        Next in {mins > 0 ? `${mins}m ` : ''}{secs}s
      </span>
    </div>
  );
}

function RotationDots({ total, current }: { total: number; current: number }) {
  return (
    <div className="flex gap-1.5 justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${i === current ? 'w-4 h-2.5 bg-primary' : 'w-2.5 h-2.5 bg-muted-foreground/30'}`}
        />
      ))}
    </div>
  );
}

export function LiveBroadcast() {
  const { teacherId, subject } = useParams<{ teacherId: string; subject?: string }>();
  const { data, isLoading } = useLiveBroadcast(teacherId!, subject);

  const broadcast = data?.data;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-6 py-4 border-b">
        <div className="flex items-center gap-2">
          <Radio className="h-5 w-5 text-primary animate-pulse" />
          <span className="font-semibold">Live Broadcast</span>
          {subject && <Badge variant="secondary" className="capitalize">{subject}</Badge>}
        </div>
        <ThemeToggle />
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        {isLoading ? (
          <div className="w-full max-w-2xl space-y-4">
            <Skeleton className="w-full aspect-video rounded-xl" />
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : !broadcast ? (
          <div className="text-center">
            <div className="rounded-full bg-muted p-6 mx-auto mb-4 w-fit">
              <MonitorOff className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No Active Content</h2>
            <p className="text-muted-foreground text-sm max-w-sm">
              There is no content currently broadcasting for this channel.
              Check back later or try a different subject.
            </p>
          </div>
        ) : (
          <div className="w-full max-w-3xl">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border bg-black aspect-video mb-6">
              <img
                src={broadcast.content.fileUrl}
                alt={broadcast.content.title}
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 left-3">
                <Badge className="bg-red-500 hover:bg-red-500 text-white animate-pulse">
                  <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-white inline-block" />
                  LIVE
                </Badge>
              </div>
            </div>

            <div className="flex items-start justify-between mb-3">
              <div>
                <h1 className="text-2xl font-bold">{broadcast.content.title}</h1>
                {broadcast.content.description && (
                  <p className="text-muted-foreground text-sm mt-1">{broadcast.content.description}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 ml-4 flex-shrink-0">
                <Badge variant="secondary" className="capitalize flex items-center gap-1">
                  <BookOpen className="h-3 w-3" />
                  {broadcast.content.subject}
                </Badge>
                <CountdownTimer seconds={broadcast.secondsRemaining} />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
              <span>Teacher: {broadcast.content.uploadedBy.name}</span>
              <span>{broadcast.currentIndex + 1} / {broadcast.totalInRotation}</span>
            </div>

            <div className="flex justify-center">
              <RotationDots total={broadcast.totalInRotation} current={broadcast.currentIndex} />
            </div>
          </div>
        )}
      </main>

      <footer className="text-center py-3 text-xs text-muted-foreground border-t">
        Auto-refreshes every 5 seconds · Content Broadcasting System
      </footer>
    </div>
  );
}
