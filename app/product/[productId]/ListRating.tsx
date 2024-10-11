"use client";

import Loading from "@/components/Loading";
import { ScrollArea } from "@/components/ui/scroll-area";
import { StarIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";

interface ListRatingProps {
  product: any;
}

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const ListRating: React.FC<ListRatingProps> = ({ product }) => {
  const {
    isFetching,
    data: dataRatingProduct,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rating?product_id=${product.id}`
      );
      return data.data;
    },
    queryKey: ["get-rating-product"],
    enabled: true,
  });

  if (isFetching) {
    return <Loading />;
  }
  let counts = [{ rating: 0, count: 0 }];
  if (isFetched && dataRatingProduct?.rating_counts) {
    counts = Object.entries(dataRatingProduct.rating_counts).map(
      ([rating, count]) => ({
        rating: parseInt(rating),
        // @ts-ignore
        count: parseInt(count),
      })
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="sm:px-6 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:p-8">
        <div className="lg:col-span-4">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
            Product Reviews
          </h2>

          <div className="mt-4 flex items-center">
            <div className="flex items-center">
              <span className="text-lg font-semibold text-gray-800">
                {dataRatingProduct?.average_rate_per_product || 0}
              </span>
              <StarIcon
                key={dataRatingProduct?.id}
                className="text-yellow-500 h-6 w-6 ml-1"
              />
            </div>
            <p className="ml-3 text-sm text-gray-700">
              Based on {dataRatingProduct.total_reviewer} reviews
            </p>
          </div>

          <div className="mt-8">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-4">
              {counts.map((count) => (
                <div key={count.rating} className="flex items-center text-sm">
                  <dt className="flex flex-1 items-center">
                    <p className="w-3 font-medium text-gray-800">
                      {count.rating}
                      <span className="sr-only"> star reviews</span>
                    </p>
                    <div
                      aria-hidden="true"
                      className="ml-2 flex flex-1 items-center"
                    >
                      <StarIcon
                        className={classNames(
                          count?.count || 0 > 0
                            ? "text-yellow-500"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />

                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-full border border-gray-300 bg-gray-200" />
                        {count?.count || 0 > 0 ? (
                          <div
                            className="absolute inset-y-0 rounded-full border border-yellow-500 bg-yellow-500"
                            style={{
                              width: `calc(${count?.count} / ${dataRatingProduct.total_reviewer || 0
                                } * 100%)`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-800">
                    {Math.round(
                      (count.count / dataRatingProduct.total_reviewer || 0) *
                      100
                    )}
                    %
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <div className="flow-root">
            {dataRatingProduct.data.length > 0 ? (
              <ScrollArea className="h-[300px] overflow-y-auto">
                {dataRatingProduct.data.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b border-gray-200 py-4"
                  >
                    <div className="flex items-center">
                      <Image
                        src={
                          review?.user?.userProfile?.avatar_link ||
                          "/placeholder-user.jpeg"
                        }
                        alt={`${review.id}.`}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full"
                      />
                      <div className="ml-4">
                        <h4 className="text-sm font-bold text-gray-900">
                          {review?.user?.userProfile?.name || "Anonymous"}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rate > rating
                                  ? "text-yellow-500"
                                  : "text-gray-300",
                                "h-5 w-5 flex-shrink-0"
                              )}
                              aria-hidden="true"
                            />
                          ))}
                        </div>
                        <p className="sr-only">{review.rate} out of 5 stars</p>
                      </div>
                    </div>

                    <div
                      id="rating"
                      className="mt-4 space-y-6 text-base text-gray-700"
                      dangerouslySetInnerHTML={{ __html: review.review }}
                    />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="w-full h-[250px] flex justify-center items-center text-gray-500">
                <h1>No ratings for this product yet</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListRating;
