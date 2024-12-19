"use client"
import { PaymentSessionDTO } from "@medusajs/types"
import { useEffect, useMemo, useRef } from "react"

const MipsPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: any
  notReady: boolean
  "data-testid"?: string
}) => {
  const paymentRef = useRef<HTMLDivElement>(null)

  console.log({ cart })

  const session = useMemo(
    () => cart?.payment_collection?.payment_sessions[0] as PaymentSessionDTO,
    [cart]
  )

  useEffect(() => {
    if (paymentRef.current) {
      paymentRef.current.innerHTML = ""
      if (
        session?.data?.operation_status === "success" &&
        session?.data?.payment_zone_data
      ) {
        console.log(paymentRef.current.innerHTML)

        if (!paymentRef.current.innerHTML) {
          const dynamicContent = session?.data?.payment_zone_data
          // Set the innerHTML of the div
          paymentRef.current.innerHTML += dynamicContent
        }
      }
    }
  }, [session])

  return <div ref={paymentRef}></div>
}

export default MipsPaymentButton
