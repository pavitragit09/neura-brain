import { adminWidgets } from "@/lib/mock/home-data";
import { useAuthStore } from "@/store/auth-store";

export function AdminWidgets() {
  const role = useAuthStore((state) => state.user?.role);

  if (role !== "admin") {
    return null;
  }

  return (
    <section aria-label="Admin summary" className="flex flex-col gap-3.5 select-none">
      <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80 px-1">
        Admin overview
      </h3>
      <div className="grid gap-4 sm:grid-cols-3">
        {adminWidgets.map((widget) => (
          <div
            key={widget.id}
            className="rounded-xl border border-border/30 bg-card p-5 shadow-sm/5 transition-all duration-200 hover:shadow-md/5"
          >
            <p className="text-[11px] font-medium text-muted-foreground/80 uppercase tracking-wider">
              {widget.label}
            </p>
            <p className="mt-2 text-2xl font-medium tracking-tight text-foreground/90">
              {widget.value}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground/75 leading-relaxed">
              {widget.detail}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
