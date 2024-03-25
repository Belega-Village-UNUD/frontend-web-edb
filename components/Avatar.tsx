import Image from "next/image";
import { FaUserCircle } from "react-icons/fa";

interface AvatarProps {
  src?: string | null | undefined,
  size?: number,
  height?: number,
  width?: number,
}

const Avatar: React.FC<AvatarProps> = ({ src, size, height, width }) => {
  if (src) {
    return (
      <div className="relative rounded-full overflow-hidden" style={{ height, width }}>
        <Image src={src} alt="Avatar" layout="fill" objectFit="cover" objectPosition="center" loading="lazy" />
      </div>
    )
  }

  return <FaUserCircle size={size ? size : 30} className="text-slate-300" />
}

export default Avatar;