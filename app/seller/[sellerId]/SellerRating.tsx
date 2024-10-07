"use client";

import Loading from "@/components/Loading";
import { StarIcon } from "@heroicons/react/20/solid";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}

const SellerRating = ({ sellerId }: { sellerId: string }) => {
  const {
    isFetching,
    data: dataRating,
    isFetched,
    refetch,
  } = useQuery({
    queryFn: async () => {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/rating/store?store_id=${sellerId}`
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

  const reviews = {
    average: dataRating?.average_rate_store?.toFixed(1) || 0,
    totalCount: dataRating.total_reviewers,
    counts: Object.keys(dataRating.rating_count).map((rating) => ({
      rating: parseInt(rating),
      count: dataRating.rating_count[rating],
    })),
    featured: Object.values(dataRating.grouped_ratings)
      .flat()
      .map((review: any) => ({
        id: review.id,
        rating: review.rate,
        name: review.product ? review.product.name_product : "N/A",
        nameUser: review.user ? review.user.userProfile.name : "N/A",
        content: `<p>${review.review}</p>`,
        author: review.user ? review.user.userProfile.name : "N/A",
        avatarSrc: review.user?.userProfile?.avatar_link
          ? review.user?.userProfile?.avatar_link
          : "/placeholder-user.jpeg",
        productSrc: review?.product?.images[0]
          ? review?.product?.images[0]
          : "https://flowbite.com/docs/images/examples/image-1@2x.jpg",
        updatedAt: review.updatedAt, // pastikan properti ini ada di data review
      }))
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
  };

  return (
    <div className="bg-white">
      <div className="sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-12 lg:gap-x-8 lg:p-8">
        <div className="lg:col-span-3">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Customer Reviews
          </h2>

          <div className="mt-3 flex items-center">
            <div>
              <div className="flex items-center">
                {[0, 1, 2, 3, 4].map((rating) => (
                  <StarIcon
                    key={rating}
                    className={classNames(
                      reviews.average > rating
                        ? "text-yellow-400"
                        : "text-gray-300",
                      "h-5 w-5 flex-shrink-0"
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>
              <p className="sr-only">{reviews.average} out of 5 stars</p>
            </div>
            <p className="ml-2 text-sm text-gray-900">
              Based on {reviews.totalCount} reviews
            </p>
          </div>

          <div className="mt-6">
            <h3 className="sr-only">Review data</h3>

            <dl className="space-y-3">
              {reviews.counts.map((count) => (
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
                          count.count > 0 ? "text-yellow-400" : "text-gray-300",
                          "h-5 w-5 flex-shrink-0"
                        )}
                        aria-hidden="true"
                      />

                      <div className="relative ml-3 flex-1">
                        <div className="h-3 rounded-full border border-gray-200 bg-gray-100" />
                        {count.count > 0 ? (
                          <div
                            className="absolute inset-y-0 rounded-full border border-yellow-400 bg-yellow-400"
                            style={{
                              width: `calc(${count.count} / ${reviews.totalCount} * 100%)`,
                            }}
                          />
                        ) : null}
                      </div>
                    </div>
                  </dt>
                  <dd className="ml-3 w-10 text-right text-sm tabular-nums text-gray-900">
                    {Math.round((count.count / reviews.totalCount) * 100)}%
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="mt-16 lg:col-span-10 lg:col-start-6 lg:mt-0">
          <h3 className="sr-only">Recent reviews</h3>

          <div className="flow-root">
            <div className="-my-12 divide-y divide-gray-200">
              {reviews?.featured?.length > 0 ? (
                reviews.featured.map((review: any) => (
                  <div
                    key={review.id}
                    className="pt-12 grid grid-cols-5 border-b border-gray-300"
                  >
                    <Link
                      href="/"
                      className="my-auto aspect-square col-span-1 flex justify-start items-center flex-col"
                    >
                      <Image
                        src={review?.productSrc}
                        alt={`image`}
                        width={100}
                        height={100}
                        className="h-20 w-20 aspect-square rounded-lg"
                      />
                      <h2 className="font-bold mt-2">{review.name}</h2>
                    </Link>
                    <div className="col-span-4">
                      <div className="flex items-center">
                        <Image
                          src={review.avatarSrc}
                          alt={`${review.author}.`}
                          width={24}
                          height={24}
                          className="h-8 w-8 rounded-full"
                        />
                        <div className="ml-4">
                          <h4 className="text-sm font-bold text-gray-900">
                            {review.author}
                          </h4>
                          <div className="mt-1 flex items-center">
                            {[0, 1, 2, 3, 4].map((rating) => (
                              <StarIcon
                                key={rating}
                                className={classNames(
                                  review.rating > rating
                                    ? "text-yellow-400"
                                    : "text-gray-300",
                                  "h-4 w-4 flex-shrink-0"
                                )}
                                aria-hidden="true"
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      <div
                        className="mt-4 space-y-6 italic text-gray-600 text-sm"
                        dangerouslySetInnerHTML={{ __html: review.content }}
                      />
                    </div>
                  </div>
                ))
              ) : (
                <div className="pt-44 ml-40 border-gray-300">
                  <h1>No reviews available</h1>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerRating;
