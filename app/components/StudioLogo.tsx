import type { JSX } from "react";
import Image from "next/image";

type StudioLogoProps = {
  renderDefault: (props: StudioLogoProps) => JSX.Element;
  title?: string;
};

export default function StudioLogo(props: StudioLogoProps) {
  const { renderDefault } = props;
  return (
    <div className="flex items-center gap-2">
      {/* Ensure you have icon.jpg in your public/app folder, or change this path */}
      <Image 
        src="/icon.jpg" 
        alt="Penn Rock" 
        width={25} 
        height={25} 
        className="rounded-none object-cover"
      />
      <>{renderDefault(props)}</>
    </div>
  );
}