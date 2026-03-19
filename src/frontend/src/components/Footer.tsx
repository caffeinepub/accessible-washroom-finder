import { Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const appIdentifier =
    typeof window !== "undefined"
      ? encodeURIComponent(window.location.hostname)
      : "happy-girlfriend";

  return (
    <footer className="border-t border-border py-8 mt-4">
      <div className="max-w-lg mx-auto px-6 text-center">
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-1.5 flex-wrap">
          <span>© {currentYear}. Built with</span>
          <Heart
            className="w-3.5 h-3.5 text-primary fill-primary inline-block"
            aria-hidden="true"
          />
          <span>using</span>
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-foreground hover:text-primary transition-colors underline underline-offset-2"
          >
            caffeine.ai
          </a>
        </p>
      </div>
    </footer>
  );
}
