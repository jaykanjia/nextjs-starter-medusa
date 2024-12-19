"use client"

import { initiatePaymentSession } from "@lib/data/cart"
import { Button } from "@medusajs/ui"
import { useState } from "react"

const SystemDefaultPaymentButton = ({
  cart,
  valid,
  provider_id,
  activeSession,
}: {
  cart: any
  valid: boolean
  provider_id: string
  activeSession: boolean
}) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      console.log("handleSubmit cartdata: ", { cart })

      if (!activeSession) {
        await initiatePaymentSession(cart, {
          provider_id,
          context: { customer: cart?.customer, email: cart?.customer?.email },
        })
      }
    } catch (err: any) {
      console.error({ err })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      {/* @ts-ignore */}
      <Button
        onClick={handleSubmit}
        className="w-[200px] aspect-square flex item-center justify-center border"
        variant="transparent"
      >
        System Default Payment Button
      </Button>
    </>
  )
}

export default SystemDefaultPaymentButton
