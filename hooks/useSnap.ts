import { MIDTRANS_APP_URL, MIDTRANS_CLIENT_KEY } from "@/utils/const";
import { useEffect, useState } from "react";

const useSnap = () => {
  const [snap, setSnap] = useState<any>(null);

  useEffect(() => {
    const myMidtransClientKey = MIDTRANS_CLIENT_KEY;
    const script = document.createElement("script");
    script.src = `${MIDTRANS_APP_URL}/snap/snap.js`;
    script.setAttribute("data-client-key", myMidtransClientKey || "");
    script.onload = () => {
      // @ts-ignore
      setSnap(window.snap);
    };
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const snapEmbed = (snap_token: string, embedId: string, action: any) => {
    if (snap) {
      snap.embed(snap_token, {
        embedId: embedId,
        onSuccess: function (result: any) {
          action.onSuccess(result);
        },
        onPending: function (result: any) {
          action.onPending(result);
        },
        onclose: function () {
          action.onClose();
        },
      });
    }
  };

  return { snapEmbed };
};

export default useSnap;
