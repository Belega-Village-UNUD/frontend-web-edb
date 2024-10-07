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

  console.log(dataRatingProduct);

  return (
    <div className="bg-white">
      <div className="sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:p-8">
        <div className="lg:col-span-4">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Product Reviews
          </h2>

          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                <span>{dataRatingProduct?.average_rate_per_product || 0}</span>
                <StarIcon
                  key={dataRatingProduct?.id}
                  className={"text-yellow-400 h-5 w-5 flex-shrink-0"}
                />
              </div>
            </div>
            <p className="ml-2 text-sm text-gray-900">
              Based on {dataRatingProduct.total_reviewer} reviews
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-3">
              {counts.map((count) => (
                <div key={count.rating} className="flex items-center text-sm">
                  <dt className="flex flex-1 items-center">
                    <p className="w-3 font-medium text-gray-900">
                      {count.rating}
                      <span className="sr-only"> star reviews</span>
                    </p>
                    <div
                      aria-hidden="true"
                      className="ml-1 flex flex-1 items-center"
                    >
                      <StarIcon
                        className={classNames(
                          count?.count || 0 > 0
                            ? "text-yellow-400"
                            : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />

                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                        {count?.count || 0 > 0 ? (
                          <div
                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                            style={{
                              width: `calc(${count?.count} / ${
                                dataRatingProduct.total_reviewer || 0
                              } * 100%)`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
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

          {/* <div className="mt-10">
            <h3 className="text-lg font-medium text-gray-900">
              Share your thoughts
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              If you’ve used this product, share your thoughts with other
              customers
            </p>

            <span className="mt-6 inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-8 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 sm:w-auto lg:w-full">
              Write a review
            </span>
          </div> */}
        </div>

        <div className="mt-16 lg:col-span-7 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <div className="flow-root">
            {dataRatingProduct.data.length > 0 ? (
              <ScrollArea className="h-[300px] ">
                {dataRatingProduct.data.map((review: any) => (
                  <div
                    key={review.id}
                    className="border-b max-h-36 border-gray-200"
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
                          {review?.user?.userProfile?.name || "User"}
                        </h4>
                        <div className="mt-1 flex items-center">
                          {[0, 1, 2, 3, 4].map((rating) => (
                            <StarIcon
                              key={rating}
                              className={classNames(
                                review.rate > rating
                                  ? "text-yellow-400"
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
                      className="mt-4 space-y-6 text-base text-gray-600 "
                      dangerouslySetInnerHTML={{ __html: review.review }}
                    />
                  </div>
                ))}
              </ScrollArea>
            ) : (
              <div className="w-full h-[250px] flex justify-center items-center text-blue-500">
                <h1>No ratings for this product yet</h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>

    // <div>
    //   <Heading title="Product Reviews" />
    //   <div className="text-sm mt-2">
    //     {product.reviews.map((review: any) => {
    //       return (
    //         <div key={review.id} className="max-w-300px">
    //           <div className="flex gap-2 items-center">
    //             <Avatar src={review?.user.image} />
    //             <div className="font-semibold">{review?.user.name}</div>
    //             <div className="font-light">{moment(review.createdDate).fromNow()}</div>
    //           </div>
    //           <div className="mt-2">
    //             <Rating value={review.rating} readOnly />
    //             <div className="ml-2">{review.comment}</div>
    //             <hr className="mt-3 mb-4" />
    //           </div>
    //         </div>
    //       )
    //     })}
    //   </div>
    // </div>
  );
};

export default ListRating;
