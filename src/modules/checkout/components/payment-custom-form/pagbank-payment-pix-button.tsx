"use client"

import { handlePagbankPixForm } from "@lib/data/pagbank"
import { Button } from "@medusajs/ui"
import { useRouter } from "next/navigation"

const PagBankPaymentPixButton = ({
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
    const res = await handlePagbankPixForm(provider_id, cart)
    if (res) {
      router.push(`/order/pix/${cart?.id}`)
    }
  }
  return (
    <div className="max-w-md p-6 bg-white rounded-md border">
      <h2 className="text-xl font-semibold mb-4">PIX Payment</h2>
      {/* @ts-ignore */}
      <Button onClick={handleSubmit} className="w-full">
        Payment With Pix
      </Button>
    </div>
  )
}

export default PagBankPaymentPixButton
