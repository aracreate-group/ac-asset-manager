import { cn } from "@/lib/utils"

const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/50 dark:bg-muted/20",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
