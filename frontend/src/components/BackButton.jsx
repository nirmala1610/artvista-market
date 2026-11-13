import { ArrowLeft } from "lucide-react";

export default function BackButton() {

  const goBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.location.href = "/";
    }
  };

  return (
    <button
      onClick={goBack}
      className="
        group
        flex
        items-center
        gap-2

        text-white/70
        text-lg
        font-medium
        tracking-wide

        transition-all
        duration-300

        hover:text-cyan-300
        active:scale-90
      "
    >
      <ArrowLeft
        size={20}
        className="
          transition-all
          duration-300

          group-hover:-translate-x-2
          group-hover:text-cyan-300
        "
      />

      <span
        className="
          relative

          after:absolute
          after:left-0
          after:-bottom-1
          after:h-[1px]
          after:w-0
          after:bg-cyan-300

          after:transition-all
          after:duration-300

          group-hover:after:w-full
        "
      >
        Back
      </span>
    </button>
  );
}