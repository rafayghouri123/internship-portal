"use client";

export function PrintNowButton() {
  return (
    <button
      className="rounded-md bg-[#C8102E] px-4 py-2 text-sm font-medium text-white hover:bg-[#A00D24]"
      onClick={() => globalThis.print()}
      type="button"
    >
      Print now
    </button>
  );
}
