import Image from "next/image";

export default function StudioLogo(props: any) {
  const { renderDefault, title } = props;
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