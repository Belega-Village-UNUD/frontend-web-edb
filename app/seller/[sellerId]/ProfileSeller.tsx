import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaStar } from "react-icons/fa";
import { MdVerified } from "react-icons/md";

function ProfileSeller({ data }: any) {
  return (
    <div className="flex flex-col sm:flex-row bg-gray-50 py-4 items-center border mt-2 border-gray-200 px-6 w-full rounded-2xl shadow-md">
      <Avatar className="w-32 h-32 sm:w-24 sm:h-24">
        <AvatarImage src={data?.store?.avatar_link} alt="seller" />
        <AvatarFallback>{"User"}</AvatarFallback>
      </Avatar>
      <div className="ml-5 flex flex-col gap-3 justify-center max-w-[80%] sm:max-w-full">
        <h3 className="font-semibold text-gray-700 text-xl sm:text-lg max-w-[200px] flex flex-row items-center gap-1">
          {data?.store?.name}
          <MdVerified className="w-6 h-6 sm:w-5 sm:h-5 text-blue-500" />
        </h3>
        <h3 className="text-sm sm:text-base">
          <span>{data?.store?.address}, </span>
          <span>{data?.store?.province?.province}</span>
        </h3>
      </div>
      <div className="w-full flex justify-center sm:justify-end sm:mt-0 mt-5">
        <div className="flex flex-col gap-2 items-center sm:flex-row sm:gap-5">
          <span className="text-sm sm:text-base">Rating & reviews</span>
          <div className="flex flex-row gap-1 items-center">
            <span className="text-lg sm:text-base font-semibold">{data?.average_rating || 0}</span>
            <FaStar className="text-yellow-500 w-6 h-6 sm:w-5 sm:h-5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileSeller;
