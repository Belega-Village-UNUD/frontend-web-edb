import Loading from "@/components/Loading";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StarIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import { GrLocationPin } from "react-icons/gr";
import { IoStorefrontOutline } from "react-icons/io5";
function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
function InfoSeller({ product }: any) {
  const {
    isFetching,
    data: dataRating,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rating/store?store_id=${product?.store?.id}`
      );
      return data.data;
    },
    queryKey: ["get-rating"],
    enabled: true,
  });

  if (isFetching) {
    return <Loading />;
  }

  console.log(dataRating);
  return (
    <div className="">
      <div className="flex flex-col bg-gray-50 py-6  border mt-2 border-gray-200 p-6 rounded-xl">
        <h2 className="font-bold text-xl">About Seller</h2>
        <div className="flex flex-row  bg-gray-50 py-2 items-center">
          <Avatar className="w-16 h-16">
            <AvatarImage src={product?.store?.avatar_link} alt="seller" />
            <AvatarFallback>
              <IoStorefrontOutline className="w-8 h-8 text-gray-500" />
            </AvatarFallback>
          </Avatar>
          <div className="ml-5">
            <h3 className="font-medium text-gray-700 text-lg">
              {product?.store?.name}
            </h3>
            <div className="flex flex-row mb-2 space-x-1">
              <span className="font-semibold">
                {dataRating?.average_rate_store?.toFixed(1)}
              </span>
              <StarIcon
                className={classNames("text-yellow-400 h-5 w-5 flex-shrink-0")}
                aria-hidden="true"
              />
              <span className="font-thin">
                {`(${dataRating?.total_reviewers}) Reviews`}
              </span>
            </div>
            <h2 className="text-sm font-light flex flex-row gap-1 justify-center items-center">
              <GrLocationPin className="text-green-500" />{" "}
              {`${dataRating?.data[0]?.product?.store?.city?.city_name}, ${dataRating?.data[0]?.product?.store?.province?.province}`}
            </h2>
          </div>
          <Link
            href={`/seller/${product?.store?.id}`}
            className="text-white bg-green-700 py-2 px-4 rounded-lg text-sm ml-auto mr-2 "
          >
            Visit
          </Link>
        </div>
      </div>
    </div>
  );
}

export default InfoSeller;
