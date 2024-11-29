"use client";


interface PaymentProps {
  dataCheckout: any;
  profile: any;
}

function Payment({ dataCheckout, profile }: PaymentProps) {
  console.log('line 1: ', JSON.stringify(profile));
  return (
    <div className="md:w-5/12">
      <div className="w-full mx-auto rounded-lg bg-white border border-gray-200 p-6 text-gray-800 font-light mb-2 shadow-md">
        {[
          { label: "Order Number", value: dataCheckout?.id },
          { label: "Name", value: profile?.name },
          { label: "Email", value: dataCheckout?.cart_details[0]?.user?.email },
          { label: "Address", value: profile?.address },
          { label: "Province", value: profile?.city?.province },
          { label: "City", value: profile?.city?.city_name },
          { label: "Postal Code", value: profile?.city?.postal_code },
          { label: "Phone", value: profile?.phone ? profile?.phone : "-" },
        ].map((item, index) => (
          <div key={index} className="w-full flex mb-3 items-center justify-between">
            <div className="w-32 text-left">
              <span className="text-gray-600 font-semibold">{item.label}</span>
            </div>
            <div className="flex-grow pl-3 text-right">
              <span>{item.value}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Payment;
