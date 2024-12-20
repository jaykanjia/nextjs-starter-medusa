"use client"

import { placeOrder } from "@lib/data/cart"
import { handlePagbankPixForm } from "@lib/data/pagbank"
import { handleRevcentOfflineForm } from "@lib/data/revcent"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"

const RevCentOfflinePaymentButton = ({
  valid,
  provider_id,
  cart,
}: {
  valid: boolean
  provider_id: string
  cart: any
}) => {
  const router = useRouter()

  const handleSubmit = async () => {
    
    console.log(`submitting this ${provider_id} with cart:`,cart);
    
    const res = await handleRevcentOfflineForm(provider_id, cart)
    if (res) {
      const cartRes: any = await placeOrder()
      console.log({ cartRes })

      if (cartRes) router.push(`/order/${cartRes?.order.id}/confirmed`)
    }
  }
  return (
    <div className="max-w-md p-6 bg-white rounded-md border">
      <h2 className="text-xl font-semibold mb-4">RevCent Payment</h2>
      {/* @ts-ignore */}
      <Button onClick={handleSubmit} className="w-full">
        Payment With RevCent
      </Button>
    </div>
  )
}

export default RevCentOfflinePaymentButton
