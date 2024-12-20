"use client"

import { usePathname, useRouter, useSearchParams } from "next/navigation"

import Divider from "@modules/common/components/divider"
import PagBankPaymentCardButton from "./pagbank-payment-card-button"
import PagBankPaymentPixButton from "./pagbank-payment-pix-button"
import PagBankPaymentBoletoButton from "./pagbank-payment-boleto-button"
import SystemDefaultPaymentButton from "./system-default-payment-button"

import { useCallback, useContext, useEffect, useMemo, useState } from "react"
import ErrorMessage from "@modules/checkout/components/error-message"
import { CheckCircleSolid, CreditCard } from "@medusajs/icons"
import { Container, Heading, Text, clx } from "@medusajs/ui"
import { StripeCardElementOptions } from "@stripe/stripe-js"

import { isStripe as isStripeFunc, paymentInfoMap } from "@lib/constants"
// import { StripeContext } from "@modules/checkout/components/payment-wrapper"
import RevCentOfflinePaymentButton from "./revcent-offline-payment-button"

const CustomPaymentForm = ({
  cart,
  availablePaymentMethods,
}: {
  cart: any
  availablePaymentMethods: any[]
}) => {
  const activeSession = cart.payment_collection?.payment_sessions?.find(
    (paymentSession: any) => paymentSession.status === "pending"
  )

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cardBrand, setCardBrand] = useState<string | null>(null)
  const [cardComplete, setCardComplete] = useState(false)
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(
    activeSession?.provider_id ?? ""
  )

  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isOpen = searchParams.get("step") === "payment"

  const isStripe = isStripeFunc(activeSession?.provider_id)
  // const stripeReady = useContext(StripeContext)

  const paidByGiftcard =
    cart?.gift_cards && cart?.gift_cards?.length > 0 && cart?.total === 0

  const paymentReady =
    (activeSession && cart?.shipping_methods.length !== 0) || paidByGiftcard

  const useOptions: StripeCardElementOptions = useMemo(() => {
    return {
      style: {
        base: {
          fontFamily: "Inter, sans-serif",
          color: "#424270",
          "::placeholder": {
            color: "rgb(107 114 128)",
          },
        },
      },
      classes: {
        base: "pt-3 pb-1 block w-full h-11 px-4 mt-0 bg-ui-bg-field border rounded-md appearance-none focus:outline-none focus:ring-0 focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover transition-all duration-300 ease-in-out",
      },
    }
  }, [])

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams)
      params.set(name, value)

      return params.toString()
    },
    [searchParams]
  )

  const handleEdit = () => {
    router.push(pathname + "?" + createQueryString("step", "payment"), {
      scroll: false,
    })
  }

  useEffect(() => {
    setError(null)
  }, [isOpen])

  return (
    <div className="bg-white">
      <div className="flex flex-row items-center justify-between mb-6">
        <Heading
          level="h2"
          className={clx(
            "flex flex-row text-3xl-regular gap-x-2 items-baseline",
            {
              "opacity-50 pointer-events-none select-none":
                !isOpen && !paymentReady,
            }
          )}
        >
          Payment
          {!isOpen && paymentReady && <CheckCircleSolid />}
        </Heading>
        {!isOpen && paymentReady && (
          // @ts-ignore
          <Text>
            <button
              onClick={handleEdit}
              className="text-ui-fg-interactive hover:text-ui-fg-interactive-hover"
              data-testid="edit-payment-button"
            >
              Edit
            </button>
          </Text>
        )}
      </div>
      <div>
        <div className={isOpen ? "block" : "hidden"}>
          <div className="bg-white space-y-4">
            {availablePaymentMethods &&
              availablePaymentMethods.length &&
              availablePaymentMethods.map((availablePaymentMethod) => {
                switch (availablePaymentMethod.id) {
                  case "pp_pagbank-cc_pagbank":
                    return (
                      <PagBankPaymentCardButton
                        key={availablePaymentMethod.id}
                        provider_id={availablePaymentMethod.id}
                        valid={true}
                        cart={cart}
                      />
                    )
                  case "pp_pagbank-pix_pagbank":
                    return (
                      <PagBankPaymentPixButton
                        key={availablePaymentMethod.id}
                        provider_id={availablePaymentMethod.id}
                        valid={true}
                        cart={cart}
                      />
                    )

                  case "pp_pagbank-boleto_pagbank":
                    return (
                      <PagBankPaymentBoletoButton
                        key={availablePaymentMethod.id}
                        provider_id={availablePaymentMethod.id}
                        valid={true}
                        cart={cart}
                      />
                    )
                  case "pp_system_default":
                    return (
                      <SystemDefaultPaymentButton
                        key={availablePaymentMethod.id}
                        cart={cart}
                        valid={true}
                        provider_id={availablePaymentMethod.id}
                        activeSession={activeSession}
                      />
                    )
                  case "pp_revcent-offline_revcent":
                    return (
                      <RevCentOfflinePaymentButton
                        key={availablePaymentMethod.id}
                        provider_id={availablePaymentMethod.id}
                        valid={true}
                        cart={cart}
                      />
                    )
                }
              })}
            <Divider className="mt-8" />
          </div>

          <ErrorMessage
            error={error}
            data-testid="payment-method-error-message"
          />
        </div>

        <div className={isOpen ? "hidden" : "block"}>
          {cart && paymentReady && activeSession ? (
            <div className="flex items-start gap-x-1 w-full">
              <div className="flex flex-col w-1/3">
                {/* @ts-ignore */}
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment method
                </Text>
                {/* @ts-ignore */}
                <Text
                  className="txt-medium text-ui-fg-subtle"
                  data-testid="payment-method-summary"
                >
                  {paymentInfoMap[selectedPaymentMethod]?.title ||
                    selectedPaymentMethod}
                </Text>
              </div>
              <div className="flex flex-col w-1/3">
                {/* @ts-ignore */}
                <Text className="txt-medium-plus text-ui-fg-base mb-1">
                  Payment details
                </Text>
                <div
                  className="flex gap-2 txt-medium text-ui-fg-subtle items-center"
                  data-testid="payment-details-summary"
                >
                  {/* @ts-ignore */}
                  <Container className="flex items-center h-7 w-fit p-2 bg-ui-button-neutral-hover">
                    {paymentInfoMap[selectedPaymentMethod]?.icon || (
                      <CreditCard />
                    )}
                  </Container>
                  {/* @ts-ignore */}
                  <Text>
                    {isStripeFunc(selectedPaymentMethod) && cardBrand
                      ? cardBrand
                      : "Another step will appear"}
                  </Text>
                </div>
              </div>
            </div>
          ) : paidByGiftcard ? (
            <div className="flex flex-col w-1/3">
              {/* @ts-ignore */}
              <Text className="txt-medium-plus text-ui-fg-base mb-1">
                Payment method
              </Text>
              {/* @ts-ignore */}
              <Text
                className="txt-medium text-ui-fg-subtle"
                data-testid="payment-method-summary"
              >
                Gift card
              </Text>
            </div>
          ) : null}
        </div>
      </div>
      <Divider className="mt-8" />
    </div>
  )
}

export default CustomPaymentForm
