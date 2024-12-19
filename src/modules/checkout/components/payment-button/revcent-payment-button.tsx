"use client"

import { placeOrder } from "@lib/data/cart"
import { useState } from "react"
import ErrorMessage from "../error-message"

const RevcentPaymentButton = ({
  notReady,
  cart,
}: {
  notReady: boolean
  cart: any
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const onPaymentCompleted = async () => {
    await placeOrder()
      .catch((err) => {
        setErrorMessage(err.message)
      })
      .finally(() => {
        setSubmitting(false)
      })
  }

  const handlePayment = () => {
    setSubmitting(true)

    onPaymentCompleted()
  }

  return (
    <>
      <button
        disabled={notReady || submitting}
        onClick={handlePayment}
        data-testid="submit-order-button"
        className="bg-black text-white border rounded-md px-6 py-2 border-gray"
      >
        {submitting ? "Loading..." : "Place order"}
      </button>
      <ErrorMessage
        error={errorMessage}
        data-testid="manual-payment-error-message"
      />
    </>
  )
}

export default RevcentPaymentButton
