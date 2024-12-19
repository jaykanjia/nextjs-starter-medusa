"use client"

import { placeOrder } from "@lib/data/cart"
import { handlePagbankCCForm } from "@lib/data/pagbank"
import { Button, Input } from "@medusajs/ui"
import { useRouter } from "next/navigation"
import Script from "next/script"
import { useState } from "react"
import { useForm, Controller } from "react-hook-form"

type FormData = {
  cardHolderName: string
  cardNumber: string
  expiryDate: string
  cvv: string
}

const PagBankPaymentCardButton = ({
  valid,
  provider_id,
  cart,
}: {
  valid: boolean
  provider_id: string
  cart: any
}) => {
  // const [isLoading, setisLoading] = useState(false)
  const router = useRouter()
  const sortOptions = [
    {
      value: "1x",
      label: "1x de R$ 319,00",
    },
    {
      value: "2x",
      label: "2x de R$ 159,50",
    },
    {
      value: "3x",
      label: "3x de R$ 106,33",
    },
  ]

  const onSubmit = async (formData: FormData) => {
    console.log("Form Data:", formData)
    try {
      // Vencimento
      const expiryDate = formData.expiryDate
      const [expMonth, expYear] = (expiryDate as string).split("/")
      const fullExpYear = `20${expYear}`

      const cardData = {
        // holderName
        holder: formData.cardHolderName,
        // cardNumber
        number: formData.cardNumber?.toString()?.replace(/\D/g, ""),
        expMonth: expMonth,
        expYear: fullExpYear,
        securityCode: formData.cvv,
      }
      if (valid) {
        let encrypted = null
        //@ts-ignore
        if (window && window.PagSeguro) {
          //@ts-ignore
          const card = PagSeguro.encryptCard({
            publicKey: process.env.NEXT_PUBLIC_PAGBANK_PUBLIC_KEY,
            ...cardData,
          })

          console.log({ cardData })

          encrypted = card.encryptedCard
          const hasErrors = card.hasErrors
          const errors = card.errors

          console.log({ encrypted, errors })

          if (hasErrors) {
            // toast({
            //   description: errors.map((error: any) => error.message).join(","),
            // })

            console.error(
              "error: ",
              errors.map((error: any) => error.message).join(",")
            )

            return
          }
        }

        console.log("inside valid condition and pagbank payment starts")
        const res = await handlePagbankCCForm(provider_id, cart, {
          ...cardData,
          encrypted,
        })

        console.log({ res })

        if (res) {
          const cartRes: any = await placeOrder()
          console.log({ cartRes })

          if (cartRes) router.push(`/order/${cartRes?.order.id}/confirmed`)
        }

        console.log("pagbank payment ends")
      } else {
        console.log("Invalid CPF/CNPJ")
      }
    } catch (error) {
      console.error("Error during payment:", error)
    } finally {
    }
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isLoading, isSubmitting },
  } = useForm<FormData>()

  return (
    <>
      <Script src="https://assets.pagseguro.com.br/checkout-sdk-js/rc/dist/browser/pagseguro.min.js" />
      <div className="max-w-md p-6 bg-white rounded-md border">
        <h2 className="text-xl font-semibold mb-4">Credit Card Payment</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Card Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Number
            </label>
            {/* @ts-ignore */}
            <Input
              type="text"
              {...register("cardNumber", {
                required: "Card number is required",
                pattern: {
                  value: /^[0-9]{16}$/,
                  message: "Card number must be 16 digits",
                },
              })}
            />
            {errors.cardNumber && (
              <span className="text-sm text-red-500">
                {errors.cardNumber.message}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Expiry Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expiry Date (MM/YY)
              </label>
              <Controller
                name="expiryDate"
                control={control}
                rules={{
                  required: "Expiry date is required",
                  pattern: {
                    value: /^(0[1-9]|1[0-2])\/\d{2}$/,
                    message: "Invalid expiry date format (MM/YY)",
                  },
                }}
                render={({ field }) => (
                  // @ts-ignore
                  <Input type="text" {...field} />
                )}
              />
              {errors.expiryDate && (
                <span className="text-sm text-red-500">
                  {errors.expiryDate.message}
                </span>
              )}
            </div>

            {/* CVV */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                CVV
              </label>
              {/* @ts-ignore */}
              <Input
                type="text"
                {...register("cvv", {
                  required: "CVV is required",
                  pattern: {
                    value: /^[0-9]{3,4}$/,
                    message: "CVV must be 3 or 4 digits",
                  },
                })}
              />
              {errors.cvv && (
                <span className="text-sm text-red-500">
                  {errors.cvv.message}
                </span>
              )}
            </div>
          </div>
          {/* Card Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Card Holder Name
            </label>
            {/* @ts-ignore */}
            <Input
              type="text"
              {...register("cardHolderName", {
                required: "Card holder name is required",
              })}
            />
            {errors.cardHolderName && (
              <span className="text-sm text-red-500">
                {errors.cardHolderName.message}
              </span>
            )}
          </div>

          {/* Submit Button */}
          {/* @ts-ignore */}
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || isSubmitting}
          >
            {isLoading || isSubmitting
              ? "Loading..."
              : " Payment With Credit Card"}
          </Button>
        </form>
      </div>
    </>
  )
}

export default PagBankPaymentCardButton
